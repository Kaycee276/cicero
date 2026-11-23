import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from './types';
import { ZucchiniWalletAdapter } from '../wallet/zucchini';

const adapter = new ZucchiniWalletAdapter();

export const zucchiniWallet: ZcashWallet = {
  id: 'zucchini',
  name: 'Zucchini Wallet',
  icon: 'Z',
  description: 'In-browser Chrome extension with 1-click side-panel approvals',
  category: 'extension',
  downloadUrl: 'https://chromewebstore.google.com/detail/zucchini-wallet',
  isAvailable: () => ZucchiniWalletAdapter.isAvailable(),

  connect: async (options): Promise<WalletSession> => {
    const session = await adapter.connect();
    return {
      address: session.address,
      connected: true,
      network: session.network || options?.network || 'mainnet',
      walletId: 'zucchini',
      balance: session.balance,
    };
  },

  disconnect: async () => {
    await adapter.disconnect();
  },

  getBalance: async (options) => {
    return adapter.getBalance(options);
  },

  getNetwork: async () => {
    return adapter.getNetwork();
  },

  switchNetwork: async (network) => {
    return adapter.switchNetwork(network);
  },

  sendPayment: async (params: SendPaymentParams): Promise<SendPaymentResult> => {
    const res = await adapter.requestPayment({
      recipient: params.recipient,
      amount: params.amount,
      memo: params.memo,
    });
    return {
      txId: res.txId,
      submitted: res.submitted,
    };
  },
};
