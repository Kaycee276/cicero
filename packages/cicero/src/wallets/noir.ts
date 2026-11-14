import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { generateZip321Uri } from '../utils/zip321';

export function isNoirAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return Boolean(win.noirwallet || win.noir || win.__noirWallet);
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
      // If user pasted an address as customKey
      if (options?.customKey) {
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
      let network = options?.network || 'mainnet';

      // Noir exposes window.noirwallet.zcash
      if (noir.zcash && typeof noir.zcash.connect === 'function') {
        const accounts = await noir.zcash.connect();
        if (Array.isArray(accounts) && accounts.length > 0) {
          address = typeof accounts[0] === 'string' ? accounts[0] : (accounts[0].address || accounts[0].unifiedAddress);
        } else if (typeof accounts === 'string') {
          address = accounts;
        }

        // If addresses method available
        if (!address && typeof noir.zcash.getAddresses === 'function') {
          const addrs = await noir.zcash.getAddresses();
          address = addrs?.unified || addrs?.shielded || addrs?.transparent || (Array.isArray(addrs) ? addrs[0] : null);
        }
      } else if (typeof noir.request === 'function') {
        // Fallback to request method
        const accounts = await noir.request({ method: 'connect' });
        if (Array.isArray(accounts) && accounts.length > 0) {
          address = accounts[0];
        }
      }

      if (!address) {
        // Try getting existing accounts silently
        if (noir.zcash && typeof noir.zcash.getAccounts === 'function') {
          const accounts = await noir.zcash.getAccounts();
          if (Array.isArray(accounts) && accounts.length > 0) {
            address = typeof accounts[0] === 'string' ? accounts[0] : (accounts[0].address || accounts[0].unifiedAddress);
          }
        }
      }

      // If user provided a fallback address
      if (!address && options?.customKey) {
        address = options.customKey.trim();
      }

      if (!address) {
        throw new Error('No address returned from Noir Wallet authorization.');
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
        if (bal?.total !== undefined) return Number(bal.total);
        if (bal?.shielded !== undefined) return Number(bal.shielded);
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
          const txRes = await noir.zcash.send({
            recipient: params.recipient,
            amount: params.amount,
            memo: params.memo,
          });
          return {
            txId: txRes?.txId || txRes?.hash || '',
            submitted: true,
          };
        } catch {
          // fallback to ZIP-321
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
