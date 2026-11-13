import { ZcashNetwork } from '../types';

export type WalletCategory = 'extension' | 'mobile' | 'desktop' | 'read-only' | 'developer';

export interface WalletSession {
  address?: string;
  viewingKey?: string;
  network?: ZcashNetwork;
  connected: boolean;
  walletId: string;
  balance?: number;
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

export interface ZcashWallet {
  id: string;
  name: string;
  icon: string; // SVG path or data URI
  description: string;
  category: WalletCategory;
  downloadUrl?: string;
  isAvailable: () => boolean;
  connect: (options?: { network?: ZcashNetwork }) => Promise<WalletSession>;
  disconnect?: () => Promise<void>;
  getBalance?: (options?: { address?: string; network?: ZcashNetwork }) => Promise<number | null>;
  sendPayment?: (params: SendPaymentParams) => Promise<SendPaymentResult>;
}
