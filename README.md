<div align="center">

# 🛡️ Cicero

### The Developer Payment Kit for Shielded Zcash

**Drop-in React components for zero-knowledge payments, RFC-compliant ZIP-321 request URIs, and 512-byte encrypted memos.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3ecf8e.svg)](https://opensource.org/licenses/MIT)
[![Zcash](https://img.shields.io/badge/Zcash-Shielded-171717?logo=zcash&logoColor=3ecf8e)](https://z.cash)
[![ZIP-321](https://img.shields.io/badge/Standard-ZIP--321-24b47e)](https://zips.z.cash/zip-0321)
[![Design](https://img.shields.io/badge/Design-Supabase%20Tokens-3ecf8e)](./DESIGN.md)

[Live Interactive Studio](#live-studio) • [Quickstart](#quickstart) • [Component Props](#component-props) • [Use Cases](#why-cicero)

---

</div>

## 📖 What is Cicero?

**Cicero** (named after *Marcus Tullius Cicero*, Roman defender of liberty and confidential correspondence) is the **"RainbowKit / Stripe Elements of Zcash"**.

Building checkout flows on privacy chains has historically been tedious and fragmented: developers have had to manually assemble ZIP-321 URIs, calculate Base64URL encodings for encrypted memos, validate Unified Address receivers (Orchard vs Sapling vs Transparent), and hand-code polling watchers.

**Cicero solves this with a single drop-in React component.**

```tsx
import { CiceroPayButton } from '@cicero-zcash/react';

export function Checkout() {
  return (
    <CiceroPayButton
      recipient="u1qwe829xkps9482mzsll049281kz8471..."
      amount={0.15}
      memo="Order #8921 - Digital Pass"
      onSuccess={({ txId }) => console.log('Payment verified!', txId)}
    />
  );
}
```

---

## ⚡ Core Features

- **🛡️ Native Zero-Knowledge Checkout:** Full support for Orchard and Sapling shielded pools with mathematical sender/recipient confidentiality.
- **✉️ 512-Byte Shielded Encrypted Memos:** Safely attach order numbers, licensing tokens, or private notes directly into the transaction without leaking plaintext to the public ledger.
- **📜 RFC ZIP-321 URI Standard:** Compliant with official Zcash Payment Request URIs, featuring padding-free Base64URL memo encoding.
- **🌐 Unified Address Intelligence (ZIP-316):** Auto-detects receiver types (`u1`, `zs1`, `t1`) and provides warnings if users attempt unshielded transactions.
- **📱 One-Tap Mobile Handoff:** Pre-configured deep links and dynamic QR codes compatible with **Zashi** (Electric Coin Co.) and **Ywallet**.
- **🎨 Supabase Design Language:** Clean, technical aesthetic styled strictly with Supabase tokens (emerald `#3ecf8e` primary CTAs, `#171717` ink typography, 6px button radii, and `#1c1c1c` code blocks).
- **⏱️ Lifecycle State Watcher:** Manages countdowns (15-min invoices), mempool transaction detection, confirmed states, and developer simulation controls for rapid hackathon testing.

---

## 🚀 Quickstart

### 1. Install the package

```bash
pnpm add @cicero-zcash/react
# or
npm install @cicero-zcash/react
# or
yarn add @cicero-zcash/react
```

### 2. Drop into your React or Next.js app

```tsx
import { CiceroPayButton } from '@cicero-zcash/react';

export default function StoreItem() {
  return (
    <div className="card">
      <h3>Premium Research Paper</h3>
      <p>Instant unlock via zero-knowledge settlement</p>
      
      <CiceroPayButton
        recipient="u1qwe829xkps9482mzsll049281kz8471..."
        amount={0.05}
        memo="Unlock Paper #42"
        variant="primary"
        size="md"
        onSuccess={({ txId, amount }) => {
          alert(`Settled on-chain! Tx: ${txId}`);
        }}
      />
    </div>
  );
}
```

---

## 🧩 Component Options

### Modal Button: `<CiceroPayButton />`
A button that triggers the modal dialog containing the ZIP-321 QR code, deep links, address copy tools, and live settlement watcher.

### Inline Card: `<CiceroInvoice />`
An embeddable payment card that renders directly on page—ideal for checkout flows, POS tablets, or invoice dashboards.

### Headless Hook: `useCiceroPayment()`
Full programmatic control over the Zcash payment state machine:

```tsx
import { useCiceroPayment, CiceroQRCode } from '@cicero-zcash/react';

function CustomPaymentUI() {
  const {
    status,
    zip321Uri,
    secondsRemaining,
    addressType,
    isShielded,
    simulateDetection,
  } = useCiceroPayment({
    recipient: 'u1...',
    amount: 0.25,
    memo: 'Invoice #1092',
  });

  return (
    <div>
      <CiceroQRCode value={zip321Uri} size={160} />
      <p>Status: {status}</p>
      <p>Address: {addressType} ({isShielded ? 'Shielded' : 'Transparent'})</p>
      <p>Remaining: {secondsRemaining}s</p>
    </div>
  );
}
```

---

## ⚙️ Component Props Reference

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `recipient` | `string` | **Yes** | Zcash recipient address (Unified `u1`, Sapling `zs1`, or Transparent `t1`) |
| `amount` | `number \| string` | **Yes** | Amount in ZEC (e.g. `0.05`) |
| `memo` | `string` | No | Zero-knowledge encrypted memo (up to 512 bytes on shielded addresses) |
| `message` | `string` | No | Human-readable order note per ZIP-321 |
| `label` | `string` | No | Button label text (defaults to `"Pay with Zcash"`) |
| `variant` | `'primary' \| 'outline' \| 'dark'` | No | Visual style token (defaults to signature emerald primary) |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Button dimension and padding tier |
| `network` | `'mainnet' \| 'testnet'` | No | Target Zcash network (defaults to `'mainnet'`) |
| `showUsd` | `boolean` | No | Displays live estimated USD conversion (defaults to `true`) |
| `invoiceId` | `string` | No | Custom merchant invoice identifier |
| `onSuccess` | `(tx) => void` | No | Callback fired upon on-chain payment confirmation |
| `onStatusChange` | `(status) => void` | No | Callback fired on status transitions (`pending`, `detected`, `confirmed`, `expired`) |

---

## 💡 Real-World Use Cases

1. **Confidential Remote Payroll & Freelance:**  
   Public wallets on Ethereum or Solana leak salary and savings to coworkers and competitors. Cicero allows businesses to pay contractors in shielded ZEC with private invoice IDs in the encrypted memo.
2. **Sub-Cent Creator & Research Micro-Paywalls:**  
   Credit card processing ($0.30 fixed fee) makes $0.10 articles economically impossible. Cicero enables pay-per-read micro-payments with near-zero transaction fees.
3. **Anonymous Whistleblower & Investigative Bounties:**  
   Informants submit encrypted leak verification hashes directly inside the 512-byte memo and receive shielded bounties without leaving an IP or public wallet trail.

---

## 🏗️ Monorepo Structure

```text
cicero/
├── packages/
│   └── cicero/                  # @cicero-zcash/react component library
│       ├── src/
│       │   ├── components/      # CiceroPayButton, CiceroModal, CiceroQRCode, CiceroInvoice
│       │   ├── hooks/           # useCiceroPayment, useZcashPrice
│       │   ├── utils/           # ZIP-321 builder, address validator, deep links
│       │   └── index.ts
│       └── tsup.config.ts
├── apps/
│   └── web/                     # Next.js 15 interactive studio & docs
│       ├── src/
│       │   ├── app/             # App router pages
│       │   └── components/      # PlaygroundStudio, HeroSection, Navbar, DocsSection
│       └── tailwind.config.ts
├── DESIGN.md                    # Supabase design system token specification
├── pnpm-workspace.yaml
└── README.md
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone git@github.com:Kaycee276/cicero.git
cd cicero

# Install dependencies across all packages
pnpm install

# Run the live studio and docs
pnpm dev

# Build both package and web app
pnpm build
```

---

## 📜 License

MIT License © 2026 [Kaycee276](https://github.com/Kaycee276)
