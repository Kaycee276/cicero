import { ZcashWallet, WalletSession, SendPaymentParams, SendPaymentResult } from '../types';

// Deterministic or random mock session address
const MOCK_BURNER_ADDR =
  'u1qwe829xkps9482mzsll049281kz8471hzkas093847zkd09472619as8361048293710293847102938471029384710';

export const burnerWallet: ZcashWallet = {
  id: 'burner',
  name: 'Dev Session Wallet',
  icon: 'DEV',
  description: 'Instant ephemeral shielded test wallet for rapid local testing',
  category: 'developer',
  isAvailable: () => true,

  connect: async (options): Promise<WalletSession> => {
    return {
      address: MOCK_BURNER_ADDR,
      connected: true,
      network: options?.network || 'testnet',
      walletId: 'burner',
    };
  },

  sendPayment: async (_params: SendPaymentParams): Promise<SendPaymentResult> => {
    const mockTxId = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    return {
      txId: mockTxId,
      submitted: true,
    };
  },
};
