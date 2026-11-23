import { CatalogWalletAdapter } from './CatalogWalletAdapter';
import { burnerWallet } from './burner';
import { noirWallet } from './noir';
import { viewingKeyWallet } from './viewingKey';
import { ywallet } from './ywallet';
import { zelcoreWallet } from './zelcore';
import { zashiWallet } from './zashi';
import { zucchiniWallet, zucchiniExtensionAdapter } from './zucchini';
import { ZucchiniExtensionAdapter } from './ZucchiniExtensionAdapter';
import type { SendPaymentParams, ZcashNetwork, ZcashWallet } from '../types';

export class ZucchiniWalletAdapter extends CatalogWalletAdapter {
  static isAvailable = ZucchiniExtensionAdapter.isAvailable;
  static onReady = ZucchiniExtensionAdapter.onReady;

  constructor(wallet: ZcashWallet = zucchiniWallet) {
    super(wallet);
  }

  get address(): string | null {
    return this.getAddress();
  }

  get isConnected(): boolean {
    return this.session?.connected ?? false;
  }

  async requestPayment(params: {
    recipient: string;
    amount: number | string;
    memo?: string;
  }): Promise<{ txId: string; submitted: boolean }> {
    const result = await this.sendPayment(params);
    return { txId: result.txId, submitted: result.submitted };
  }

  onNetworkChanged(listener: (network: ZcashNetwork) => void): () => void {
    return zucchiniExtensionAdapter.onNetworkChanged(listener);
  }

  onAccountsChanged(listener: (accounts: any) => void): () => void {
    return zucchiniExtensionAdapter.onAccountsChanged(listener);
  }

  onDisconnect(listener: () => void): () => void {
    return zucchiniExtensionAdapter.onDisconnect(listener);
  }
}

export class NoirWalletAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = noirWallet) {
    super(wallet);
  }
}

export class ZelcoreWalletAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = zelcoreWallet) {
    super(wallet);
  }
}

export class ZashiWalletAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = zashiWallet) {
    super(wallet);
  }
}

export class YwalletAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = ywallet) {
    super(wallet);
  }
}

export class ViewingKeyAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = viewingKeyWallet) {
    super(wallet);
  }
}

export class DevSessionWalletAdapter extends CatalogWalletAdapter {
  constructor(wallet: ZcashWallet = burnerWallet) {
    super(wallet);
  }
}

export type { SendPaymentParams };
