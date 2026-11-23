import type { ZcashWallet } from '../types';
import { burnerWallet } from './burner';
import { noirWallet } from './noir';
import { viewingKeyWallet } from './viewingKey';
import { ywallet } from './ywallet';
import { zelcoreWallet } from './zelcore';
import { zashiWallet } from './zashi';
import { zucchiniWallet } from './zucchini';

export * from '../types';
export * from './BaseWalletAdapter';
export * from './CatalogWalletAdapter';
export * from './ZucchiniExtensionAdapter';
export * from './adapters';
export { burnerWallet } from './burner';
export { noirWallet, isNoirAvailable } from './noir';
export { viewingKeyWallet } from './viewingKey';
export { ywallet } from './ywallet';
export { zelcoreWallet, isZelcoreAvailable } from './zelcore';
export { zashiWallet } from './zashi';
export { zucchiniWallet, zucchiniExtensionAdapter } from './zucchini';

/** Returns the standard seven Zcash wallet connection mechanisms. */
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
