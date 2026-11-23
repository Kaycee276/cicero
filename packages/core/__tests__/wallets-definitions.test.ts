import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  burnerWallet,
  noirWallet,
  isNoirAvailable,
  viewingKeyWallet,
  ywallet,
  zashiWallet,
  zelcoreWallet,
  isZelcoreAvailable,
  zucchiniWallet,
  getDefaultWallets,
} from '../src/wallets';

describe('Zcash Wallets Definitions', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    // @ts-ignore
    globalThis.window = originalWindow;
  });

  describe('getDefaultWallets', () => {
    it('returns seven unique wallet definitions', () => {
      const wallets = getDefaultWallets();
      expect(wallets).toHaveLength(7);

      const ids = wallets.map((w) => w.id);
      expect(new Set(ids).size).toBe(7);
      expect(ids).toContain('zucchini');
      expect(ids).toContain('noir');
      expect(ids).toContain('zelcore');
      expect(ids).toContain('zashi');
      expect(ids).toContain('ywallet');
      expect(ids).toContain('viewing-key');
      expect(ids).toContain('burner');
    });
  });

  describe('burnerWallet', () => {
    it('provides instant ephemeral connection with mock address and sends simulated payments', async () => {
      expect(burnerWallet.id).toBe('burner');
      expect(burnerWallet.category).toBe('developer');
      expect(burnerWallet.isAvailable()).toBe(true);

      const session = await burnerWallet.connect({ network: 'testnet' });
      expect(session.connected).toBe(true);
      expect(session.network).toBe('testnet');
      expect(session.walletId).toBe('burner');
      expect(typeof session.address).toBe('string');
      expect(session.address).toMatch(/^u1/);

      if (burnerWallet.sendPayment) {
        const payment = await burnerWallet.sendPayment({
          recipient: 'u1someaddress',
          amount: 0.5,
        });
        expect(payment.submitted).toBe(true);
        expect(payment.txId).toMatch(/^0x[a-f0-9]{64}$/);
      } else {
        throw new Error('burnerWallet should implement sendPayment');
      }
    });
  });

  describe('viewingKeyWallet', () => {
    it('provides read-only connection', async () => {
      expect(viewingKeyWallet.id).toBe('viewing-key');
      expect(viewingKeyWallet.category).toBe('read-only');
      expect(viewingKeyWallet.isAvailable()).toBe(true);

      const session = await viewingKeyWallet.connect({ network: 'mainnet' });
      expect(session.connected).toBe(true);
      expect(session.network).toBe('mainnet');
      expect(session.walletId).toBe('viewing-key');
    });
  });

  describe('ywallet', () => {
    it('creates ZIP-321 URI on sendPayment', async () => {
      expect(ywallet.id).toBe('ywallet');
      expect(ywallet.category).toBe('mobile');
      expect(ywallet.isAvailable()).toBe(true);

      const session = await ywallet.connect();
      expect(session.connected).toBe(true);
      expect(session.network).toBe('mainnet');

      if (ywallet.sendPayment) {
        const payment = await ywallet.sendPayment({
          recipient: 'u1testrecipient123',
          amount: 2.5,
          memo: 'test memo',
        });
        expect(payment.submitted).toBe(false);
        expect(payment.rawUri).toContain('zcash:u1testrecipient123');
        expect(payment.rawUri).toContain('amount=2.5');
      }
    });
  });

  describe('zashiWallet', () => {
    it('creates ZIP-321 URI on sendPayment', async () => {
      expect(zashiWallet.id).toBe('zashi');
      expect(zashiWallet.category).toBe('mobile');
      expect(zashiWallet.isAvailable()).toBe(true);

      const session = await zashiWallet.connect({ network: 'mainnet' });
      expect(session.connected).toBe(true);

      if (zashiWallet.sendPayment) {
        const payment = await zashiWallet.sendPayment({
          recipient: 'u1testrecipient123',
          amount: 1,
        });
        expect(payment.rawUri).toContain('zcash:u1testrecipient123');
      }
    });
  });

  describe('noirWallet & isNoirAvailable', () => {
    it('detects availability correctly based on window globals', () => {
      // @ts-ignore
      delete globalThis.window;
      expect(isNoirAvailable()).toBe(false);

      // @ts-ignore
      globalThis.window = { noirwallet: {} };
      expect(isNoirAvailable()).toBe(true);

      // @ts-ignore
      globalThis.window = { noir: {} };
      expect(isNoirAvailable()).toBe(true);

      // @ts-ignore
      globalThis.window = {};
      expect(isNoirAvailable()).toBe(false);
    });

    it('has correct wallet metadata', () => {
      expect(noirWallet.id).toBe('noir');
      expect(noirWallet.category).toBe('extension');
    });
  });

  describe('zelcoreWallet & isZelcoreAvailable', () => {
    it('detects availability correctly based on window globals', () => {
      // @ts-ignore
      delete globalThis.window;
      expect(isZelcoreAvailable()).toBe(false);

      // @ts-ignore
      globalThis.window = { zelcore: {} };
      expect(isZelcoreAvailable()).toBe(true);

      // @ts-ignore
      globalThis.window = { ethereum: { isZelcore: true } };
      expect(isZelcoreAvailable()).toBe(true);

      // @ts-ignore
      globalThis.window = {};
      expect(isZelcoreAvailable()).toBe(false);
    });

    it('connects using custom address or defaults to transparent address', async () => {
      const sessionWithCustom = await zelcoreWallet.connect({
        customKey: 't1CustomAddress123',
      });
      expect(sessionWithCustom.address).toBe('t1CustomAddress123');

      const sessionDefault = await zelcoreWallet.connect();
      expect(sessionDefault.address).toBe('t1VpwtxdvWvd8CV4ndr4wPGeF47pTWB5yRz');
    });
  });

  describe('zucchiniWallet', () => {
    it('has proper adapter links and metadata', () => {
      expect(zucchiniWallet.id).toBe('zucchini');
      expect(zucchiniWallet.category).toBe('extension');
      expect(typeof zucchiniWallet.connect).toBe('function');
      expect(typeof zucchiniWallet.disconnect).toBe('function');
      expect(typeof zucchiniWallet.getBalance).toBe('function');
      expect(typeof zucchiniWallet.getNetwork).toBe('function');
      expect(typeof zucchiniWallet.switchNetwork).toBe('function');
      expect(typeof zucchiniWallet.sendPayment).toBe('function');
    });
  });
});
