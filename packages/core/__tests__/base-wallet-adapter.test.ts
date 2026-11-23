import { describe, expect, it, vi } from 'vitest';
import { BaseWalletAdapter } from '../src/wallets/BaseWalletAdapter';
import type { WalletSession, WalletConnectOptions, ZcashNetwork } from '../src/types';

class TestWalletAdapter extends BaseWalletAdapter {
  readonly id = 'test-wallet';
  available = true;

  isAvailable(): boolean {
    return this.available;
  }

  async connect(options?: WalletConnectOptions): Promise<WalletSession> {
    const session: WalletSession = {
      address: 'u1testaddress1234567890',
      connected: true,
      network: options?.network || 'mainnet',
      walletId: this.id,
      balance: 12.5,
    };
    this.setSession(session);
    return session;
  }

  // Helper method for testing internal emit
  public testEmit<K extends 'accountChange' | 'networkChange' | 'disconnect'>(
    event: K,
    payload: any
  ) {
    this.emit(event, payload);
  }

  public testSetSession(session: WalletSession | null) {
    this.setSession(session);
  }
}

describe('BaseWalletAdapter', () => {
  it('initializes with null address and default network', async () => {
    const adapter = new TestWalletAdapter();
    expect(adapter.isAvailable()).toBe(true);
    expect(adapter.getAddress()).toBeNull();
    expect(await adapter.getBalance()).toBeNull();
    expect(await adapter.getNetwork()).toBe('mainnet');
  });

  it('connect sets session and updates getAddress, getBalance, getNetwork', async () => {
    const adapter = new TestWalletAdapter();
    const session = await adapter.connect({ network: 'testnet' });

    expect(session.address).toBe('u1testaddress1234567890');
    expect(adapter.getAddress()).toBe('u1testaddress1234567890');
    expect(await adapter.getBalance()).toBe(12.5);
    expect(await adapter.getNetwork()).toBe('testnet');
  });

  it('switchNetwork checks against current network and returns appropriate flags', async () => {
    const adapter = new TestWalletAdapter();
    await adapter.connect({ network: 'mainnet' });

    // Switching to the same network succeeds directly
    const sameResult = await adapter.switchNetwork('mainnet');
    expect(sameResult).toEqual({
      success: true,
      requiresManualSwitch: false,
      currentNetwork: 'mainnet',
    });

    // Switching to different network indicates manual switch required
    const diffResult = await adapter.switchNetwork('testnet');
    expect(diffResult).toEqual({
      success: false,
      requiresManualSwitch: true,
      currentNetwork: 'mainnet',
    });
  });

  it('sendPayment throws error indicating lack of payment dispatch support', async () => {
    const adapter = new TestWalletAdapter();
    await expect(
      adapter.sendPayment({
        recipient: 'u1testaddress1234567890',
        amount: 1.5,
      })
    ).rejects.toThrow('test-wallet does not support payment dispatch.');
  });

  it('disconnect clears session and emits disconnect event', async () => {
    const adapter = new TestWalletAdapter();
    await adapter.connect();
    expect(adapter.getAddress()).not.toBeNull();

    const disconnectListener = vi.fn();
    const accountChangeListener = vi.fn();
    adapter.on('disconnect', disconnectListener);
    adapter.on('accountChange', accountChangeListener);

    await adapter.disconnect();

    expect(adapter.getAddress()).toBeNull();
    expect(disconnectListener).toHaveBeenCalledTimes(1);
    expect(accountChangeListener).toHaveBeenCalledWith(null);
  });

  it('event subscription and unsubscription works cleanly', () => {
    const adapter = new TestWalletAdapter();
    const networkListener = vi.fn();

    const unsubscribe = adapter.on('networkChange', networkListener);
    adapter.testEmit('networkChange', 'testnet' as ZcashNetwork);
    expect(networkListener).toHaveBeenCalledWith('testnet');

    unsubscribe();
    adapter.testEmit('networkChange', 'mainnet' as ZcashNetwork);
    // Listener should not be called again after unsubscription
    expect(networkListener).toHaveBeenCalledTimes(1);
  });

  it('emitting with no registered listeners does not throw', () => {
    const adapter = new TestWalletAdapter();
    expect(() => adapter.testEmit('accountChange', null)).not.toThrow();
  });
});
