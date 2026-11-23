import { describe, expect, it } from 'vitest';
import {
  decodeBase64Url,
  encodeBase64Url,
  generateZip321Uri,
  getWalletDeepLinks,
  parseZip321Uri,
} from '../src/zip321';

describe('ZIP-321 helpers', () => {
  it('builds a payment URI and round-trips all supported fields', () => {
    const uri = generateZip321Uri({
      address: ' u1testaddress ',
      amount: '0.05',
      memo: 'Order #1042 – café',
      message: 'Payment for order',
    });

    expect(uri).toMatch(/^zcash:u1testaddress\?/);
    expect(parseZip321Uri(uri)).toMatchObject({
      address: 'u1testaddress',
      amount: '0.05',
      memo: 'Order #1042 – café',
      message: 'Payment for order',
      rawUri: uri,
    });
  });

  it.each([undefined, '', 0, -1, 'not-a-number'])('omits invalid or absent amount %s', (amount) => {
    expect(generateZip321Uri({ address: 'u1abc', amount })).toBe('zcash:u1abc');
  });

  it('trims memo and message and omits empty query fields', () => {
    expect(generateZip321Uri({ address: 'u1abc', memo: '  ', message: '  ' })).toBe('zcash:u1abc');
  });

  it('encodes Base64URL without padding and supports Unicode', () => {
    const encoded = encodeBase64Url('mañana ☕');
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeBase64Url(encoded)).toBe('mañana ☕');
  });

  it('returns an empty string for invalid Base64URL', () => {
    expect(decodeBase64Url('%%%')).toBe('');
  });

  it('parses a URI without a scheme and preserves the original trimmed URI', () => {
    expect(parseZip321Uri('  u1abc?amount=1  ')).toEqual({
      address: 'u1abc',
      amount: '1',
      rawUri: 'u1abc?amount=1',
    });
  });

  it('returns the generic protocol URI for mobile wallet deep links', () => {
    expect(getWalletDeepLinks('zcash:u1abc?amount=1')).toEqual({
      generic: 'zcash:u1abc?amount=1',
      zashi: 'zcash:u1abc?amount=1',
      ywallet: 'zcash:u1abc?amount=1',
    });
  });
});
