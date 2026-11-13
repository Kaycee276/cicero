// Components
export { CiceroPayButton } from './components/CiceroPayButton';
export { CiceroModal } from './components/CiceroModal';
export { CiceroQRCode } from './components/CiceroQRCode';
export { CiceroInvoice } from './components/CiceroInvoice';

// Hooks
export { useCiceroPayment } from './hooks/useCiceroPayment';
export type { UseCiceroPaymentOptions } from './hooks/useCiceroPayment';
export { useZcashPrice } from './hooks/useZcashPrice';
export { useZucchiniWallet } from './hooks/useZucchiniWallet';
export type { UseZucchiniWalletOptions } from './hooks/useZucchiniWallet';

// Wallet Adapters
export { ZucchiniWalletAdapter } from './wallet/zucchini';
export type {
  WalletConnectionStatus,
  WalletPaymentStatus,
  WalletSession,
  WalletPaymentResult,
} from './wallet/zucchini';

// Utilities
export {
  getAddressType,
  isShieldedAddress,
  truncateAddress,
  validateMemoSupport,
} from './utils/address';

export {
  generateZip321Uri,
  parseZip321Uri,
  encodeBase64Url,
  decodeBase64Url,
  getWalletDeepLinks,
} from './utils/zip321';
export type { BuildZip321Params } from './utils/zip321';

// Types
export type {
  CiceroPayProps,
  PaymentStatus,
  ZcashNetwork,
  ZcashAddressType,
  CiceroTheme,
  PaymentDetails,
  Zip321PaymentRequest,
} from './types';
