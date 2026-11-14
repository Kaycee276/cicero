import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { generateZip321Uri } from '../utils/zip321';

export function isNoirAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return Boolean(win.noirwallet || win.noir || win.__noirWallet);
}

/**
 * Extracts a Zcash address from Noir Wallet's connection or accounts payload.
 * Noir Wallet SDK returns:
 * {
 *   transparent: 't1...',
 *   shielded: 'u1...',
 *   accounts: [ { id, label, addresses: { transparent, shielded } } ]
 * }
 */
function extractAddress(res: any): string | null {
  if (!res) return null;

  if (typeof res === 'string' && res.trim().length > 0) {
    return res.trim();
  }

  // 1. Direct fields on the connection object (Noir Wallet SDK pattern)
  // Prefer shielded/unified addresses first, then transparent
  if (typeof res.shielded === 'string' && res.shielded.trim()) return res.shielded.trim();
  if (typeof res.unified === 'string' && res.unified.trim()) return res.unified.trim();
  if (typeof res.unifiedAddress === 'string' && res.unifiedAddress.trim()) return res.unifiedAddress.trim();
  if (typeof res.address === 'string' && res.address.trim()) return res.address.trim();
  if (typeof res.transparent === 'string' && res.transparent.trim()) return res.transparent.trim();

  // 2. Nested inside accounts array (connection.accounts[0].addresses)
  if (Array.isArray(res.accounts) && res.accounts.length > 0) {
    for (const acc of res.accounts) {
      if (typeof acc === 'string' && acc.trim()) return acc.trim();
      if (acc?.addresses) {
        if (typeof acc.addresses.shielded === 'string' && acc.addresses.shielded.trim()) {
          return acc.addresses.shielded.trim();
        }
        if (typeof acc.addresses.unified === 'string' && acc.addresses.unified.trim()) {
          return acc.addresses.unified.trim();
        }
        if (typeof acc.addresses.transparent === 'string' && acc.addresses.transparent.trim()) {
          return acc.addresses.transparent.trim();
        }
      }
      if (typeof acc?.shielded === 'string' && acc.shielded.trim()) return acc.shielded.trim();
      if (typeof acc?.unified === 'string' && acc.unified.trim()) return acc.unified.trim();
      if (typeof acc?.address === 'string' && acc.address.trim()) return acc.address.trim();
      if (typeof acc?.transparent === 'string' && acc.transparent.trim()) return acc.transparent.trim();
    }
  }

  // 3. Array of accounts or addresses directly
  if (Array.isArray(res) && res.length > 0) {
    for (const item of res) {
      const extracted = extractAddress(item);
      if (extracted) return extracted;
    }
  }

  return null;
}

export const noirWallet: ZcashWallet = {
  id: 'noir',
  name: 'Noir Wallet',
  icon: '🖤',
  description: 'Self-custodial privacy extension for shielded Zcash & ZECFi',
  category: 'extension',
  downloadUrl: 'https://chromewebstore.google.com/detail/noir-wallet',
  isAvailable: isNoirAvailable,

  connect: async (options): Promise<WalletSession> => {
    if (typeof window === 'undefined') {
      throw new Error('Noir Wallet is only available in browser environments.');
    }

    const win = window as any;
    const noir = win.noirwallet || win.noir;

    if (!noir) {
      if (options?.customKey?.trim()) {
        return {
          address: options.customKey.trim(),
          connected: true,
          network: options?.network || 'mainnet',
          walletId: 'noir',
        };
      }
      throw new Error('Noir Wallet extension was not detected. Please install Noir Wallet from the Chrome Web Store.');
    }

    try {
      let address: string | null = null;
      const network = options?.network || 'mainnet';

      // 1. Primary path: noir.zcash.connect()
      if (noir.zcash && typeof noir.zcash.connect === 'function') {
        const connectRes = await noir.zcash.connect();
        address = extractAddress(connectRes);
      }

      // 2. Fallback: noir.zcash.getAccounts() silent check
      if (!address && noir.zcash && typeof noir.zcash.getAccounts === 'function') {
        const accountsRes = await noir.zcash.getAccounts();
        address = extractAddress(accountsRes);
      }

      // 3. Fallback: noir.request()
      if (!address && typeof noir.request === 'function') {
        try {
          const reqRes = await noir.request({ method: 'connect' });
          address = extractAddress(reqRes);
        } catch {
          // ignore fallback
        }
      }

      // 4. Fallback if user pasted an address into the modal input
      if (!address && options?.customKey?.trim()) {
        address = options.customKey.trim();
      }

      if (!address) {
        throw new Error('No address returned from Noir Wallet authorization. Please unlock Noir Wallet and approve the connection.');
      }

      return {
        address,
        connected: true,
        network,
        walletId: 'noir',
      };
    } catch (err: any) {
      console.error('Error connecting to Noir Wallet:', err);
      throw new Error(err?.message || 'Failed to authorize connection in Noir Wallet extension.');
    }
  },

  getBalance: async (_options) => {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    const noir = win.noirwallet || win.noir;

    if (noir?.zcash && typeof noir.zcash.getBalance === 'function') {
      try {
        const bal = await noir.zcash.getBalance();
        if (typeof bal === 'number') return bal;
        if (typeof bal === 'string') return parseFloat(bal);
        if (bal?.total !== undefined) return Number(bal.total);
        if (bal?.shielded !== undefined) return Number(bal.shielded);
        if (bal?.transparent !== undefined) return Number(bal.transparent);
      } catch {
        // fallback
      }
    }
    return null;
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      const noir = win.noirwallet || win.noir;

      if (noir?.zcash && typeof noir.zcash.send === 'function') {
        try {
          // Send via Noir SDK parameters (supports 'to' and 'recipient', feeTier, fundingSource)
          const txRes = await noir.zcash.send({
            to: params.recipient,
            recipient: params.recipient,
            amount: params.amount,
            memo: params.memo,
            feeTier: 'standard',
            fundingSource: 'shielded',
          });
          return {
            txId: txRes?.txId || txRes?.hash || txRes?.id || '',
            submitted: true,
          };
        } catch (err) {
          console.warn('Noir send failed, falling back to ZIP-321 URI:', err);
        }
      }
    }

    const rawUri = generateZip321Uri({
      address: params.recipient,
      amount: params.amount,
      memo: params.memo,
      message: params.message,
    });

    if (typeof window !== 'undefined') {
      window.location.href = rawUri;
    }

    return {
      txId: '',
      submitted: false,
      rawUri,
    };
  },
};
