import { ZcashWallet } from './types';
import { zucchiniWallet } from './zucchini';
import { zelcoreWallet } from './zelcore';
import { zashiWallet } from './zashi';
import { ywallet } from './ywallet';
import { viewingKeyWallet } from './viewingKey';
import { burnerWallet } from './burner';

export * from './types';
export { zucchiniWallet } from './zucchini';
export { zelcoreWallet, isZelcoreAvailable } from './zelcore';
export { zashiWallet } from './zashi';
export { ywallet } from './ywallet';
export { viewingKeyWallet } from './viewingKey';
export { burnerWallet } from './burner';

/**
 * Returns the default suite of supported Zcash wallets.
 * In-browser extensions (Zucchini, Zelcore) are dynamically detected.
 */
export function getDefaultWallets(): ZcashWallet[] {
  return [
    zucchiniWallet,
    zelcoreWallet,
    zashiWallet,
    ywallet,
    viewingKeyWallet,
    burnerWallet,
  ];
}
