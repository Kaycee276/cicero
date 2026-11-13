import { ZcashWallet } from './types';
import { zucchiniWallet } from './zucchini';
import { zashiWallet } from './zashi';
import { ywallet } from './ywallet';
import { viewingKeyWallet } from './viewingKey';
import { burnerWallet } from './burner';

export * from './types';
export { zucchiniWallet } from './zucchini';
export { zashiWallet } from './zashi';
export { ywallet } from './ywallet';
export { viewingKeyWallet } from './viewingKey';
export { burnerWallet } from './burner';

/**
 * Returns the default suite of supported Zcash wallets.
 * Zucchini will be marked as available if the browser extension is detected.
 */
export function getDefaultWallets(): ZcashWallet[] {
  return [
    zucchiniWallet,
    zashiWallet,
    ywallet,
    viewingKeyWallet,
    burnerWallet,
  ];
}
