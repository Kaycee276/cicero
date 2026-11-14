export type ZcashAddressType = 'unified' | 'sapling' | 'transparent' | 'unknown';

export type ZcashNetwork = 'mainnet' | 'testnet';

export type CiceroTheme = 'supabase' | 'emerald' | 'dark' | 'light';

export interface Zip321PaymentRequest {
  address: string;
  amount?: string;
  memo?: string;
  message?: string;
  rawUri: string;
}
