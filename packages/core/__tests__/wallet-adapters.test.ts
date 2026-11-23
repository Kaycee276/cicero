import { describe, expect, it, vi } from 'vitest';
import {
  DevSessionWalletAdapter,
  NoirWalletAdapter,
  ViewingKeyAdapter,
  YwalletAdapter,
  ZelcoreWalletAdapter,
  ZashiWalletAdapter,
  ZucchiniWalletAdapter,
} from '../src/wallets/adapters';
import type { WalletSession, ZcashNetwork, ZcashWallet } from '../src/types';

type AdapterConstructor = new (wallet: ZcashWallet) => {
  connect: (options?: { network?: ZcashNetwork }) => Promise<WalletSession>;
  disconnect: () => Promise<void>;
  getAddress: () => string | null;
  on: (event: 'accountChange' | 'networkChange' | 'disconnect', listener: (payload: any) => void) => () => void;
  switchNetwork: (network: ZcashNetwork) => Promise<{ success: boolean; currentNetwork?: ZcashNetwork }>;
};

const adapterCases: Array<[string, AdapterConstructor]> = [
  ['Zucchini', ZucchiniWalletAdapter],
  ['Noir', NoirWalletAdapter],
  ['Zelcore', ZelcoreWalletAdapter],
  ['Zashi', ZashiWalletAdapter],
  ['Ywallet', YwalletAdapter],
  ['Viewing Key', ViewingKeyAdapter],
  ['Dev Session', DevSessionWalletAdapter],
];

function createMockWallet(id: string) {
  const listeners = {
    account: (_session: WalletSession | null) => {},
    network: (_network: ZcashNetwork) => {},
    disconnected: () => {},
  };
  const wallet: ZcashWallet = {
    id,
    name: id,
    icon: id.slice(0, 1),
    description: `${id} mock wallet`,
    category: 'extension',
    isAvailable: () => true,
    connect: vi.fn(async (options) => ({
      walletId: id,
      connected: true,
      address: `${id}-address`,
      network: options?.network ?? 'mainnet',
    })),
    disconnect: vi.fn(async () => {}),
    switchNetwork: vi.fn(async (network) => ({ success: true, currentNetwork: network })),
    onAccountChange: (listener) => {
      listeners.account = listener;
      return () => {};
    },
    onNetworkChange: (listener) => {
      listeners.network = listener;
      return () => {};
    },
    onDisconnected: (listener) => {
      listeners.disconnected = listener;
      return () => {};
    },
  };
  return { wallet, listeners };
}

describe.each(adapterCases)('%s wallet adapter', (name, Adapter) => {
  it('emits account and network events for connect, wallet updates, and network switches', async () => {
    const { wallet, listeners } = createMockWallet(name.toLowerCase().replaceAll(' ', '-'));
    const adapter = new Adapter(wallet);
    const accountChanges: Array<WalletSession | null> = [];
    const networkChanges: ZcashNetwork[] = [];
    const disconnected = vi.fn();

    adapter.on('accountChange', (session) => accountChanges.push(session));
    adapter.on('networkChange', (network) => networkChanges.push(network));
    adapter.on('disconnect', disconnected);

    const session = await adapter.connect({ network: 'mainnet' });
    expect(session.address).toBe(`${wallet.id}-address`);
    expect(adapter.getAddress()).toBe(`${wallet.id}-address`);
    expect(accountChanges).toEqual([session]);

    listeners.account({ ...session, address: `${wallet.id}-updated` });
    expect(adapter.getAddress()).toBe(`${wallet.id}-updated`);

    listeners.network('testnet');
    expect(networkChanges).toEqual(['testnet']);

    const switched = await adapter.switchNetwork('mainnet');
    expect(switched).toMatchObject({ success: true, currentNetwork: 'mainnet' });
    expect(networkChanges).toEqual(['testnet', 'mainnet']);

    await adapter.disconnect();
    expect(accountChanges.at(-1)).toBeNull();
    expect(disconnected).toHaveBeenCalledOnce();
  });
});
