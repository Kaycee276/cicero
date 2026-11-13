import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { generateZip321Uri } from '../utils/zip321';

export const ywallet: ZcashWallet = {
  id: 'ywallet',
  name: 'Ywallet',
  icon: '⚡',
  description: 'Fast-syncing multi-platform shielded wallet for mobile & desktop',
  category: 'mobile',
  downloadUrl: 'https://ywallet.app/',
  isAvailable: () => true,

  connect: async (options): Promise<WalletSession> => {
    return {
      connected: true,
      network: options?.network || 'mainnet',
      walletId: 'ywallet',
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
