export type ZcashAddressType = 'unified' | 'sapling' | 'transparent' | 'unknown';

export type ZcashNetwork = 'mainnet' | 'testnet';

export type CiceroTheme = 'supabase' | 'emerald' | 'dark' | 'light' | 'gold' | 'cyber';

export type CiceroButtonVariant =
  | 'primary'
  | 'outline'
  | 'dark'
  | 'ghost'
  | 'gradient'
  | 'gold';

export type CiceroButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type CiceroButtonSize = 'sm' | 'md' | 'lg';

export interface CiceroButtonAppearance {
  variant: CiceroButtonVariant;
  size: CiceroButtonSize;
  radius: CiceroButtonRadius;
  showBalance: boolean;
  showNetwork: boolean;
  showIcon: boolean;
  accentColor: string;
}

export interface Zip321PaymentRequest {
  address: string;
  amount?: string;
  memo?: string;
  message?: string;
  rawUri: string;
}
