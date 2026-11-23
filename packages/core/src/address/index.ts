import type { ZcashAddressType } from '../types';

/** Detects a Zcash address or viewing-key format from its network prefix. */
export function getAddressType(address: string): ZcashAddressType {
  if (!address || typeof address !== 'string') return 'unknown';

  const clean = address.trim();
  if (clean.startsWith('u1') || clean.startsWith('utest1')) return 'unified';
  if (clean.startsWith('zs1') || clean.startsWith('ztestsapling1')) return 'sapling';
  if (clean.startsWith('t1') || clean.startsWith('t3') || clean.startsWith('tm')) {
    return 'transparent';
  }
  if (clean.startsWith('uview') || clean.startsWith('zxviews')) return 'viewing-key';

  return 'unknown';
}

/** Returns true when a string has a recognized unified or Sapling address prefix. */
export function isShieldedAddress(address: string): boolean {
  const type = getAddressType(address);
  return type === 'unified' || type === 'sapling';
}

/** Returns true when a string has a recognized Zcash viewing-key prefix. */
export function isViewingKey(value: string): boolean {
  return getAddressType(value) === 'viewing-key';
}

/** Truncates an address or viewing key for display. */
export function truncateAddress(address: string, start = 8, end = 8): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= start + end + 3) return clean;
  return `${clean.slice(0, start)}...${clean.slice(-end)}`;
}

/**
 * Checks ZIP-321 memo length and reports transparent-address limitations.
 * Memo size is measured as UTF-8 bytes, matching the protocol limit.
 */
export function validateMemoSupport(
  address: string,
  memo?: string
): { valid: boolean; warning?: string; byteLength: number } {
  const byteLength = memo ? new TextEncoder().encode(memo).length : 0;
  const shielded = isShieldedAddress(address);

  if (byteLength > 512) {
    return {
      valid: false,
      warning: `Memo exceeds Zcash protocol limit of 512 bytes (current: ${byteLength} bytes).`,
      byteLength,
    };
  }

  if (memo && !shielded) {
    return {
      valid: true,
      warning:
        'Warning: Transparent addresses (t-addr) do not support shielded encrypted memos. Use a Unified (u1) or Sapling (zs1) address to protect your memo.',
      byteLength,
    };
  }

  return { valid: true, byteLength };
}
