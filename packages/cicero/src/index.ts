// Provider & Context (RainbowKit-style)
export {
  CiceroProvider,
  useCicero,
  useAccount,
  useBalance,
  useConnectModal,
  useAccountModal,
} from './context/CiceroContext';
export type {
  CiceroContextType,
  CiceroProviderProps,
  AccountState,
  BalanceState,
} from './context/CiceroContext';

// Components — Wallet Connection
export { CiceroConnectButton } from './components/CiceroConnectButton';
export type { CiceroConnectButtonProps } from './components/CiceroConnectButton';
export { CiceroConnectModal } from './components/CiceroConnectModal';
export type { CiceroConnectModalProps } from './components/CiceroConnectModal';
export { CiceroAccountModal } from './components/CiceroAccountModal';
export type { CiceroAccountModalProps } from './components/CiceroAccountModal';
export { CiceroQRCode } from './components/CiceroQRCode';

// Hooks
export { useZcashPrice } from './hooks/useZcashPrice';
export { useZucchiniWallet } from './hooks/useZucchiniWallet';
export type { UseZucchiniWalletOptions } from './hooks/useZucchiniWallet';

// Wallet Registry & Connectors
export * from './wallets';

// Low-level Adapter
export { ZucchiniWalletAdapter } from './wallet/zucchini';

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
  ZcashNetwork,
  ZcashAddressType,
  CiceroTheme,
} from './types';
