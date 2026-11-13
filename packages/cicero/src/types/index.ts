export type ZcashAddressType = 'unified' | 'sapling' | 'transparent' | 'unknown';

export type ZcashNetwork = 'mainnet' | 'testnet';

export type PaymentStatus = 
  | 'idle' 
  | 'pending' 
  | 'detected' 
  | 'confirmed' 
  | 'expired' 
  | 'failed';

export type CiceroTheme = 'supabase' | 'emerald' | 'dark' | 'light';

export interface PaymentDetails {
  recipient: string;
  amount: number | string;
  memo?: string;
  message?: string;
  network?: ZcashNetwork;
  invoiceId?: string;
}

export interface Zip321PaymentRequest {
  address: string;
  amount?: string;
  memo?: string;
  message?: string;
  rawUri: string;
}

export interface CiceroPayProps {
  /** Zcash recipient address (Unified, Sapling, or Transparent) */
  recipient: string;
  /** Amount in ZEC */
  amount: number | string;
  /** Optional encrypted memo (up to 512 bytes, supported on shielded addresses) */
  memo?: string;
  /** Optional human-readable message */
  message?: string;
  /** Button label text */
  label?: string;
  /** Zcash network (defaults to 'mainnet') */
  network?: ZcashNetwork;
  /** Visual theme */
  theme?: CiceroTheme;
  /** Button variant */
  variant?: 'primary' | 'outline' | 'dark';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show estimated USD value alongside ZEC */
  showUsd?: boolean;
  /** Custom modal title */
  modalTitle?: string;
  /** Custom modal subtitle */
  modalSubtitle?: string;
  /** Invoice expiration time in seconds (defaults to 900 = 15 mins) */
  expiresInSeconds?: number;
  /** Optional custom lightwalletd or indexer URL */
  customRpcUrl?: string;
  /** Optional unique invoice or order reference */
  invoiceId?: string;
  /** Callback fired when transaction confirmation is detected */
  onSuccess?: (tx: { txId: string; amount: number; memo?: string }) => void;
  /** Callback fired on payment error */
  onError?: (error: Error) => void;
  /** Callback fired whenever the payment status transitions */
  onStatusChange?: (status: PaymentStatus) => void;
  /** Custom CSS classes for the trigger button */
  className?: string;
  /** Disable the button */
  disabled?: boolean;
}
