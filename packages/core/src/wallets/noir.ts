import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from '../types';
import { generateZip321Uri } from '../zip321';
import { ZcashNetwork } from '../types';

export function isNoirAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return Boolean(win.noirwallet || win.noir || win.__noirWallet);
}

function getNoirProvider(): any {
  if (typeof window === 'undefined') return null;
  const win = window as any;
  const raw = win.noirwallet || win.noir || win.__noirWallet;
  if (!raw) return null;

  // Standard Noir extension injection: window.noirwallet.zcash has the .request() RPC method
  if (raw.zcash && typeof raw.zcash.request === 'function') {
    return raw.zcash;
  }
  if (typeof raw.request === 'function') {
    return raw;
  }
  return raw.zcash || raw;
}

/**
 * Extracts a Zcash address from Noir Wallet's connection payload.
 * Noir Wallet returns:
 * {
 *   transparent: "t1...",
 *   shielded: "u1...",
 *   accounts: [
 *     { id: "...", label: "...", addresses: { transparent: "...", shielded: "..." } }
 *   ]
 * }
 */
function extractAddress(res: any): string | null {
  if (!res) return null;

  if (typeof res === 'string' && res.trim().length > 0) {
    return res.trim();
  }

  // 1. Direct fields on the connection object (Noir Wallet SDK pattern)
  // Priority: shielded/unified addresses first for privacy, then transparent
  if (typeof res.shielded === 'string' && res.shielded.trim()) return res.shielded.trim();
  if (typeof res.unified === 'string' && res.unified.trim()) return res.unified.trim();
  if (typeof res.unifiedAddress === 'string' && res.unifiedAddress.trim())
    return res.unifiedAddress.trim();
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
      if (typeof acc?.transparent === 'string' && acc.transparent.trim())
        return acc.transparent.trim();
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
  icon: 'N',
  description: 'Self-custodial privacy extension for shielded Zcash & ZECFi',
  category: 'extension',
  downloadUrl: 'https://chromewebstore.google.com/detail/noir-wallet',
  isAvailable: isNoirAvailable,

  connect: async (options): Promise<WalletSession> => {
    if (typeof window === 'undefined') {
      throw new Error('Noir Wallet is only available in browser environments.');
    }

    const win = window as any;
    const noir = win.noirwallet || win.noir || win.__noirWallet;

    if (!noir) {
      if (options?.customKey?.trim()) {
        const customAddr = options.customKey.trim();
        const isTestnet =
          customAddr.startsWith('utest') ||
          customAddr.startsWith('tm') ||
          customAddr.startsWith('ztest');
        return {
          address: customAddr,
          connected: true,
          network: isTestnet ? 'testnet' : options?.network || 'mainnet',
          walletId: 'noir',
        };
      }
      throw new Error(
        'Noir Wallet extension was not detected. Please install Noir Wallet from the Chrome Web Store.'
      );
    }

    const provider = getNoirProvider();
    let connectRes: any = null;

    try {
      // 1. First attempt: Direct RPC method `zcash_requestAccounts` (the native Noir extension method)
      if (provider && typeof provider.request === 'function') {
        try {
          connectRes = await provider.request({ method: 'zcash_requestAccounts' });
        } catch (rpcErr: any) {
          // If user actively rejected/cancelled the popup
          if (
            rpcErr?.code === 4001 ||
            rpcErr?.message?.toLowerCase().includes('reject') ||
            rpcErr?.message?.toLowerCase().includes('cancel')
          ) {
            throw new Error('Connection request was rejected in Noir Wallet.');
          }
          console.warn('zcash_requestAccounts error, trying SDK connect():', rpcErr);
        }
      }

      // 2. Second attempt: SDK-style `connect()` method on noir.zcash
      if (!connectRes && noir.zcash && typeof noir.zcash.connect === 'function') {
        try {
          connectRes = await noir.zcash.connect();
        } catch (connectErr: any) {
          console.warn('noir.zcash.connect() error:', connectErr);
        }
      }

      // 3. Third attempt: `zcash_getAccounts` (silent check if already authorized)
      if (!connectRes && provider && typeof provider.request === 'function') {
        try {
          connectRes = await provider.request({ method: 'zcash_getAccounts' });
        } catch {
          // ignore
        }
      }

      let address = extractAddress(connectRes);

      // 4. Fallback if user entered address manually
      if (!address && options?.customKey?.trim()) {
        address = options.customKey.trim();
      }

      if (!address) {
        throw new Error(
          'No address returned from Noir Wallet authorization. Please unlock Noir Wallet and approve the connection in the extension window.'
        );
      }

      // Automatically detect network from the address prefix
      const isTestnet =
        address.startsWith('utest') || address.startsWith('tm') || address.startsWith('ztest');
      const network: ZcashNetwork = isTestnet ? 'testnet' : options?.network || 'mainnet';

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
    const provider = getNoirProvider();
    if (!provider || typeof provider.request !== 'function') return null;

    try {
      const balRes = await provider.request({ method: 'zcash_getBalance' });
      if (typeof balRes === 'number') return balRes;
      if (typeof balRes === 'string') return parseFloat(balRes);
      if (balRes?.total !== undefined) return parseFloat(balRes.total);
      if (balRes?.shielded !== undefined) return parseFloat(balRes.shielded);
      if (balRes?.available !== undefined) return parseFloat(balRes.available);
      if (balRes?.spendable !== undefined) return parseFloat(balRes.spendable);
      if (balRes?.transparent !== undefined) return parseFloat(balRes.transparent);
    } catch {
      // fallback
    }
    return null;
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
    const provider = getNoirProvider();

    if (provider && typeof provider.request === 'function') {
      try {
        const txId = await provider.request({
          method: 'zcash_sendTransaction',
          params: [
            {
              to: params.recipient,
              amount: params.amount.toString(),
              memo: params.memo,
              feeTier: 'standard',
              fundingSource: 'shielded',
            },
          ],
        });

        return {
          txId: typeof txId === 'string' ? txId : txId?.txId || txId?.hash || '',
          submitted: true,
        };
      } catch (err) {
        console.warn('zcash_sendTransaction failed, fallback to ZIP-321 URI:', err);
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
