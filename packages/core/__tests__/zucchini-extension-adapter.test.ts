import { describe, expect, it, vi, afterEach } from 'vitest';
import { ZucchiniExtensionAdapter } from '../src/wallets/ZucchiniExtensionAdapter';

describe('ZucchiniExtensionAdapter', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    // @ts-ignore
    globalThis.window = originalWindow;
  });

  describe('isAvailable', () => {
    it('returns false when window is undefined', () => {
      // @ts-ignore
      delete globalThis.window;
      expect(ZucchiniExtensionAdapter.isAvailable()).toBe(false);
    });

    it('returns true when window.zucchini has request function', () => {
      globalThis.window = {
        zucchini: {
          request: vi.fn(),
        },
      } as any;
      expect(ZucchiniExtensionAdapter.isAvailable()).toBe(true);
    });

    it('returns true when window.zcash is defined', () => {
      globalThis.window = {
        zcash: {},
      } as any;
      expect(ZucchiniExtensionAdapter.isAvailable()).toBe(true);
    });

    it('returns true when window.zucchini object exists without request method', () => {
      globalThis.window = {
        zucchini: {},
      } as any;
      expect(ZucchiniExtensionAdapter.isAvailable()).toBe(true);
    });

    it('returns false when neither window.zucchini nor window.zcash exists', () => {
      globalThis.window = {} as any;
      expect(ZucchiniExtensionAdapter.isAvailable()).toBe(false);
    });
  });

  describe('onReady', () => {
    it('calls callback immediately if already available', () => {
      globalThis.window = {
        zucchini: { request: vi.fn() },
      } as any;
      const cb = vi.fn();
      const cleanup = ZucchiniExtensionAdapter.onReady(cb);
      expect(cb).toHaveBeenCalledTimes(1);
      cleanup();
    });

    it('attaches event listeners if not yet available and cleans them up', () => {
      const listeners: Record<string, Function> = {};
      globalThis.window = {
        addEventListener: vi.fn((event: string, handler: Function) => {
          listeners[event] = handler;
        }),
        removeEventListener: vi.fn((event: string) => {
          delete listeners[event];
        }),
      } as any;

      const cb = vi.fn();
      const cleanup = ZucchiniExtensionAdapter.onReady(cb);

      expect(globalThis.window.addEventListener).toHaveBeenCalledWith(
        'zucchini#initialized',
        expect.any(Function)
      );
      expect(globalThis.window.addEventListener).toHaveBeenCalledWith(
        'zcash#initialized',
        expect.any(Function)
      );

      // Trigger event
      listeners['zucchini#initialized']();
      expect(cb).toHaveBeenCalledTimes(1);

      cleanup();
      expect(globalThis.window.removeEventListener).toHaveBeenCalledWith(
        'zucchini#initialized',
        expect.any(Function)
      );
    });
  });

  describe('instance adapter methods', () => {
    it('throws error on connect if window is undefined', async () => {
      // @ts-ignore
      delete globalThis.window;
      const adapter = new ZucchiniExtensionAdapter();
      await expect(adapter.connect()).rejects.toThrow(
        'Zucchini Wallet is only available in browser environments.'
      );
    });

    it('connects via window.zucchini provider and handles account query', async () => {
      const mockAccounts = [
        {
          address: 'u1zucchiniMockAccountAddress987654321',
          name: 'Primary',
          network: 'mainnet',
        },
      ];

      globalThis.window = {
        zucchini: {
          connect: vi.fn().mockResolvedValue({ accounts: mockAccounts }),
          request: vi.fn(async ({ method }) => {
            if (method === 'zcash_accounts' || method === 'accounts') return mockAccounts;
            if (method === 'getNetwork') return 'mainnet';
            if (method === 'zcash_getBalance' || method === 'getBalance') return 15.5;
            return null;
          }),
          getAddresses: vi.fn().mockResolvedValue({
            unified: 'u1zucchiniMockAccountAddress987654321',
          }),
          on: vi.fn(),
          removeListener: vi.fn(),
        },
      } as any;

      const adapter = new ZucchiniExtensionAdapter();
      const session = await adapter.connect();

      expect(session.connected).toBe(true);
      expect(session.address).toBe('u1zucchiniMockAccountAddress987654321');
      expect(adapter.address).toBe('u1zucchiniMockAccountAddress987654321');
      expect(await adapter.getNetwork()).toBe('mainnet');

      await adapter.disconnect();
      expect(adapter.address).toBeNull();
    });

    it('handles switchNetwork and sendPayment via provider', async () => {
      let currentNet = 'mainnet';
      const validTxId = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

      globalThis.window = {
        zucchini: {
          connect: vi.fn().mockResolvedValue({
            accounts: [{ address: 'u1mockrecipientaddr' }],
          }),
          request: vi.fn(async ({ method, params }) => {
            if (method === 'getNetwork') return currentNet;
            if (method === 'switchNetwork') {
              currentNet = params?.network === 'test' ? 'testnet' : 'mainnet';
              return { success: true, network: currentNet };
            }
            if (method === 'sendTransaction') {
              return validTxId;
            }
            return null;
          }),
        },
      } as any;

      const adapter = new ZucchiniExtensionAdapter();
      const switchResult = await adapter.switchNetwork('testnet');
      expect(switchResult.success).toBe(true);
      expect(switchResult.currentNetwork).toBe('testnet');

      const payment = await adapter.requestPayment({
        recipient: 'u1mockrecipientaddr',
        amount: 2.5,
        memo: 'Payment for services',
      });
      expect(payment.txId).toBe(validTxId);
      expect(payment.submitted).toBe(true);
    });

    it('registers event listeners on the provider cleanly', () => {
      globalThis.window = {
        zucchini: {
          on: vi.fn((event: string, handler: Function) => {}),
          removeListener: vi.fn((event: string) => {}),
        },
      } as any;

      const adapter = new ZucchiniExtensionAdapter();
      const netHandler = vi.fn();
      const cleanup = adapter.onNetworkChanged(netHandler);

      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });
});
