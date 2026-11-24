<div align="center">

# 🛡️ @cicero-zcash/core

### Framework-Agnostic Wallet Adapters & Payment Utilities for Shielded Zcash

[![License: MIT](https://img.shields.io/badge/License-MIT-3ecf8e.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/@cicero-zcash/core?color=3ecf8e)](https://www.npmjs.com/package/@cicero-zcash/core)
[![Zcash](https://img.shields.io/badge/Zcash-Shielded-171717?logo=zcash&logoColor=3ecf8e)](https://z.cash)

</div>

`@cicero-zcash/core` is the framework-agnostic foundation of Cicero. It delivers standalone TypeScript wallet adapters, ZIP-321 payment request encoders/decoders, and address format validators for any JavaScript or TypeScript runtime (Node.js, Vue, Svelte, Angular, React Native, or vanilla TS).

---

## 📦 Installation

```bash
# npm
npm install @cicero-zcash/core

# pnpm
pnpm add @cicero-zcash/core

# yarn
yarn add @cicero-zcash/core
```

---

## ⚡ Quickstart

### 1. Address Validation & Type Detection

```typescript
import {
  getAddressType,
  isShieldedAddress,
  isViewingKey,
  truncateAddress,
  validateMemoSupport,
} from '@cicero-zcash/core';

// Detect address format
getAddressType('u1...'); // 'unified'
getAddressType('zs1...'); // 'sapling'
getAddressType('t1...'); // 'transparent'

// Check memo compatibility (transparent addresses cannot carry encrypted memos)
const check = validateMemoSupport('t1...', 'Confidential invoice #402');
console.log(check.valid); // true
console.log(check.warning); // "Warning: Transparent addresses (t-addr) do not support shielded encrypted memos..."
```

### 2. ZIP-321 Payment Request Generation & Parsing

```typescript
import { generateZip321Uri, parseZip321Uri } from '@cicero-zcash/core';

// Build a standardized ZIP-321 URI
const uri = generateZip321Uri({
  address: 'u1qe28vfxr0m46tkmrqv00e4e37x4d...',
  amount: 0.25,
  memo: 'Order #1042',
  message: 'Donation to Privacy Research',
});

// Parse an incoming ZIP-321 URI
const request = parseZip321Uri(uri);
console.log(request.address); // 'u1qe28vfxr0m46tkmrqv00e4e37x4d...'
console.log(request.amount); // 0.25
console.log(request.memo); // 'Order #1042'
```

### 3. Wallet Adapters

```typescript
import { createWalletAdapter, getDefaultWallets, ZucchiniWalletAdapter } from '@cicero-zcash/core';

// Get all 7 standard wallet metadata configurations
const wallets = getDefaultWallets();

// Instantiate dedicated adapter
const adapter = new ZucchiniWalletAdapter();

// Listen to session & network events
adapter.on('connect', (session) => {
  console.log('Connected to:', session.address);
});

adapter.on('networkChange', (network) => {
  console.log('Network changed:', network);
});

await adapter.connect();
```

---

## 📱 Supported Wallets

| Wallet             | Type              | Mechanism                                          | Supported Networks |
| :----------------- | :---------------- | :------------------------------------------------- | :----------------- |
| **Zucchini**       | Browser Extension | Direct `window.zucchini` / `window.zcash` provider | Mainnet, Testnet   |
| **Zashi**          | Mobile            | ZIP-321 Deep Linking & QR handoff                  | Mainnet            |
| **YWallet**        | Mobile & Desktop  | ZIP-321 Deep Linking & QR handoff                  | Mainnet, Testnet   |
| **Noir**           | Mobile & Web      | Web3 connector & session bridge                    | Mainnet            |
| **Zelcore**        | Desktop & Mobile  | Direct protocol link / QR                          | Mainnet            |
| **Viewing Key**    | Read-Only Audit   | `uview1...` / `zxviews...` key import              | Mainnet, Testnet   |
| **Burner Session** | Developer Sandbox | Ephemeral shielded mock sessions                   | Testnet            |

---

## 📄 License

MIT © [Kaycee276](https://github.com/Kaycee276)
