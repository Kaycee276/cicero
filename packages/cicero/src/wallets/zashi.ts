import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { generateZip321Uri } from '../utils/zip321';

export const zashiWallet: ZcashWallet = {
  id: 'zashi',
  name: 'Zashi by ECC',
  icon: 'Z',
  description: 'Official zero-knowledge mobile wallet by Electric Coin Co.',
  category: 'mobile',
  downloadUrl: 'https://electriccoin.co/zashi/',
  isAvailable: () => true, // Available via mobile QR or deep link

  connect: async (options): Promise<WalletSession> => {
    // In a mobile/QR context, user can connect by scanning or confirming their Unified Address
    return {
      connected: true,
      network: options?.network || 'mainnet',
      walletId: 'zashi',
    };
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
    const rawUri = generateZip321Uri({
      address: params.recipient,
      amount: params.amount,
      memo: params.memo,
      message: params.message,
    });

    // Trigger protocol handler if on mobile or supported desktop
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
