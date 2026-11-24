<div align="center">

# 🛡️ Cicero

### The RainbowKit for Shielded Zcash

**Universal wallet connection, bi-directional network synchronization, and multi-wallet state management for React and Next.js applications.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3ecf8e.svg)](https://opensource.org/licenses/MIT)
[![NPM Core](https://img.shields.io/npm/v/@cicero-zcash/core?color=3ecf8e&label=@cicero-zcash/core)](https://www.npmjs.com/package/@cicero-zcash/core)
[![NPM React](https://img.shields.io/npm/v/@cicero-zcash/react?color=3ecf8e&label=@cicero-zcash/react)](https://www.npmjs.com/package/@cicero-zcash/react)
[![Zcash](https://img.shields.io/badge/Zcash-Shielded-171717?logo=zcash&logoColor=3ecf8e)](https://z.cash)
[![Design](https://img.shields.io/badge/Design-Supabase%20Tokens-3ecf8e)](./DESIGN.md)
[![RFC 0001](https://img.shields.io/badge/RFC-0001%20window.zcash-3ecf8e)](./rfcs/0001-window-zcash-provider.md)

[Live Demo](https://cicero-zcash.vercel.app) • [RFC: window.zcash](./rfcs/0001-window-zcash-provider.md) • [Forum Proposal](./COMMUNITY-FORUM-POST.md) • [Quickstart](#-quickstart) • [React Hooks](#-react-hooks) • [Supported Wallets](#-supported-wallets)

---

</div>

## 📖 What is Cicero?

**Cicero** is the **"RainbowKit of Zcash"**. It provides a drop-in, zero-knowledge native wallet connection suite:

- 🥒 **Zucchini Chrome Extension:** 1-click in-browser connection and shielded account detection.
- 📱 **Mobile & Desktop Wallets:** Zashi (Electric Coin Co.) and Ywallet QR handoff.
- 🔑 **Viewing Key Mode:** Audit and read-only treasury dashboard connection.
- 🔄 **Bi-Directional Network Sync:** Automatically detects Mainnet vs Testnet from wallet address prefixes and listens to extension network change events.
- 💰 **Per-Network Balance Segregation:** Independent balance caching for Mainnet and Testnet with live USD conversion.

```tsx
import { CiceroProvider, CiceroConnectButton, useAccount, useBalance } from '@cicero-zcash/react';

export default function App() {
  return (
    <CiceroProvider initialNetwork="mainnet">
      <nav className="flex justify-between p-4 border-b">
        <span>My Zcash dApp</span>
        <CiceroConnectButton variant="primary" size="md" />
      </nav>
      <Dashboard />
    </CiceroProvider>
  );
}

function Dashboard() {
  const { address, isConnected, wallet } = useAccount();
  const { zec, usd } = useBalance();

  if (!isConnected) return <p>Please connect your Zcash wallet.</p>;

  return (
    <div>
      <p>Connected to {wallet?.name}</p>
      <p>Address: {address}</p>
      <p>
        Balance: {zec} ZEC (~${usd} USD)
      </p>
    </div>
  );
}
```

---

## ⚡ Features

- **🛡️ Shielded-First Architecture:** Built specifically for Zcash's Unified Address standard (ZIP-316), Sapling (`zs1`), and Transparent (`t1`) pools.
- **🔄 Live Network & Chain Synchronization:** Listens to wallet extension events (`networkChanged`, `accountsChanged`). Switching between Mainnet and Testnet inside Zucchini immediately updates Cicero and queries the new balance.
- **💼 RainbowKit-Style Connected Pill:** Displays active network indicator (green/amber dot), current ZEC balance, and truncated address. Clicking opens an account drawer with address copying, QR code receive view, and network switch assistance.
- **🎨 Supabase Design Language:** Styled with Supabase tokens (`#3ecf8e` emerald accents, `#171717` ink typography, 6px button radii, clean border tokens).
- **🪙 Live Fiat Conversions:** `useZcashPrice()` hook provides cached, rate-limited ZEC/USD pricing with automatic fallback.

---

## 🚀 Quickstart

### 1. Install

```bash
pnpm add @cicero-zcash/react
# or
npm install @cicero-zcash/react
# or
yarn add @cicero-zcash/react
```

### 2. Wrap your app in `<CiceroProvider>`

```tsx
import { CiceroProvider } from '@cicero-zcash/react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CiceroProvider initialNetwork="mainnet" appName="My Zcash dApp">
      {children}
    </CiceroProvider>
  );
}
```

### 3. Add the `<CiceroConnectButton />`

```tsx
import { CiceroConnectButton } from '@cicero-zcash/react';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Zcash Portal</h1>
      <CiceroConnectButton variant="primary" size="md" />
    </header>
  );
}
```

---

## 🪝 React Hooks

Cicero exports familiar, ergonomic hooks modeled after RainbowKit and wagmi:

### `useAccount()`

```tsx
const {
  address, // string | null - Active shielded or transparent address
  isConnected, // boolean - Whether a wallet is connected
  isConnecting, // boolean - True during connection handshake
  wallet, // ZcashWallet | null - Active wallet adapter metadata
  disconnect, // () => Promise<void> - Disconnect handler
} = useAccount();
```

### `useBalance()`

```tsx
const {
  zec, // number - Shielded balance in ZEC
  usd, // string | null - Estimated USD equivalent
  isLoading, // boolean - True when querying balance
  refetch, // () => Promise<void> - Re-queries balance from wallet/RPC
} = useBalance();
```

### `useCicero()`

Full context access including network state, modal controls, and raw wallet methods:

```tsx
const {
  account,
  network, // 'mainnet' | 'testnet'
  switchNetwork, // (net: 'mainnet' | 'testnet') => Promise<SwitchResult>
  openConnectModal,
  closeConnectModal,
  openAccountModal,
  closeAccountModal,
} = useCicero();
```

---

## 🔌 Supported Wallets

| Wallet            | Type                 | Support           | Features                                             |
| ----------------- | -------------------- | ----------------- | ---------------------------------------------------- |
| **Zucchini**      | Chrome Extension     | Direct in-browser | 1-click connect, live network sync, shielded balance |
| **Zashi**         | Mobile (iOS/Android) | QR Handoff        | Electric Coin Co. official wallet                    |
| **Ywallet**       | Desktop & Mobile     | QR Handoff        | Multi-platform shielded wallet                       |
| **Viewing Key**   | Read-Only            | Manual Input      | Auditor compliance, treasury dashboards              |
| **Burner Wallet** | Dev / Sandbox        | Ephemeral         | Instant testing in development                       |

---

## 🏗️ Repository Architecture

```text
cicero/
├── apps/
│   └── web/                     # Interactive Next.js documentation & studio
├── packages/
│   └── cicero/                  # Core @cicero-zcash/react npm package
│       ├── src/
│       │   ├── components/      # CiceroConnectButton, CiceroConnectModal, CiceroAccountModal
│       │   ├── context/         # CiceroContext, useAccount, useBalance
│       │   ├── hooks/           # useZcashPrice, useZucchiniWallet
│       │   ├── wallet/          # ZucchiniWalletAdapter
│       │   ├── wallets/         # Zucchini, Zashi, Ywallet, ViewingKey, Burner connectors
│       │   └── utils/           # ZIP-316 unified address validation, ZIP-321
│       └── tsup.config.ts       # ESM/CJS dual-build & DTS bundle
└── pnpm-workspace.yaml
```

---

## 📄 License

MIT © [Kaycee276](https://github.com/Kaycee276)
