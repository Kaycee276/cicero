import { ZcashWallet } from './types';
import { zucchiniWallet } from './zucchini';
import { noirWallet } from './noir';
import { zelcoreWallet } from './zelcore';
import { zashiWallet } from './zashi';
import { ywallet } from './ywallet';
import { viewingKeyWallet } from './viewingKey';
import { burnerWallet } from './burner';

export * from './types';
export { zucchiniWallet } from './zucchini';
export { noirWallet, isNoirAvailable } from './noir';
export { zelcoreWallet, isZelcoreAvailable } from './zelcore';
export { zashiWallet } from './zashi';
export { ywallet } from './ywallet';
export { viewingKeyWallet } from './viewingKey';
export { burnerWallet } from './burner';

/**
 * Returns the default suite of supported Zcash wallets.
 * In-browser extensions (Zucchini, Noir, Zelcore) are dynamically detected.
 */
export function getDefaultWallets(): ZcashWallet[] {
  return [
    zucchiniWallet,
    noirWallet,
    zelcoreWallet,
    zashiWallet,
    ywallet,
    viewingKeyWallet,
    burnerWallet,
  ];
}
