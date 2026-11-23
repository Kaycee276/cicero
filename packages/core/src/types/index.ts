export type ZcashNetwork = 'mainnet' | 'testnet';

export type ZcashAddressType = 'unified' | 'sapling' | 'transparent' | 'viewing-key' | 'unknown';

export type WalletCategory = 'extension' | 'mobile' | 'desktop' | 'read-only' | 'developer';

export interface Zip321PaymentRequest {
  address: string;
  amount?: string;
  memo?: string;
  message?: string;
  rawUri: string;
}

export interface BuildZip321Params {
  address: string;
  amount?: number | string;
  memo?: string;
  message?: string;
}

export interface WalletSession {
  address?: string;
  viewingKey?: string;
  network?: ZcashNetwork;
  connected: boolean;
  walletId: string;
  balance?: number;
}

export interface WalletConnectOptions {
  network?: ZcashNetwork;
  customKey?: string;
}

export interface SendPaymentParams {
  recipient: string;
  amount: number | string;
  memo?: string;
  message?: string;
}

export interface SendPaymentResult {
  txId: string;
  submitted: boolean;
  rawUri?: string;
}

export interface WalletNetworkSwitchResult {
  success: boolean;
  requiresManualSwitch?: boolean;
  currentNetwork?: ZcashNetwork;
}

export type WalletAdapterEvent = 'accountChange' | 'networkChange' | 'disconnect';

export interface WalletAdapterEventMap {
  accountChange: WalletSession | null;
  networkChange: ZcashNetwork;
  disconnect: undefined;
}

export type WalletAdapterEventListener<K extends WalletAdapterEvent> = (
  payload: WalletAdapterEventMap[K]
) => void;

export interface WalletEventSources {
  onAccountChange?: (listener: (session: WalletSession | null) => void) => () => void;
  onNetworkChange?: (listener: (network: ZcashNetwork) => void) => () => void;
  onDisconnected?: (listener: () => void) => () => void;
}

/** Framework-neutral wallet contract implemented by core adapters. */
export interface WalletAdapter {
  readonly id: string;
  isAvailable(): boolean;
  connect(options?: WalletConnectOptions): Promise<WalletSession>;
  disconnect(): Promise<void>;
  getAddress(): string | null;
  getBalance(options?: { address?: string; network?: ZcashNetwork }): Promise<number | null>;
  getNetwork(): Promise<ZcashNetwork>;
  switchNetwork(network: ZcashNetwork): Promise<WalletNetworkSwitchResult>;
  sendPayment(params: SendPaymentParams): Promise<SendPaymentResult>;
  on<K extends WalletAdapterEvent>(event: K, listener: WalletAdapterEventListener<K>): () => void;
}

/** Legacy wallet catalog contract retained for @cicero-zcash/react. */
export interface ZcashWallet extends WalletEventSources {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: WalletCategory;
  downloadUrl?: string;
  isAvailable: () => boolean;
  connect: (options?: WalletConnectOptions) => Promise<WalletSession>;
  disconnect?: () => Promise<void>;
  getBalance?: (options?: { address?: string; network?: ZcashNetwork }) => Promise<number | null>;
  getNetwork?: () => Promise<ZcashNetwork>;
  switchNetwork?: (network: ZcashNetwork) => Promise<WalletNetworkSwitchResult>;
  sendPayment?: (params: SendPaymentParams) => Promise<SendPaymentResult>;
}
