---
name: cicero-zcash
description: Expert developer toolkit and implementation guide for @cicero-zcash/react, the universal wallet connection library for shielded Zcash (The RainbowKit of Zcash).
---

# Cicero Zcash Agent Skill

You are an expert developer assistant specialized in building decentralized applications (dApps) on **Zcash** using `@cicero-zcash/react`.

## Overview

`@cicero-zcash/react` is the universal wallet connection suite for shielded Zcash. It provides a drop-in `<CiceroConnectButton />`, prebuilt modals, and React hooks that connect:

- **Zucchini Wallet**: In-browser privacy extension with 1-click approvals via `@zucchinifi/dapp-sdk`.
- **Noir Wallet**: Self-custodial privacy extension for shielded Zcash & ZECFi with native in-browser JSON-RPC (`zcash_requestAccounts`, `zcash_getBalance`).
- **Zelcore Wallet**: Multi-asset browser extension & desktop wallet with 1-click transparent ZEC binding and `zel:?action=pay` protocol deep linking.
- **Zashi & Ywallet**: Mobile & desktop shielded wallets via ZIP-321 QR codes.
- **Viewing Keys**: Read-only auditor mode for accounting, taxes, or proof-of-reserves (`uview...`, `zxviews...`).
- **Dev Sessions**: Ephemeral in-memory testnet wallet for rapid local development without requiring external extensions.

---

## Installation

```bash
npm install @cicero-zcash/react
# or
pnpm add @cicero-zcash/react
# or
yarn add @cicero-zcash/react
```

---

## Core Architecture & Provider Setup

Wrap your application in `CiceroProvider`:

```tsx
'use client';

import React from 'react';
import { CiceroProvider } from '@cicero-zcash/react';
import '@cicero-zcash/react/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CiceroProvider
      initialNetwork="mainnet" // 'mainnet' | 'testnet'
      appName="My Zcash dApp"
      autoConnect={true}
    >
      {children}
    </CiceroProvider>
  );
}
```

---

## Key Components

### 1. `CiceroConnectButton`

Drop-in connected/disconnected button pill with customizable styling:

```tsx
import { CiceroConnectButton } from '@cicero-zcash/react';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <CiceroConnectButton
        variant="primary" // 'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'
        size="md" // 'sm' | 'md' | 'lg'
        radius="md" // 'none' | 'sm' | 'md' | 'lg' | 'full'
        label="Connect Zcash Wallet"
        showBalance={true}
        showNetwork={true}
        showIcon={true}
      />
    </header>
  );
}
```

### 2. `CiceroQRCode`

Render zero-knowledge payment requests and connection handoffs:

```tsx
import { CiceroQRCode } from '@cicero-zcash/react';

export function DonationQR() {
  return <CiceroQRCode value="zcash:u1exampleaddress?amount=0.5&message=Donation" size={180} />;
}
```

---

## React Hooks Reference

### 1. `useAccount()`

Access the active connection state:

```tsx
import { useAccount } from '@cicero-zcash/react';

function UserStatus() {
  const { isConnected, isConnecting, address, wallet, disconnect } = useAccount();

  if (isConnecting) return <p>Connecting...</p>;
  if (!isConnected) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <p>Wallet: {wallet?.name}</p>
      <p>Address: {address}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

### 2. `useBalance()`

Query real-time shielded ZEC balance and USD estimate:

```tsx
import { useBalance } from '@cicero-zcash/react';

function BalanceDisplay() {
  const { zec, usd, isLoading, refetch } = useBalance();

  return (
    <div>
      <span>{isLoading ? '...' : zec} ZEC</span>
      {usd && <span> (≈ ${usd} USD)</span>}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### 3. `useCicero()` & `sendPayment()`

Full access to Cicero context state, modal triggers, and cross-wallet payment dispatch:

```tsx
import { useCicero } from '@cicero-zcash/react';

function PaymentAction() {
  const { network, switchNetwork, openConnectModal, openAccountModal, sendPayment, disconnect } =
    useCicero();

  const handlePay = async () => {
    // Automatically routes across Extension RPC, Zelcore URI, or ZIP-321
    const result = await sendPayment({
      recipient: 'u1exampleaddress...',
      amount: 0.1,
      memo: 'Order #1042',
    });
    console.log('Payment dispatched:', result);
  };

  return (
    <div>
      <button onClick={handlePay}>Send 0.1 ZEC</button>
      <button onClick={openConnectModal}>Open Wallet List</button>
      <button onClick={() => switchNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')}>
        Network: {network}
      </button>
    </div>
  );
}
```

---

## Supported Wallets Matrix

| Wallet           | Type                | Protocol / Method                     | Network           |
| :--------------- | :------------------ | :------------------------------------ | :---------------- |
| **Zucchini**     | Browser Extension   | Injected SDK (`@zucchinifi/dapp-sdk`) | Mainnet & Testnet |
| **Noir Wallet**  | Browser Extension   | Direct RPC (`zcash_requestAccounts`)  | Mainnet & Testnet |
| **Zelcore**      | Extension & Desktop | Address-bound / `zel:?action=pay` URI | Mainnet           |
| **Zashi**        | Mobile (ECC)        | ZIP-321 QR Handoff                    | Mainnet & Testnet |
| **Ywallet**      | Mobile & Desktop    | ZIP-321 QR Handoff                    | Mainnet & Testnet |
| **Viewing Keys** | Read-Only           | Unified / Sapling viewing keys        | Mainnet & Testnet |
| **Dev Session**  | In-Memory Session   | Ephemeral testnet wallet              | Testnet           |

---

## Best Practices for Zcash dApps

1. **Address Formats**:
   - Mainnet Unified Addresses: start with `u1...`
   - Testnet Unified Addresses: start with `utest1...`
   - Legacy Transparent Addresses: start with `t1...` (mainnet) or `tm...` (testnet)
   - Viewing Keys: start with `zxviews...` or `uview...`
2. **Network Switching**:
   - When an extension is connected (e.g. Zucchini or Noir), Cicero automatically synchronizes the network with the wallet's detected address prefix or RPC settings.
3. **Shielded Privacy**:
   - Shielded transactions preserve privacy using Halo 2 zero-knowledge proofs. Never log or transmit viewing keys or spending keys to remote servers.
