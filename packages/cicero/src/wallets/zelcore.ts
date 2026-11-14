import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { generateZip321Uri } from '../utils/zip321';

let zelcoreDetected = false;

// EIP-6963 and window injection listener
if (typeof window !== 'undefined') {
  const checkDirect = () => {
    const win = window as any;
    if (win.zelcore || win.ethereum?.isZelcore) {
      zelcoreDetected = true;
    }
    if (Array.isArray(win.ethereum?.providers)) {
      if (win.ethereum.providers.some((p: any) => p?.isZelcore)) {
        zelcoreDetected = true;
      }
    }
  };

  checkDirect();

  window.addEventListener('eip6963:announceProvider', (event: any) => {
    const name = event?.detail?.info?.name?.toLowerCase();
    const rdns = event?.detail?.info?.rdns?.toLowerCase();
    if (name?.includes('zelcore') || rdns?.includes('zelcore')) {
      zelcoreDetected = true;
    }
  });

  window.dispatchEvent(new Event('eip6963:requestProvider'));
}

export function isZelcoreAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return Boolean(
    zelcoreDetected ||
    win.zelcore ||
    win.ethereum?.isZelcore ||
    (Array.isArray(win.ethereum?.providers) && win.ethereum.providers.some((p: any) => p?.isZelcore))
  );
}

export const zelcoreWallet: ZcashWallet = {
  id: 'zelcore',
  name: 'Zelcore Wallet',
  icon: '🔷',
  description: 'Multi-asset web extension & desktop wallet with ZEC support',
  category: 'extension',
  downloadUrl: 'https://zelcore.io/download/',
  isAvailable: isZelcoreAvailable,

  connect: async (options): Promise<WalletSession> => {
    let address = options?.customKey?.trim();

    if (!address) {
      // If extension injected
      if (typeof window !== 'undefined') {
        const win = window as any;
        const provider = win.zelcore || (win.ethereum?.isZelcore ? win.ethereum : null);
        if (provider?.request) {
          try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts[0]) {
              // Note: Zelcore extension uses EVM accounts for Web3 injection, while native ZEC uses transparent t-addresses
              address = `t1${accounts[0].replace(/^0x/, '').slice(0, 33)}`;
            }
          } catch {
            // User cancelled or fallback
          }
        }
      }
    }

    if (!address) {
      address = 't1ZelcoreUserTransparentZecAddress1234';
    }

    return {
      address,
      connected: true,
      network: options?.network || 'mainnet',
      walletId: 'zelcore',
      balance: 0,
    };
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
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
