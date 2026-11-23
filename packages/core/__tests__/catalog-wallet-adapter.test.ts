import { describe, expect, it, vi } from 'vitest';
import { CatalogWalletAdapter } from '../src/wallets/CatalogWalletAdapter';
import type { WalletSession, ZcashNetwork, ZcashWallet } from '../src/types';

describe('CatalogWalletAdapter', () => {
  it('wraps a minimal wallet lacking optional methods gracefully', async () => {
    const minimalWallet: ZcashWallet = {
      id: 'minimal-wallet',
      name: 'Minimal Wallet',
      icon: 'M',
      description: 'A minimal wallet without optional handlers',
      category: 'developer',
      isAvailable: () => true,
      connect: vi.fn(async (): Promise<WalletSession> => ({
        connected: true,
        address: 'u1minimaladdr987654321',
        walletId: 'minimal-wallet',
      })),
    };

    const adapter = new CatalogWalletAdapter(minimalWallet);

    expect(adapter.id).toBe('minimal-wallet');
    expect(adapter.isAvailable()).toBe(true);
    expect(adapter.getAddress()).toBeNull();

    const session = await adapter.connect();
    expect(session.walletId).toBe('minimal-wallet');
    expect(session.address).toBe('u1minimaladdr987654321');
    expect(adapter.getAddress()).toBe('u1minimaladdr987654321');

    // Default implementations from BaseWalletAdapter
    expect(await adapter.getBalance()).toBeNull();
    expect(await adapter.getNetwork()).toBe('mainnet');

    const switchRes = await adapter.switchNetwork('testnet');
    expect(switchRes.success).toBe(false);
    expect(switchRes.requiresManualSwitch).toBe(true);

    await expect(
      adapter.sendPayment({
        recipient: 'u1minimaladdr987654321',
        amount: 1,
      })
    ).rejects.toThrow('minimal-wallet does not support payment dispatch.');

    await adapter.disconnect();
    expect(adapter.getAddress()).toBeNull();
  });

  it('delegates getBalance, getNetwork, and sendPayment when supported by the underlying wallet', async () => {
    const fullWallet: ZcashWallet = {
      id: 'rich-wallet',
      name: 'Rich Wallet',
      icon: 'R',
      description: 'A rich wallet with all optional methods',
      category: 'extension',
      isAvailable: () => true,
      connect: vi.fn(async (): Promise<WalletSession> => ({
        connected: true,
        address: 'u1richaddr123',
        network: 'mainnet',
        walletId: 'rich-wallet',
      })),
      getBalance: vi.fn(async () => 42.75),
      getNetwork: vi.fn(async () => 'testnet' as ZcashNetwork),
      switchNetwork: vi.fn(async (network) => ({
        success: true,
        currentNetwork: network,
      })),
      sendPayment: vi.fn(async (params) => ({
        txId: '0xmocktxid123456789',
        submitted: true,
        rawUri: `zcash:${params.recipient}`,
      })),
      disconnect: vi.fn(async () => {}),
    };

    const adapter = new CatalogWalletAdapter(fullWallet);
    await adapter.connect();

    const balance = await adapter.getBalance();
    expect(balance).toBe(42.75);
    expect(fullWallet.getBalance).toHaveBeenCalled();

    const network = await adapter.getNetwork();
    expect(network).toBe('testnet');
    expect(fullWallet.getNetwork).toHaveBeenCalled();

    const payment = await adapter.sendPayment({
      recipient: 'u1destaddr',
      amount: 5,
      memo: 'Thanks',
    });
    expect(payment.txId).toBe('0xmocktxid123456789');
    expect(payment.submitted).toBe(true);

    await adapter.disconnect();
    expect(fullWallet.disconnect).toHaveBeenCalled();
  });

  it('subscribes to wallet events and cleans them up on disconnect', async () => {
    let accountCallback: ((s: WalletSession | null) => void) | undefined;
    let networkCallback: ((n: ZcashNetwork) => void) | undefined;
    let disconnectCallback: (() => void) | undefined;

    const cleanupAccount = vi.fn();
    const cleanupNetwork = vi.fn();
    const cleanupDisconnect = vi.fn();

    const reactiveWallet: ZcashWallet = {
      id: 'reactive-wallet',
      name: 'Reactive Wallet',
      icon: 'R',
      description: 'A reactive wallet with listeners',
      category: 'extension',
      isAvailable: () => true,
      connect: vi.fn(async (): Promise<WalletSession> => ({
        connected: true,
        address: 'u1initialaddr',
        network: 'mainnet',
        walletId: 'reactive-wallet',
      })),
      onAccountChange: vi.fn((cb) => {
        accountCallback = cb;
        return cleanupAccount;
      }),
      onNetworkChange: vi.fn((cb) => {
        networkCallback = cb;
        return cleanupNetwork;
      }),
      onDisconnected: vi.fn((cb) => {
        disconnectCallback = cb;
        return cleanupDisconnect;
      }),
    };

    const adapter = new CatalogWalletAdapter(reactiveWallet);
    const networkListener = vi.fn();
    const disconnectListener = vi.fn();

    adapter.on('networkChange', networkListener);
    adapter.on('disconnect', disconnectListener);

    await adapter.connect();

    // Trigger reactive updates from wallet
    expect(accountCallback).toBeDefined();
    accountCallback!({
      connected: true,
      address: 'u1swappedaddr',
      network: 'mainnet',
      walletId: 'reactive-wallet',
    });
    expect(adapter.getAddress()).toBe('u1swappedaddr');

    expect(networkCallback).toBeDefined();
    networkCallback!('testnet');
    expect(networkListener).toHaveBeenCalledWith('testnet');

    expect(disconnectCallback).toBeDefined();
    disconnectCallback!();
    expect(disconnectListener).toHaveBeenCalledTimes(1);
    expect(adapter.getAddress()).toBeNull();

    // Disconnecting the adapter cleans up all underlying wallet subscriptions
    await adapter.disconnect();
    expect(cleanupAccount).toHaveBeenCalled();
    expect(cleanupNetwork).toHaveBeenCalled();
    expect(cleanupDisconnect).toHaveBeenCalled();
  });
});
