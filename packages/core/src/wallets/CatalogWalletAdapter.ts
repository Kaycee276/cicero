import { BaseWalletAdapter } from './BaseWalletAdapter';
import type {
  SendPaymentParams,
  SendPaymentResult,
  WalletConnectOptions,
  WalletNetworkSwitchResult,
  WalletSession,
  ZcashNetwork,
  ZcashWallet,
} from '../types';

/** Adapts the stable wallet catalog contract to the event-driven core interface. */
export class CatalogWalletAdapter extends BaseWalletAdapter {
  readonly id: string;
  private eventCleanups: Array<() => void> = [];
  private listeningToWallet = false;

  constructor(protected readonly wallet: ZcashWallet) {
    super();
    this.id = wallet.id;
  }

  isAvailable(): boolean {
    return this.wallet.isAvailable();
  }

  async connect(options?: WalletConnectOptions): Promise<WalletSession> {
    const previousNetwork = this.session?.network;
    const session = await this.wallet.connect(options);
    const normalized = { ...session, walletId: session.walletId || this.id };
    this.setSession(normalized);
    this.listenToWalletEvents();
    if (previousNetwork && normalized.network && previousNetwork !== normalized.network) {
      this.emit('networkChange', normalized.network);
    }
    return normalized;
  }

  async disconnect(): Promise<void> {
    await this.wallet.disconnect?.();
    this.clearWalletEventSubscriptions();
    await super.disconnect();
  }

  async getBalance(options?: { address?: string; network?: ZcashNetwork }): Promise<number | null> {
    if (!this.wallet.getBalance) return super.getBalance(options);
    const balance = await this.wallet.getBalance(options);
    if (balance !== null && this.session) this.session = { ...this.session, balance };
    return balance;
  }

  async getNetwork(): Promise<ZcashNetwork> {
    if (this.wallet.getNetwork) return this.wallet.getNetwork();
    return super.getNetwork();
  }

  async switchNetwork(network: ZcashNetwork): Promise<WalletNetworkSwitchResult> {
    if (!this.wallet.switchNetwork) return super.switchNetwork(network);

    const previousNetwork = await this.getNetwork();
    const result = await this.wallet.switchNetwork(network);
    const nextNetwork = result.currentNetwork ?? (result.success ? network : previousNetwork);
    if (result.success && nextNetwork !== previousNetwork) {
      if (this.session) this.session = { ...this.session, network: nextNetwork };
      this.emit('networkChange', nextNetwork);
    }
    return { ...result, currentNetwork: nextNetwork };
  }

  async sendPayment(params: SendPaymentParams): Promise<SendPaymentResult> {
    if (!this.wallet.sendPayment) return super.sendPayment(params);
    return this.wallet.sendPayment(params);
  }

  private listenToWalletEvents(): void {
    if (this.listeningToWallet) return;
    this.listeningToWallet = true;

    if (this.wallet.onAccountChange) {
      this.eventCleanups.push(
        this.wallet.onAccountChange((session) => {
          this.setSession(session ? { ...session, walletId: session.walletId || this.id } : null);
        })
      );
    }

    if (this.wallet.onNetworkChange) {
      this.eventCleanups.push(
        this.wallet.onNetworkChange((network) => {
          const previous = this.session?.network;
          if (this.session) this.session = { ...this.session, network };
          if (previous !== network) this.emit('networkChange', network);
        })
      );
    }

    if (this.wallet.onDisconnected) {
      this.eventCleanups.push(
        this.wallet.onDisconnected(() => {
          this.setSession(null);
          this.emit('disconnect', undefined);
        })
      );
    }
  }

  private clearWalletEventSubscriptions(): void {
    for (const cleanup of this.eventCleanups.splice(0)) cleanup();
    this.listeningToWallet = false;
  }
}
