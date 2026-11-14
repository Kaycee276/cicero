---
name: cicero-zcash
description: Expert developer toolkit and implementation guide for @cicero-zcash/react, the universal wallet connection library for shielded Zcash (The RainbowKit of Zcash).
---

# Cicero Zcash Agent Skill

You are an expert developer assistant specialized in building decentralized applications (dApps) on **Zcash** using `@cicero-zcash/react`.

## Overview

`@cicero-zcash/react` is the universal wallet connection suite for shielded Zcash. It provides a drop-in `<CiceroConnectButton />`, prebuilt modals, and React hooks that connect:
- **Zucchini Wallet**: In-browser web extension with 1-click approvals via `@zucchinifi/dapp-sdk`.
- **Zashi & Ywallet**: Mobile & desktop shielded wallets via ZIP-321 QR codes.
- **Viewing Keys**: Read-only auditor mode for accounting, taxes, or proof-of-reserves.
- **Burner Session**: Ephemeral in-memory test wallet for rapid local development.

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CiceroProvider
      initialNetwork="mainnet" // 'mainnet' | 'testnet'
      appName="My Zcash dApp"
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
        size="md"         // 'sm' | 'md' | 'lg'
        radius="md"       // 'none' | 'sm' | 'md' | 'lg' | 'full'
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
  return (
    <CiceroQRCode
      value="zcash:u1exampleaddress?amount=0.5&message=Donation"
      size={180}
    />
  );
}
```

---

## React Hooks Reference

### 1. `useAccount()`
Access the active connection state:

```tsx
import { useAccount } from '@cicero-zcash/react';

function UserStatus() {
  const { isConnected, isConnecting, address, wallet } = useAccount();

  if (isConnecting) return <p>Connecting...</p>;
  if (!isConnected) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <p>Wallet: {wallet?.name}</p>
      <p>Address: {address}</p>
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

### 3. `useCicero()`
Full access to Cicero context state and modal controls:

```tsx
import { useCicero } from '@cicero-zcash/react';

function CustomControls() {
  const {
    network,
    switchNetwork,
    openConnectModal,
    openAccountModal,
    disconnect,
  } = useCicero();

  return (
    <div>
      <button onClick={() => switchNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')}>
        Toggle Network (Current: {network})
      </button>
      <button onClick={openConnectModal}>Open Connect</button>
      <button onClick={openAccountModal}>Open Account</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

---

## Best Practices for Zcash dApps

1. **Address Formats**:
   - Mainnet Unified Addresses: start with `u1...`
   - Testnet Unified Addresses: start with `utest1...`
   - Legacy Transparent Addresses: start with `t1...` (mainnet) or `tm...` (testnet)
   - Viewing Keys: start with `zxviews...` or `uview...`
2. **Network Switching**:
   - When a browser extension like Zucchini is connected, switching network in Cicero checks the extension's active network. If the extension is on Mainnet, switching to Testnet prompts the user to switch networks within the extension for consistency.
3. **Shielded Privacy**:
   - Shielded transactions preserve privacy using Halo 2 zero-knowledge proofs. Never log or transmit viewing keys or spending keys to remote servers.
