export type WalletConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type WalletPaymentStatus =
  | 'idle'
  | 'requesting'
  | 'submitted'
  | 'error';

export interface WalletSession {
  address?: string;
  connected: boolean;
}

export interface WalletPaymentResult {
  txId: string;
  submitted: boolean;
}

/**
 * Adapter for the Zucchini Wallet browser extension.
 *
 * Zucchini injects a provider via @zucchinifi/dapp-sdk that exposes:
 *   - connect()         → prompts user for site permissions
 *   - requestPayment()  → opens the send-review screen with ZIP-321 params
 *
 * This adapter wraps that SDK so Cicero components can call it cleanly.
 */
export class ZucchiniWalletAdapter {
  private provider: any = null;
  private _connected = false;

  /**
   * Checks whether the Zucchini Wallet extension is installed and its
   * provider is available in the current browser environment.
   */
  static isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    // Zucchini injects onto window.zcash or window.zucchini
    return !!(
      (window as any).zcash ||
      (window as any).zucchini
    );
  }

  /**
   * Lazily imports and initialises the ZucchiniWalletProvider.
   * Falls back to the raw window.zcash / window.zucchini global
   * if the npm package isn't bundled.
   */
  private async getProvider(): Promise<any> {
    if (this.provider) return this.provider;

    try {
      // Try the official npm SDK first
      const sdk = await import('@zucchinifi/dapp-sdk');
      const Provider = (sdk as any).ZucchiniWalletProvider ?? (sdk as any).default;
      if (Provider) {
        this.provider = new Provider();
        return this.provider;
      }
    } catch {
      // SDK not bundled – fall through to raw window global
    }

    // Direct window global fallback
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.zcash) {
        this.provider = win.zcash;
        return this.provider;
      }
      if (win.zucchini) {
        this.provider = win.zucchini;
        return this.provider;
      }
    }

    throw new Error(
      'Zucchini Wallet extension not detected. Please install it from the Chrome Web Store.'
    );
  }

  /**
   * Requests a connection to the user's Zucchini wallet.
   * This prompts the user inside the extension side-panel for permission.
   * Connection does NOT authorize transactions – each payment is a separate approval.
   */
  async connect(): Promise<WalletSession> {
    const provider = await this.getProvider();
    const session = await provider.connect();
    this._connected = true;
    return {
      address: session?.address ?? undefined,
      connected: true,
    };
  }

  /**
   * Sends a ZIP-321 payment request to Zucchini for user review & approval.
   * The wallet opens its standard send-review screen; the user must explicitly
   * review the recipient, amount, memo, and fee before signing.
   *
   * Returns a transaction ID upon broadcast submission (note: submission ≠ confirmation).
   */
  async requestPayment(params: {
    recipient: string;
    amount: number | string;
    memo?: string;
  }): Promise<WalletPaymentResult> {
    if (!this._connected) {
      await this.connect();
    }

    const provider = await this.getProvider();

    const numAmount =
      typeof params.amount === 'number'
        ? params.amount
        : parseFloat(params.amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Payment amount must be a positive number.');
    }

    const paymentRequest: Record<string, any> = {
      recipient: params.recipient.trim(),
      amount: numAmount.toString(),
    };

    if (params.memo && params.memo.trim().length > 0) {
      paymentRequest.memo = params.memo.trim();
    }

    const txResponse = await provider.requestPayment(paymentRequest);

    return {
      txId: txResponse?.txId ?? txResponse?.transactionId ?? txResponse?.hash ?? '',
      submitted: true,
    };
  }

  /**
   * Disconnects the current session (if the provider supports it).
   */
  async disconnect(): Promise<void> {
    try {
      if (this.provider?.disconnect) {
        await this.provider.disconnect();
      }
    } catch {
      // best-effort
    }
    this._connected = false;
  }

  get isConnected(): boolean {
    return this._connected;
  }
}
