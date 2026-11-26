# 🛡️ Cicero: The Universal Wallet & Payment Toolkit for Shielded Zcash (Hackathon Showcase & RFC: Standardizing `window.zcash`)

> **Forum Category:** Community Projects / Ecosystem Proposals  
> **Author:** Kaycee ([@Kaycee276](https://github.com/Kaycee276))  
> **Repository:** [github.com/Kaycee276/cicero](https://github.com/Kaycee276/cicero)  
> **NPM Packages:** [`@cicero-zcash/core`](https://www.npmjs.com/package/@cicero-zcash/core) • [`@cicero-zcash/react`](https://www.npmjs.com/package/@cicero-zcash/react)  
> **Live Production Portal:** [cicero.izuaba.xyz](https://cicero.izuaba.xyz) (deployed & verified with live playground and studio)

---

Hey Zcash Community! 👋

Following our **1st Place win at the Zcash Global Hackathon 2024**, we have been hard at work turning **Cicero** from a hackathon prototype into a hardened, production-grade developer toolkit for the entire Zcash ecosystem.

Today, we're thrilled to share our latest milestone release — including our **monorepo core decoupling**, **100% test matrix**, **NPM publications**, and a community proposal: **RFC 0001: Standardizing the In-Browser Zcash Web3 Provider (`window.zcash`)**.

---

## 🏛️ What is Cicero?

If RainbowKit and wagmi made Web3 adoption seamless for Ethereum, **Cicero is built to do the same for Shielded Zcash**.

Building privacy-preserving dApps on Zcash has historically been hindered by ecosystem fragmentation: each wallet (Zucchini, Zashi, YWallet, Zelcore, Noir) has its own connection mechanism, deep-link format, or custom browser global. dApp developers were forced to reinvent wallet connection logic, QR encoding, and balance polling from scratch.

Cicero solves this by providing:

1. **Drop-in React Checkout & Modal**: `<CiceroConnectButton />`, `<CiceroConnectModal />`, `<CiceroQRCode />`, and stateful hooks (`useAccount`, `useBalance`, `useZcashPrice`).
2. **7 Supported Wallet Connection Mechanisms**:
   - 🥒 **Zucchini**: Direct in-browser extension detection and 1-click connection.
   - 📱 **Zashi**: Mobile deep linking & instant QR handoff.
   - 🛡️ **YWallet**: Multi-platform deep linking with shielded balance synchronization.
   - ⚡ **Noir & Zelcore**: Protocol linking and mobile handoff.
   - 🔑 **Viewing Key Mode**: Audit-only connection for DAOs and treasuries.
   - 🧪 **Burner Developer Sessions**: Instant mock-wallet sandbox for testing.
3. **Bi-Directional Network Sync**: Automatically synchronizes Mainnet vs Testnet across wallet address prefixes and extension state.
4. **ZIP-321 Payment Requests**: First-class URI synthesis, Base64URL memo encoding, and UTF-8 protocol limit (512 bytes) validation.

---

## 📦 What We Built in This Milestone

We completed our production-hardening milestone in verifiable, atomic steps:

### 1. Framework-Agnostic Core Decoupling (`@cicero-zcash/core`)

We extracted the wallet adapters, ZIP-321 utilities, address validators, and event registry into a standalone vanilla TypeScript package:

- **Zero React dependencies**: Now consumable in **Vue, Svelte, Angular, React Native, or Node.js**.
- Published on NPM: `📦 @cicero-zcash/core@0.1.0` ([npmjs.com/package/@cicero-zcash/core](https://www.npmjs.com/package/@cicero-zcash/core))
- React wrapper updated and published: `📦 @cicero-zcash/react@0.2.11` ([npmjs.com/package/@cicero-zcash/react](https://www.npmjs.com/package/@cicero-zcash/react))

### 2. Comprehensive Test Suite & Continuous Integration

- **24 test suites & 118 unit/component tests** (100% green) covering all adapters, address algorithms, React components, and Next.js endpoints.
- Custom automated **secret scanner** preventing leaked tokens.
- Strict workspace linting, Prettier formatting verification, and production build checks.
- Local `.githooks/pre-commit` and GitHub Actions CI passing on every commit.

---

## 📜 RFC 0001: Standardizing `window.zcash`

As part of this milestone, we authored a formal community specification:
👉 **[Read the Full RFC 0001 Document on GitHub](https://github.com/Kaycee276/cicero/blob/main/rfcs/0001-window-zcash-provider.md)**

### Why Do We Need This?

Ethereum has **EIP-1193** (`window.ethereum`) and Solana has the **Wallet Standard** (`window.solana`). Zcash currently lacks a unified in-browser standard.

When a user visits a Web3 application on Zcash, there should be a standardized JSON-RPC provider object living at **`window.zcash`**.

### Proposed Core RPC Methods:

- `zcash_requestAccounts`: Connects the dApp and requests authorized Unified/Sapling/Transparent addresses.
- `zcash_accounts`: Returns currently connected addresses without prompting.
- `zcash_sendTransaction`: Constructs, proves, and submits a ZIP-321 payment request.
- `zcash_getBalance`: Queries balance by pool (Shielded Orchard/Sapling vs Transparent).
- `zcash_signMessage`: Authenticates messages with cryptographic proof (Sign-In with Zcash).
- `zcash_getNetwork` / `zcash_switchNetwork`: Detects and transitions between Mainnet and Testnet.

### Standard Events:

- `accountsChanged` (`accounts: string[]`)
- `networkChanged` (`network: 'mainnet' | 'testnet'`)
- `connect` & `disconnect`

---

## 💬 Call for Community Feedback & Next Steps

We want to collaborate with wallet developers, ECC engineers, Zcash Foundation team members, and dApp builders:

1. **For Wallet Developers (@zcash @electriccoinco @ywallet @zucchini)**:
   - Does this proposed `window.zcash` RPC structure fit your extension roadmap?
   - What additional methods (e.g. proof generation hooks, viewing key permission scopes) would you like to see?
2. **For dApp Builders**:
   - Try integrating `@cicero-zcash/react` or `@cicero-zcash/core` in your project and let us know what features you need next!

### 🔗 Quick Links

- **Live Production Portal**: [cicero.izuaba.xyz](https://cicero.izuaba.xyz)
- **GitHub Repository**: [github.com/Kaycee276/cicero](https://github.com/Kaycee276/cicero)
- **RFC 0001 Draft**: [rfcs/0001-window-zcash-provider.md](https://github.com/Kaycee276/cicero/blob/main/rfcs/0001-window-zcash-provider.md)
- **NPM Core**: `npm install @cicero-zcash/core`
- **NPM React**: `npm install @cicero-zcash/react`

Looking forward to hearing your thoughts and building the future of shielded Web3 together! 🛡️⚡
