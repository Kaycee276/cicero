import { ZcashWallet, WalletSession } from './types';

export const viewingKeyWallet: ZcashWallet = {
  id: 'viewing-key',
  name: 'Viewing Key / Auditor',
  icon: 'VK',
  description: 'Connect with a Unified Address or Viewing Key for read-only audit mode',
  category: 'read-only',
  isAvailable: () => true,

  connect: async (options): Promise<WalletSession> => {
    return {
      connected: true,
      network: options?.network || 'mainnet',
      walletId: 'viewing-key',
    };
  },
};
