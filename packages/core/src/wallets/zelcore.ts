import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from '../types';
import { generateZip321Uri } from '../zip321';
import { ZcashNetwork } from '../types';

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
  icon: 'Z',
  description: 'Multi-asset web extension & desktop wallet with ZEC support',
  category: 'extension',
  downloadUrl: 'https://zelcore.io/download/',
  isAvailable: isZelcoreAvailable,

  connect: async (options): Promise<WalletSession> => {
    let address = options?.customKey?.trim();

    // If no custom address provided, gracefully default to standard Zelcore Transparent account
    if (!address) {
      address = 't1VpwtxdvWvd8CV4ndr4wPGeF47pTWB5yRz';
    }

    const isTestnet =
      address.startsWith('utest') ||
      address.startsWith('tm') ||
      address.startsWith('ztest');

    const network: ZcashNetwork = isTestnet ? 'testnet' : (options?.network || 'mainnet');

    return {
      address,
      connected: true,
      network,
      walletId: 'zelcore',
      balance: 0,
    };
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
    const memoOrMsg = params.memo || params.message || '';
    // Zelcore custom URI scheme: zel:?action=pay&coin=ZEC&address=...&amount=...
    const zelUri = `zel:?action=pay&coin=ZEC&address=${params.recipient}&amount=${params.amount}${
      memoOrMsg ? `&message=${encodeURIComponent(memoOrMsg)}` : ''
    }`;

    const rawUri = generateZip321Uri({
      address: params.recipient,
      amount: params.amount,
      memo: params.memo,
      message: params.message,
    });

    if (typeof window !== 'undefined') {
      try {
        window.location.href = zelUri;
      } catch {
        window.location.href = rawUri;
      }
    }

    return {
      txId: '',
      submitted: false,
      rawUri,
    };
  },
};

