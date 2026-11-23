import { describe, expect, it } from 'vitest';
import { normalizeHexColor, getContrastTextColor } from '../utils/color';
import {
  getAddressType,
  isShieldedAddress,
  isViewingKey,
  truncateAddress,
  validateMemoSupport,
} from '../utils/address';
import {
  encodeBase64Url,
  decodeBase64Url,
  generateZip321Uri,
  parseZip321Uri,
} from '../utils/zip321';

describe('@cicero-zcash/react color utilities', () => {
  it('normalizes 3-char, 6-char, and invalid hex codes', () => {
    expect(normalizeHexColor('#fff', '#000000')).toBe('#ffffff');
    expect(normalizeHexColor('#3ECF8E', '#000000')).toBe('#3ecf8e');
    expect(normalizeHexColor('invalid', '#f59e0b')).toBe('#f59e0b');
    expect(normalizeHexColor(undefined, '#3ecf8e')).toBe('#3ecf8e');
  });

  it('calculates optimal contrast text color', () => {
    // Light background should yield dark text (#171717)
    expect(getContrastTextColor('#ffffff')).toBe('#171717');
    expect(getContrastTextColor('#f59e0b')).toBe('#171717');
    expect(getContrastTextColor('#3ecf8e')).toBe('#171717');

    // Dark background should yield white text (#ffffff)
    expect(getContrastTextColor('#000000')).toBe('#ffffff');
    expect(getContrastTextColor('#171717')).toBe('#ffffff');
  });
});

describe('@cicero-zcash/react address & zip321 re-exports', () => {
  it('truncates addresses properly', () => {
    const sample = 'u1testaddress1234567890abcdefghijklmnopqrstuvwxyz';
    expect(truncateAddress(sample, 4, 4)).toBe('u1te...wxyz');
    expect(truncateAddress('')).toBe('');
    expect(truncateAddress('short')).toBe('short');
  });

  it('detects address types and shields', () => {
    expect(getAddressType('u1unified')).toBe('unified');
    expect(getAddressType('zs1sapling')).toBe('sapling');
    expect(getAddressType('t1transparent')).toBe('transparent');
    expect(getAddressType('uview1key')).toBe('viewing-key');

    expect(isShieldedAddress('u1unified')).toBe(true);
    expect(isShieldedAddress('t1transparent')).toBe(false);
    expect(isViewingKey('uview1key')).toBe(true);
  });

  it('encodes and decodes base64url and zip321', () => {
    const raw = 'Hello Zcash!';
    const encoded = encodeBase64Url(raw);
    expect(decodeBase64Url(encoded)).toBe(raw);

    const uri = generateZip321Uri({
      address: 'u1dest',
      amount: 2.5,
      memo: 'Coffee',
    });
    expect(uri).toContain('zcash:u1dest');
    expect(uri).toContain('amount=2.5');

    const parsed = parseZip321Uri(uri);
    expect(parsed?.address).toBe('u1dest');
    expect(parsed?.amount).toBe('2.5');
    expect(parsed?.memo).toBe('Coffee');
  });

  it('validates memo length limits', () => {
    const validRes = validateMemoSupport('u1shielded', 'Short memo');
    expect(validRes.valid).toBe(true);

    const longMemo = 'a'.repeat(600);
    const invalidRes = validateMemoSupport('u1shielded', longMemo);
    expect(invalidRes.valid).toBe(false);
  });
});
