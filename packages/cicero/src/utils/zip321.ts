import { Zip321PaymentRequest } from '../types';

/**
 * Encodes a string to Base64URL without padding per RFC 4648 §5 / ZIP-321 specification.
 */
export function encodeBase64Url(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    // Convert base64 to base64url: '+' -> '-', '/' -> '_', remove '='
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/**
 * Decodes a Base64URL string without padding per ZIP-321 specification.
 */
export function decodeBase64Url(base64url: string): string {
  try {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

export interface BuildZip321Params {
  address: string;
  amount?: number | string;
  memo?: string;
  message?: string;
}

/**
 * Generates an RFC-compliant ZIP-321 Payment Request URI.
 * Example output:
 * zcash:u1xyz...?amount=0.05&memo=T3JkZXIgIzEwNDI&message=Payment%20for%20order
 */
export function generateZip321Uri({
  address,
  amount,
  memo,
  message,
}: BuildZip321Params): string {
  const cleanAddress = address.trim();
  const params = new URLSearchParams();

  if (amount !== undefined && amount !== null && amount !== '') {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      params.append('amount', numAmount.toString());
    }
  }

  if (memo && memo.trim().length > 0) {
    const encodedMemo = encodeBase64Url(memo.trim());
    if (encodedMemo) {
      params.append('memo', encodedMemo);
    }
  }

  if (message && message.trim().length > 0) {
    params.append('message', message.trim());
  }

  const queryString = params.toString();
  return queryString ? `zcash:${cleanAddress}?${queryString}` : `zcash:${cleanAddress}`;
}

/**
 * Parses a ZIP-321 URI back into its component parts.
 */
export function parseZip321Uri(rawUri: string): Zip321PaymentRequest {
  const trimmed = rawUri.trim();
  const withoutScheme = trimmed.startsWith('zcash:') ? trimmed.slice(6) : trimmed;
  const [addressPart, queryPart] = withoutScheme.split('?');

  const result: Zip321PaymentRequest = {
    address: addressPart || '',
    rawUri: trimmed,
  };

  if (!queryPart) {
    return result;
  }

  const searchParams = new URLSearchParams(queryPart);
  const amount = searchParams.get('amount');
  const memo = searchParams.get('memo');
  const message = searchParams.get('message');

  if (amount) result.amount = amount;
  if (memo) result.memo = decodeBase64Url(memo);
  if (message) result.message = message;

  return result;
}

/**
 * Generates deep link URLs for major mobile Zcash wallets:
 * - Zashi (Electric Coin Co.)
 * - Ywallet
 */
export function getWalletDeepLinks(zip321Uri: string): {
  generic: string;
  zashi: string;
  ywallet: string;
} {
  return {
    generic: zip321Uri,
    zashi: zip321Uri, // Zashi registers the native zcash: URI handler on iOS/Android
    ywallet: zip321Uri, // Ywallet also natively handles zcash: protocol
  };
}
