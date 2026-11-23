import { describe, expect, it } from 'vitest';
import {
  getAddressType,
  isShieldedAddress,
  isViewingKey,
  truncateAddress,
  validateMemoSupport,
} from '../src/address';

describe('Zcash address helpers', () => {
  it.each([
    ['u1abc', 'unified'],
    ['utest1abc', 'unified'],
    ['zs1abc', 'sapling'],
    ['ztestsapling1abc', 'sapling'],
    ['t1abc', 'transparent'],
    ['t3abc', 'transparent'],
    ['tmabc', 'transparent'],
    ['uview1abc', 'viewing-key'],
    ['zxviews1abc', 'viewing-key'],
    ['not-a-zcash-value', 'unknown'],
  ] as const)('classifies %s as %s', (value, expected) => {
    expect(getAddressType(value)).toBe(expected);
  });

  it('trims input before classification and handles empty values', () => {
    expect(getAddressType('  u1abc  ')).toBe('unified');
    expect(getAddressType('')).toBe('unknown');
  });

  it('recognizes shielded addresses but not viewing keys or transparent addresses', () => {
    expect(isShieldedAddress('u1abc')).toBe(true);
    expect(isShieldedAddress('zs1abc')).toBe(true);
    expect(isShieldedAddress('t1abc')).toBe(false);
    expect(isShieldedAddress('uview1abc')).toBe(false);
    expect(isViewingKey(' zxviews1abc ')).toBe(true);
    expect(isViewingKey('t1abc')).toBe(false);
  });

  it('truncates long values and preserves short values', () => {
    expect(truncateAddress('  u1abcdefghijklmno  ', 5, 4)).toBe('u1abc...lmno');
    expect(truncateAddress('u1short', 8, 8)).toBe('u1short');
    expect(truncateAddress('')).toBe('');
  });

  it('measures memo length in UTF-8 bytes and enforces the 512-byte limit', () => {
    expect(validateMemoSupport('u1abc', 'é'.repeat(256))).toMatchObject({
      valid: true,
      byteLength: 512,
    });
    expect(validateMemoSupport('u1abc', 'é'.repeat(257))).toMatchObject({
      valid: false,
      byteLength: 514,
    });
  });

  it('warns when a memo targets a transparent address', () => {
    expect(validateMemoSupport('t1abc', 'memo')).toMatchObject({
      valid: true,
      byteLength: 4,
      warning: expect.stringContaining('do not support'),
    });
  });
});
