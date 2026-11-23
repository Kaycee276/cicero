import type {
  SendPaymentParams,
  SendPaymentResult,
  WalletAdapter,
  WalletAdapterEvent,
  WalletAdapterEventListener,
  WalletAdapterEventMap,
  WalletConnectOptions,
  WalletNetworkSwitchResult,
  WalletSession,
  ZcashNetwork,
} from '../types';

/** Shared session state and typed event subscription for core wallet adapters. */
export abstract class BaseWalletAdapter implements WalletAdapter {
  abstract readonly id: string;
  protected session: WalletSession | null = null;
  private readonly listeners = new Map<WalletAdapterEvent, Set<(payload: never) => void>>();

  abstract isAvailable(): boolean;
  abstract connect(options?: WalletConnectOptions): Promise<WalletSession>;

  getAddress(): string | null {
    return this.session?.address ?? null;
  }

  async getBalance(_options?: { address?: string; network?: ZcashNetwork }): Promise<number | null> {
    return this.session?.balance ?? null;
  }

  async getNetwork(): Promise<ZcashNetwork> {
    return this.session?.network ?? 'mainnet';
  }

  async switchNetwork(network: ZcashNetwork): Promise<WalletNetworkSwitchResult> {
    const currentNetwork = await this.getNetwork();
    return {
      success: currentNetwork === network,
      requiresManualSwitch: currentNetwork !== network,
      currentNetwork,
    };
  }

  async sendPayment(_params: SendPaymentParams): Promise<SendPaymentResult> {
    throw new Error(`${this.id} does not support payment dispatch.`);
  }

  async disconnect(): Promise<void> {
    this.setSession(null);
    this.emit('disconnect', undefined);
  }

  on<K extends WalletAdapterEvent>(
    event: K,
    listener: WalletAdapterEventListener<K>
  ): () => void {
    let eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      eventListeners = new Set();
      this.listeners.set(event, eventListeners);
    }

    eventListeners.add(listener as (payload: never) => void);
    return () => eventListeners?.delete(listener as (payload: never) => void);
  }

  protected setSession(session: WalletSession | null): void {
    this.session = session;
    this.emit('accountChange', session);
  }

  protected emit<K extends WalletAdapterEvent>(
    event: K,
    payload: WalletAdapterEventMap[K]
  ): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;
    for (const listener of eventListeners) listener(payload as never);
  }
}
