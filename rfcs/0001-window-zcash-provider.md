# RFC 0001: Standardized In-Browser Web3 Provider (`window.zcash`)

```
ZIP: Draft
Title: Standardized In-Browser Web3 Provider (window.zcash)
Owners: Kaycee <https://github.com/Kaycee276>
Status: Draft / Community Review
Category: Standards / Ecosystem Interface
Created: 2026-11-24
License: MIT
Discussions-To: https://github.com/zcash/zips/issues/1483
Requires: ZIP-321
```

---

## 📑 Table of Contents

1. [Abstract](#abstract)
2. [Motivation & Current Landscape](#motivation--current-landscape)
3. [Specification](#specification)
   - [Provider Injection](#1-provider-injection)
   - [Core Provider Interface](#2-core-provider-interface)
   - [Standard RPC Methods](#3-standard-rpc-methods)
   - [Standard Event Subscriptions](#4-standard-event-subscriptions)
   - [Error Handling & Error Codes](#5-error-handling--error-codes)
4. [Security & Privacy Considerations](#security--privacy-considerations)
   - [Zero-Knowledge & Shielded Address Confidentiality](#zero-knowledge--shielded-address-confidentiality)
   - [Viewing Key Scope Limitation](#viewing-key-scope-limitation)
   - [Encrypted Memo Protections](#encrypted-memo-protections)
5. [Reference Implementation](#reference-implementation)
6. [Backward Compatibility](#backward-compatibility)
7. [References](#references)

---

## Abstract

This proposal specifies a standardized, in-browser JavaScript provider object injected into the global `window.zcash` namespace by Zcash browser extensions and desktop bridge agents.

Similar to Ethereum’s EIP-1193 or Solana’s Wallet Standard, this specification defines:

1. A transport-agnostic JSON-RPC `request` method.
2. Standardized RPC method names for account discovery, payment execution (ZIP-321), message signing, and balance queries.
3. Event subscription hooks for account and network changes.
4. Error code schemas for graceful client degradation.

Adopting this standard eliminates proprietary wallet coupling, allowing decentralized applications (dApps) to interact with any shielded Zcash wallet seamlessly through a unified interface.

---

## Motivation & Current Landscape

In the current Zcash ecosystem, Web3 applications encounter severe integration fragmentation:

- **Disparate APIs**: Browser extensions (such as Zucchini) inject custom globals (`window.zucchini` or partial `window.zcash`), while desktop and mobile wallets (Zashi, YWallet, Zelcore) rely exclusively on URI deep links or out-of-band QR handoffs.
- **No Shared Interface for dApps**: A dApp author wishing to request an address or initiate a shielded checkout must write bespoke logic for each wallet, resulting in brittle application code and discouraging Web3 adoption.
- **Shielded Privacy Demands**: Unlike transparent blockchains, Zcash introduces Unified Addresses, Sapling pools, Orchard pools, and encrypted 512-byte memos. A generic Web3 provider standard must account for shielded address types, network isolation (Mainnet vs Testnet), and memo privacy.

By establishing `window.zcash` as a formalized community specification, any new or existing wallet extension can become instantly compatible with every Zcash dApp that implements standard wallet toolkits like Cicero (`@cicero-zcash/core`).

---

## Specification

### 1. Provider Injection

A compliant Zcash wallet extension MUST inject an object conforming to the `ZcashProvider` interface at `window.zcash` prior to the document execution of the page (i.e. at `document_start`).

The provider SHOULD also identify itself via metadata properties:

```typescript
export interface ZcashProviderMetadata {
  name: string; // e.g. "Zucchini Wallet", "YWallet Extension"
  icon: string; // Data URI or SVG of the wallet icon
  version: string; // Semantic version of the wallet extension
  isZcash: true; // Compliant flag indicating window.zcash adherence
}
```

Extensions MAY retain backward-compatible legacy globals (such as `window.zucchini`) as aliases, but MUST expose the canonical interface on `window.zcash`.

---

### 2. Core Provider Interface

The provider MUST implement an event-driven JSON-RPC interface conforming to the following TypeScript definition:

```typescript
export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | Record<string, unknown>;
}

export interface ZcashProvider {
  readonly isZcash: true;
  readonly name: string;
  readonly version: string;

  /**
   * Primary entry point for all asynchronous RPC requests.
   * Conforms to JSON-RPC 2.0 semantics.
   */
  request<T = unknown>(args: RequestArguments): Promise<T>;

  /**
   * Event emitter methods for lifecycle notifications.
   */
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
  on(event: 'networkChanged', listener: (network: 'mainnet' | 'testnet') => void): this;
  on(event: 'connect', listener: (info: { network: string }) => void): this;
  on(event: 'disconnect', listener: (error: ZcashRpcError) => void): this;

  removeListener(event: string, listener: (...args: any[]) => void): this;
}
```

---

### 3. Standard RPC Methods

#### A. Account Discovery & Connection

##### `zcash_requestAccounts`

Prompts the user to authorize a connection to the dApp and returns an array of public address strings.

- **Parameters**: Optional object specifying requested address capabilities:
  ```typescript
  interface RequestAccountsParams {
    pool?: 'unified' | 'orchard' | 'sapling' | 'transparent';
    network?: 'mainnet' | 'testnet';
  }
  ```
- **Returns**: `string[]` — Array of approved addresses. The primary address SHOULD be at index `0`. Unified addresses (`u1...` on Mainnet, `utest1...` on Testnet) SHOULD be prioritized.
- **Errors**: Rejects with code `4001` if the user rejects the connection prompt.

##### `zcash_accounts`

Returns currently authorized accounts without displaying a user prompt.

- **Parameters**: None.
- **Returns**: `string[]` — Array of addresses, or `[]` if the dApp is not connected or the wallet is locked.

---

#### B. Network & Chain State

##### `zcash_getNetwork`

Returns the active network of the wallet.

- **Parameters**: None.
- **Returns**: `'mainnet' | 'testnet'`

##### `zcash_switchNetwork`

Requests that the wallet switch its active network.

- **Parameters**: `[{ network: 'mainnet' | 'testnet' }]`
- **Returns**: `null` on success.
- **Errors**: Code `4001` (User rejected), or Code `4901` (Unsupported network).

---

#### C. Payments & Transactions (ZIP-321)

##### `zcash_sendTransaction`

Requests that the wallet construct, prove, sign, and submit a Zcash transaction conforming to **ZIP-321** payment request rules.

- **Parameters**: Object conforming to ZIP-321 payment request parameters:
  ```typescript
  interface SendTransactionParams {
    recipient: string; // Unified, Sapling, or Transparent address
    amount: number | string; // Amount in ZEC (e.g. 0.05 or "0.05")
    memo?: string; // Optional UTF-8 memo text (max 512 bytes)
    message?: string; // Optional human-readable checkout description
  }
  ```
- **Validation**:
  - If `recipient` is a transparent address (`t1...`) and `memo` is provided, the wallet MUST either warn the user that transparent memos are not supported or reject the request.
  - If `memo` encoded as UTF-8 exceeds 512 bytes, the provider MUST reject with error code `-32602` (Invalid params).
- **Returns**:
  ```typescript
  interface SendTransactionResult {
    txId: string; // 32-byte hex transaction hash
    submitted: boolean; // True if broadcast to network
  }
  ```
- **Errors**: Code `4001` (User declined transaction).

---

#### D. Balance & Auditing

##### `zcash_getBalance`

Queries available balances for the connected account.

- **Parameters**: Optional pool selector:
  ```typescript
  interface GetBalanceParams {
    pool?: 'total' | 'shielded' | 'transparent';
  }
  ```
- **Returns**:
  ```typescript
  interface BalanceResult {
    total: string; // Formatted ZEC (e.g. "1.45000000")
    shielded: string; // Shielded pool (Orchard + Sapling)
    transparent: string; // Transparent pool (t-addr)
    zatoshis: string; // Integer value in 1e-8 zatoshis
  }
  ```

---

#### E. Authentication & Message Signing

##### `zcash_signMessage`

Requests an authenticating cryptographic signature over an arbitrary UTF-8 string (equivalent to Sign-In with Zcash / SIWZ).

- **Parameters**:
  ```typescript
  interface SignMessageParams {
    address: string; // The address to sign with
    message: string; // The challenge or authentication message
  }
  ```
- **Returns**: `string` — Base64URL-encoded signature payload verifying account possession without disclosing private keys.
- **Errors**: Code `4001` (User declined signature prompt).

---

### 4. Standard Event Subscriptions

A compliant provider MUST emit lifecycle events using the standard event listener pattern (`.on()`, `.removeListener()`):

| Event Name            | Callback Argument                 | When Emitted                                                                                      |
| :-------------------- | :-------------------------------- | :------------------------------------------------------------------------------------------------ |
| **`accountsChanged`** | `accounts: string[]`              | When the active account changes in the wallet, or when the user revokes permissions (emits `[]`). |
| **`networkChanged`**  | `network: 'mainnet' \| 'testnet'` | When the wallet toggles between Mainnet and Testnet.                                              |
| **`connect`**         | `{ network: string }`             | When the provider connects and is ready to process RPC requests.                                  |
| **`disconnect`**      | `error: ZcashRpcError`            | When the session is disconnected or the wallet extension is locked.                               |

---

### 5. Error Handling & Error Codes

All errors returned by `provider.request()` MUST conform to the `ZcashRpcError` structure:

```typescript
export interface ZcashRpcError extends Error {
  code: number;
  message: string;
  data?: unknown;
}
```

Standardized error codes:

|     Code     | Status                    | Meaning                                                                                                 |
| :----------: | :------------------------ | :------------------------------------------------------------------------------------------------------ |
|  **`4001`**  | **User Rejected Request** | The user explicitly declined the connection prompt, signature request, or transaction.                  |
|  **`4100`**  | **Unauthorized**          | The requested method requires authorization, but `zcash_requestAccounts` has not been approved.         |
|  **`4200`**  | **Unsupported Method**    | The provider does not implement the requested RPC method.                                               |
|  **`4900`**  | **Provider Disconnected** | The provider is disconnected from the Zcash network node.                                               |
|  **`4901`**  | **Network Mismatch**      | The requested operation is not supported on the active network (e.g. Mainnet request while on Testnet). |
| **`-32602`** | **Invalid Parameters**    | Input validation failed (e.g. invalid address format or memo > 512 bytes).                              |
| **`-32603`** | **Internal Error**        | Transaction construction or zero-knowledge proof generation failure inside wallet.                      |

---

## Security & Privacy Considerations

### Zero-Knowledge & Shielded Address Confidentiality

1. **Explicit Consent**: Under no circumstances may a provider disclose addresses to a dApp without explicit user confirmation via `zcash_requestAccounts`.
2. **Unified Address Preference**: Wallets SHOULD default to exposing Unified Addresses with Orchard and Sapling receivers to avoid leaking transparent linkability on public explorers.
3. **Correlation Isolation**: Wallets SHOULD allow users to designate different diversified addresses per origin domain to mitigate cross-dApp activity correlation.

### Viewing Key Scope Limitation

If a wallet provides viewing-key capabilities (`uview...` / `zxviews...`), it MUST prompt with a dedicated security warning informing the user that disclosing viewing keys reveals transaction histories to the requesting domain.

### Encrypted Memo Protections

The provider MUST validate that any confidential memo attached to a payment is strictly routed to a shielded receiver (`u1...` or `zs1...`). If a dApp specifies a transparent recipient (`t1...`) with a memo, the provider MUST prevent the transaction or warn the user that transparent memos are not protected by zk-SNARKs.

---

## Reference Implementation

A reference implementation conforming to this specification is maintained in the **Cicero** open-source repository:

- **Core Adapter**: [`packages/core/src/wallets/ZucchiniExtensionAdapter.ts`](https://github.com/Kaycee276/cicero/blob/main/packages/core/src/wallets/ZucchiniExtensionAdapter.ts)
- **Base Event-Driven Adapter**: [`packages/core/src/wallets/BaseWalletAdapter.ts`](https://github.com/Kaycee276/cicero/blob/main/packages/core/src/wallets/BaseWalletAdapter.ts)
- **NPM Package**: `@cicero-zcash/core` ([npmjs.com/package/@cicero-zcash/core](https://www.npmjs.com/package/@cicero-zcash/core))

---

## Backward Compatibility

This specification is designed to be fully backward-compatible:

1. **Legacy Extensions**: Adapters in client toolkits (such as Cicero) check `window.zcash` first, with graceful fallback to `window.zucchini` or other legacy globals.
2. **Mobile & Non-Extension Wallets**: Wallets lacking an in-browser injection layer continue to operate via **ZIP-321** deep links (`zcash:...`) and QR handoffs, handled automatically by the client adapter layer.

---

## References

- [ZIP 321: Payment Request URIs](https://zips.z.cash/zip-0321)
- [ZIP 316: Unified Addresses](https://zips.z.cash/zip-0316)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
- [Cicero Repository](https://github.com/Kaycee276/cicero)
