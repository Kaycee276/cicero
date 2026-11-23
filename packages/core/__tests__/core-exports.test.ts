import { describe, expect, it } from 'vitest';
import * as Core from '../src';

describe('@cicero-zcash/core public export contract', () => {
  it('exports address utilities', () => {
    expect(typeof Core.getAddressType).toBe('function');
    expect(typeof Core.isShieldedAddress).toBe('function');
    expect(typeof Core.isViewingKey).toBe('function');
    expect(typeof Core.truncateAddress).toBe('function');
    expect(typeof Core.validateMemoSupport).toBe('function');
  });

  it('exports ZIP-321 uri encoding and parsing utilities', () => {
    expect(typeof Core.encodeBase64Url).toBe('function');
    expect(typeof Core.decodeBase64Url).toBe('function');
    expect(typeof Core.generateZip321Uri).toBe('function');
    expect(typeof Core.parseZip321Uri).toBe('function');
  });

  it('exports all wallet adapter classes and base abstractions', () => {
    expect(typeof Core.BaseWalletAdapter).toBe('function');
    expect(typeof Core.CatalogWalletAdapter).toBe('function');
    expect(typeof Core.ZucchiniExtensionAdapter).toBe('function');
    expect(typeof Core.ZucchiniWalletAdapter).toBe('function');
    expect(typeof Core.NoirWalletAdapter).toBe('function');
    expect(typeof Core.ZelcoreWalletAdapter).toBe('function');
    expect(typeof Core.ZashiWalletAdapter).toBe('function');
    expect(typeof Core.YwalletAdapter).toBe('function');
    expect(typeof Core.ViewingKeyAdapter).toBe('function');
    expect(typeof Core.DevSessionWalletAdapter).toBe('function');
  });

  it('exports wallet definitions and catalog helpers', () => {
    expect(typeof Core.getDefaultWallets).toBe('function');
    expect(Core.burnerWallet).toBeDefined();
    expect(Core.noirWallet).toBeDefined();
    expect(Core.viewingKeyWallet).toBeDefined();
    expect(Core.ywallet).toBeDefined();
    expect(Core.zelcoreWallet).toBeDefined();
    expect(Core.zashiWallet).toBeDefined();
    expect(Core.zucchiniWallet).toBeDefined();
    expect(Core.zucchiniExtensionAdapter).toBeDefined();
  });
});
