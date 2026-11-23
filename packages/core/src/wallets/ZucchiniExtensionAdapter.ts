import { generateZip321Uri } from '../zip321';
import { ZcashNetwork } from '../types';

export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type WalletPaymentStatus = 'idle' | 'requesting' | 'submitted' | 'error';

export interface ZucchiniWalletSession {
  address?: string;
  connected: boolean;
  network?: ZcashNetwork;
  balance?: number;
}

export interface WalletPaymentResult {
  txId: string;
  submitted: boolean;
}

/**
 * Adapter for the Zucchini Wallet browser extension.
 *
 * Zucchini injects a provider onto window.zucchini (or window.zcash) and implements
 * the typed @zucchinifi/dapp-sdk Zcash contract.
 */
export class ZucchiniExtensionAdapter {
  private client: any = null;
  private provider: any = null;
  private _connected = false;
  private _address: string | null = null;
  private _lastAccounts: any[] = [];

  /**
   * Checks whether the Zucchini Wallet extension is installed and its
   * provider is available in the current browser environment.
   */
  static isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    if (win.zucchini && typeof win.zucchini.request === 'function') {
      return true;
    }
    if (win.zcash) {
      return true;
    }
    return !!win.zucchini;
  }

  /**
   * Subscribes to wallet readiness. Fires callback immediately if already available,
   * or listens for injection events / polls briefly for late extension initialization.
   */
  static onReady(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    if (ZucchiniExtensionAdapter.isAvailable()) {
      callback();
      return () => {};
    }

    const handler = () => callback();
    window.addEventListener('zucchini#initialized', handler);
    window.addEventListener('zcash#initialized', handler);

    // Poll every 150ms for up to 3.5 seconds
    const interval = setInterval(() => {
      if (ZucchiniExtensionAdapter.isAvailable()) {
        clearInterval(interval);
        callback();
      }
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3500);

    return () => {
      window.removeEventListener('zucchini#initialized', handler);
      window.removeEventListener('zcash#initialized', handler);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }

  /**
   * Discovers and initializes the Zucchini Client using @zucchinifi/dapp-sdk/zcash
   * with graceful fallback to raw window.zucchini / window.zcash globals.
   */
  private async getClient(): Promise<any> {
    if (this.client) return this.client;

    if (typeof window === 'undefined') {
      throw new Error('Zucchini Wallet is only available in browser environments.');
    }

    const win = window as any;
    let rawProvider = win.zucchini || win.zcash;

    try {
      // Import the official dapp SDK
      const { discoverZucchiniProvider, createZucchiniClient } =
        await import('@zucchinifi/dapp-sdk/zcash');

      const discovered = discoverZucchiniProvider() || rawProvider;
      if (discovered) {
        this.provider = discovered;
        this.client = createZucchiniClient(discovered);
        return this.client;
      }
    } catch {
      // SDK import fallback to direct window object wrapping
    }

    if (rawProvider) {
      this.provider = rawProvider;
      // Synthetic fallback client
      this.client = {
        async connect(req?: any) {
          if (typeof rawProvider.connect === 'function') {
            return rawProvider.connect(
              req?.permissions || ['view_addresses', 'view_balance', 'send_transaction']
            );
          }
          if (typeof rawProvider.request === 'function') {
            return rawProvider.request({ method: 'connect', params: req });
          }
          return { connected: true };
        },
        async disconnect() {
          if (typeof rawProvider.disconnect === 'function') {
            return rawProvider.disconnect();
          }
        },
        async requestPayment(uri: string) {
          if (typeof rawProvider.request === 'function') {
            const res = await rawProvider.request({
              method: 'zcash_requestPayment',
              params: { uri },
            });
            return { txid: res?.txid || res?.txId || res };
          }
          throw new Error('Direct ZIP-321 send not supported by provider');
        },
        async getAddresses() {
          if (typeof rawProvider.request === 'function') {
            return rawProvider.request({ method: 'getAddresses' });
          }
          return {};
        },
        on(event: string, listener: (val: any) => void) {
          rawProvider.on?.(event, listener);
          return () => rawProvider.off?.(event, listener);
        },
      };
      return this.client;
    }

    throw new Error(
      'Zucchini Wallet extension not detected. Please install it from the Chrome Web Store or ensure the side-panel is open.'
    );
  }

  /**
   * Requests connection with view_addresses and send_transaction permissions.
   * Resolves the user's active Shielded Unified Address.
   */
  async connect(): Promise<ZucchiniWalletSession> {
    const client = await this.getClient();

    const connection = await client.connect({
      permissions: ['view_addresses', 'view_balance', 'send_transaction'],
    });

    let address: string | undefined = undefined;

    // Check connection accounts array
    if (connection?.accounts && connection.accounts.length > 0) {
      address = connection.accounts[0].address;
    }

    // If address not in connection result, query getAddresses() explicitly
    if (!address && typeof client.getAddresses === 'function') {
      try {
        const addresses = await client.getAddresses();
        address =
          addresses?.unified || addresses?.orchard || addresses?.sapling || addresses?.transparent;
      } catch {
        // best effort
      }
    }

    this._lastAccounts = connection?.accounts || [];

    // Query active wallet network and live balance
    const network = await this.getNetwork();
    const balance = await this.getBalance({ address, network });

    this._connected = true;
    this._address = address || null;

    return {
      address,
      connected: true,
      network,
      balance: balance ?? undefined,
    };
  }

  /**
   * Queries the active network of the Zucchini Wallet ('mainnet' | 'testnet').
   */
  async getNetwork(): Promise<ZcashNetwork> {
    try {
      const client = await this.getClient();
      if (typeof client.network === 'function') {
        const net = await client.network();
        if (net === 'mainnet' || net === 'testnet') {
          return net;
        }
      }
    } catch {
      // fallback to provider RPC
    }

    const raw =
      this.provider ||
      (typeof window !== 'undefined' ? (window as any).zucchini || (window as any).zcash : null);

    if (raw && typeof raw.request === 'function') {
      try {
        const res: any = await raw.request({ method: 'getNetwork' });
        if (res?.network === 'main' || res === 'main' || res === 'mainnet') return 'mainnet';
        if (res?.network === 'test' || res === 'test' || res === 'testnet') return 'testnet';
      } catch {
        // ignore
      }
    }

    // Inspect active address prefix if available:
    // Mainnet unified: u1..., testnet unified: utest1...
    // Mainnet sapling: zs1..., testnet sapling: ztestsapling1...
    // Mainnet transparent: t1..., testnet transparent: tm...
    if (this._address) {
      if (
        this._address.startsWith('utest1') ||
        this._address.startsWith('ztestsapling') ||
        this._address.startsWith('tm')
      ) {
        return 'testnet';
      }
      if (
        this._address.startsWith('u1') ||
        this._address.startsWith('zs1') ||
        this._address.startsWith('t1')
      ) {
        return 'mainnet';
      }
    }

    return 'mainnet';
  }

  /**
   * Requests a network change. If the extension does not support programmatic
   * switching, informs the application that manual user toggle is needed.
   */
  async switchNetwork(
    targetNetwork: ZcashNetwork
  ): Promise<{ success: boolean; requiresManualSwitch?: boolean; currentNetwork: ZcashNetwork }> {
    const current = await this.getNetwork();
    if (current === targetNetwork) {
      return { success: true, currentNetwork: current };
    }

    const raw =
      this.provider ||
      (typeof window !== 'undefined' ? (window as any).zucchini || (window as any).zcash : null);

    if (raw && typeof raw.request === 'function') {
      try {
        await raw.request({
          method: 'switchNetwork',
          params: { network: targetNetwork === 'mainnet' ? 'main' : 'test' },
        });
        const updated = await this.getNetwork();
        return { success: updated === targetNetwork, currentNetwork: updated };
      } catch {
        // Extension requires manual toggle in settings
      }
    }

    return {
      success: false,
      requiresManualSwitch: true,
      currentNetwork: current,
    };
  }

  /**
   * Subscribes to network change events from the wallet extension.
   */
  onNetworkChanged(listener: (network: ZcashNetwork) => void): () => void {
    const raw =
      this.provider ||
      (typeof window !== 'undefined' ? (window as any).zucchini || (window as any).zcash : null);

    const handler = async () => {
      const net = await this.getNetwork();
      listener(net);
    };

    if (raw?.on) {
      raw.on('networkChanged', handler);
      raw.on('chainChanged', handler);
      raw.on('accountsChanged', handler);
      return () => {
        raw.off?.('networkChanged', handler);
        raw.off?.('chainChanged', handler);
        raw.off?.('accountsChanged', handler);
      };
    }
    return () => {};
  }

  /**
   * Helper to normalize raw balance formats (e.g. number, string, zatoshis, or pool totals).
   */
  private parseBalancePayload(payload: any): number | null {
    if (payload === undefined || payload === null) return null;
    if (typeof payload === 'number') {
      return payload > 1000000 ? payload / 100000000 : payload;
    }
    if (typeof payload === 'string') {
      const parsed = parseFloat(payload);
      if (!isNaN(parsed)) {
        return parsed > 1000000 ? parsed / 100000000 : parsed;
      }
    }
    if (typeof payload === 'object') {
      const cand =
        payload.total ??
        payload.balance ??
        payload.amount ??
        payload.zec ??
        payload.value ??
        payload.zatoshis;
      if (cand !== undefined && cand !== null) {
        return this.parseBalancePayload(cand);
      }
      let sum = 0;
      let hasPool = false;
      for (const pool of ['orchard', 'sapling', 'transparent', 'shielded', 'unshielded']) {
        if (payload[pool] !== undefined) {
          const v = this.parseBalancePayload(payload[pool]);
          if (v !== null) {
            sum += v;
            hasPool = true;
          }
        }
      }
      if (hasPool) return sum;
    }
    return null;
  }

  /**
   * Reads real-time balance from Zucchini provider.
   */
  async getBalance(options?: { address?: string; network?: string }): Promise<number | null> {
    const raw =
      this.provider ||
      (typeof window !== 'undefined' ? (window as any).zucchini || (window as any).zcash : null);

    const methods = [
      'getBalance',
      'getBalances',
      'zcash_getBalance',
      'zcash_getBalances',
      'view_balance',
      'getBalanceSummary',
    ];

    if (raw && typeof raw.request === 'function') {
      for (const method of methods) {
        try {
          const res = await raw.request({ method, params: options });
          const parsed = this.parseBalancePayload(res);
          if (parsed !== null) return parsed;
        } catch {
          // try next RPC method
        }
      }
    }

    // Inspect cached accounts from connection
    if (this._lastAccounts && this._lastAccounts.length > 0) {
      for (const acc of this._lastAccounts) {
        const parsed = this.parseBalancePayload(acc);
        if (parsed !== null) return parsed;
      }
    }

    return null;
  }

  /**
   * Sends payment via standard ZIP-321 URI requestPayment or transaction fallback.
   */
  async requestPayment(params: {
    recipient: string;
    amount: number | string;
    memo?: string;
  }): Promise<WalletPaymentResult> {
    if (!this._connected) {
      await this.connect();
    }

    const client = await this.getClient();
    const numAmount = typeof params.amount === 'number' ? params.amount : parseFloat(params.amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Payment amount must be a positive number.');
    }

    // 1. Generate standard ZIP-321 URI
    const uri = generateZip321Uri({
      address: params.recipient.trim(),
      amount: numAmount,
      memo: params.memo?.trim(),
    });

    try {
      if (typeof client.requestPayment === 'function') {
        const res = await client.requestPayment(uri);
        const txId = res?.txid || res?.txId || '';
        return { txId, submitted: true };
      }
    } catch (e) {
      // If requestPayment fails or is unsupported, try requestTransaction
    }

    // 2. Fallback: requestTransaction
    if (typeof client.requestTransaction === 'function') {
      const zatoshis = BigInt(Math.round(numAmount * 100000000));
      const res = await client.requestTransaction({
        amountZatoshis: zatoshis,
        recipient: params.recipient.trim(),
        memo: params.memo?.trim(),
      });
      return { txId: res?.txid || '', submitted: true };
    }

    throw new Error('Zucchini Wallet does not support payment dispatch.');
  }

  /**
   * Subscribes to accountsChanged events.
   */
  onAccountsChanged(listener: (accounts: any) => void): () => void {
    if (this.client?.on) {
      return this.client.on('accountsChanged', listener);
    }
    if (this.provider?.on) {
      this.provider.on('accountsChanged', listener);
      return () => this.provider?.off?.('accountsChanged', listener);
    }
    return () => {};
  }

  /**
   * Subscribes to disconnect events.
   */
  onDisconnect(listener: () => void): () => void {
    if (this.client?.on) {
      return this.client.on('disconnect', listener);
    }
    if (this.provider?.on) {
      this.provider.on('disconnect', listener);
      return () => this.provider?.off?.('disconnect', listener);
    }
    return () => {};
  }

  /**
   * Disconnects the current session.
   */
  async disconnect(): Promise<void> {
    try {
      if (this.client?.disconnect) {
        await this.client.disconnect();
      } else if (this.provider?.disconnect) {
        await this.provider.disconnect();
      }
    } catch {
      // best-effort
    }
    this._connected = false;
    this._address = null;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  get address(): string | null {
    return this._address;
  }
}
