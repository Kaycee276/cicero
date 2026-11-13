import { ZcashAddressType } from '../types';

/**
 * Detects the type of a Zcash address.
 */
export function getAddressType(address: string): ZcashAddressType {
  if (!address || typeof address !== 'string') {
    return 'unknown';
  }

  const clean = address.trim();

  // Unified Address (ZIP-316)
  if (clean.startsWith('u1') || clean.startsWith('utest1')) {
    return 'unified';
  }

  // Sapling Shielded Address
  if (clean.startsWith('zs1') || clean.startsWith('ztestsapling1')) {
    return 'sapling';
  }

  // Transparent Address
  if (clean.startsWith('t1') || clean.startsWith('t3') || clean.startsWith('tm')) {
    return 'transparent';
  }

  return 'unknown';
}

/**
 * Checks whether an address supports zero-knowledge shielded encryption (Unified or Sapling).
 */
export function isShieldedAddress(address: string): boolean {
  const type = getAddressType(address);
  return type === 'unified' || type === 'sapling';
}

/**
 * Truncates a long address for display purposes.
 * e.g., u1abcdef...987654
 */
export function truncateAddress(address: string, start = 8, end = 8): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= start + end + 3) {
    return clean;
  }
  return `${clean.slice(0, start)}...${clean.slice(-end)}`;
}

/**
 * Validates whether the address supports encrypted memos.
 * Memos in Zcash are strictly for shielded receivers (Sapling & Orchard).
 * Transparent addresses do not support on-chain encrypted memos.
 */
export function validateMemoSupport(address: string, memo?: string): {
  valid: boolean;
  warning?: string;
  byteLength: number;
} {
  const byteLength = memo ? new TextEncoder().encode(memo).length : 0;
  const isAddressShielded = isShieldedAddress(address);

  if (byteLength > 512) {
    return {
      valid: false,
      warning: `Memo exceeds Zcash protocol limit of 512 bytes (current: ${byteLength} bytes).`,
      byteLength,
    };
  }

  if (memo && !isAddressShielded) {
    return {
      valid: true,
      warning: 'Warning: Transparent addresses (t-addr) do not support shielded encrypted memos. Use a Unified (u1) or Sapling (zs1) address to protect your memo.',
      byteLength,
    };
  }

  return {
    valid: true,
    byteLength,
  };
}
