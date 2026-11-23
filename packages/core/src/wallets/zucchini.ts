import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from '../types';
import { ZucchiniExtensionAdapter } from './ZucchiniExtensionAdapter';

export const zucchiniExtensionAdapter = new ZucchiniExtensionAdapter();
const adapter = zucchiniExtensionAdapter;

export const zucchiniWallet: ZcashWallet = {
  id: 'zucchini',
  name: 'Zucchini Wallet',
  icon: 'Z',
  description: 'In-browser Chrome extension with 1-click side-panel approvals',
  category: 'extension',
  downloadUrl: 'https://chromewebstore.google.com/detail/zucchini-wallet',
  isAvailable: () => ZucchiniExtensionAdapter.isAvailable(),

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

  onNetworkChange: (listener) => adapter.onNetworkChanged(listener),
  onAccountChange: (listener) =>
    adapter.onAccountsChanged((accounts: any) => {
      const first = Array.isArray(accounts) ? accounts[0] : accounts?.accounts?.[0];
      const address =
        first?.address ||
        accounts?.unified ||
        accounts?.orchard ||
        accounts?.sapling ||
        accounts?.transparent;
      void adapter.getNetwork().then((network) => {
        listener({
          walletId: 'zucchini',
          connected: Boolean(address),
          address: address || undefined,
          network,
        });
      });
    }),
  onDisconnected: (listener) => adapter.onDisconnect(listener),
};
