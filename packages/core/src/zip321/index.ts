import type { BuildZip321Params, Zip321PaymentRequest } from '../types';

/** Encodes UTF-8 text as unpadded Base64URL. */
export function encodeBase64Url(value: string): string {
  try {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/** Decodes unpadded Base64URL text as UTF-8. */
export function decodeBase64Url(value: string): string {
  try {
    let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

/** Generates a ZIP-321 payment request URI. */
export function generateZip321Uri({
  address,
  amount,
  memo,
  message,
}: BuildZip321Params): string {
  const cleanAddress = address.trim();
  const params = new URLSearchParams();

  if (amount !== undefined && amount !== null && amount !== '') {
    const numericAmount = typeof amount === 'number' ? amount : Number.parseFloat(amount);
    if (Number.isFinite(numericAmount) && numericAmount > 0) {
      params.append('amount', numericAmount.toString());
    }
  }

  if (memo?.trim()) {
    const encodedMemo = encodeBase64Url(memo.trim());
    if (encodedMemo) params.append('memo', encodedMemo);
  }

  if (message?.trim()) params.append('message', message.trim());

  const query = params.toString();
  return query ? `zcash:${cleanAddress}?${query}` : `zcash:${cleanAddress}`;
}

/** Parses a ZIP-321 URI into its address, amount, memo, and message fields. */
export function parseZip321Uri(rawUri: string): Zip321PaymentRequest {
  const trimmed = rawUri.trim();
  const withoutScheme = trimmed.startsWith('zcash:') ? trimmed.slice('zcash:'.length) : trimmed;
  const separator = withoutScheme.indexOf('?');
  const address = separator === -1 ? withoutScheme : withoutScheme.slice(0, separator);
  const query = separator === -1 ? '' : withoutScheme.slice(separator + 1);
  const result: Zip321PaymentRequest = { address, rawUri: trimmed };
  if (!query) return result;

  const params = new URLSearchParams(query);
  const amount = params.get('amount');
  const memo = params.get('memo');
  const message = params.get('message');
  if (amount) result.amount = amount;
  if (memo) result.memo = decodeBase64Url(memo);
  if (message) result.message = message;
  return result;
}

/** Returns protocol-handler URIs used by the supported mobile wallets. */
export function getWalletDeepLinks(zip321Uri: string): {
  generic: string;
  zashi: string;
  ywallet: string;
} {
  return { generic: zip321Uri, zashi: zip321Uri, ywallet: zip321Uri };
}
