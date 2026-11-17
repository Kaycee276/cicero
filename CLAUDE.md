# Cicero &middot; Claude Code Project Memory

> **Context**: This document provides Claude Code and AI agents with the complete architectural memory, history, and development guidelines for the Cicero monorepo.

---

## 🏆 Project Background
- **What is Cicero?** The universal, RainbowKit-style wallet connection and checkout kit for zero-knowledge Zcash (`@cicero-zcash/react`).
- **Hackathon Win**: Cicero took 1st place in the **Zcash Global Hackathon 2024**!
- **Current Published Version**: `@cicero-zcash/react@0.2.10` on public npm.
- **Brand Identity**: Typeset in Google Fonts **Science Gothic** (`wght 100..900`) on deep obsidian `#09090b` canvas with Supabase emerald `#3ecf8e` accents.

---

## 📦 Monorepo Structure
- `packages/cicero`: Core React SDK (`@cicero-zcash/react`). Built with `tsup` and Tailwind CSS into `dist/`.
- `apps/web`: Next.js 15 documentation, interactive component studio, and live zk-paywall showcase. Runs on port 3000.
- `cicero-demo`: Standalone clean test consumer dApp verifying production npm package consumption.

---

## 🛡️ 7 Supported Wallets & Standards
1. **Zucchini Wallet** (In-browser extension via `@zucchinifi/dapp-sdk` with 1-click sidepanel approval)
2. **Noir Wallet** (Self-custodial privacy extension for Orchard & ZECFi with `zcash_requestAccounts` RPC)
3. **Zelcore Wallet** (Multi-asset desktop/extension connecting via `zel:` URI protocol)
4. **Zashi** (Mobile shielded wallet connecting via ZIP-321 QR handoff)
5. **Ywallet** (Mobile & desktop shielded wallet connecting via ZIP-321 QR handoff)
6. **Viewing Keys** (Read-only auditor connection for compliance/accounting via `uview...` or `zxviews...`)
7. **Ephemeral Dev Sessions** (In-memory burner wallet for testnet simulation without external tools)

---

## ⚡ Essential Commands
```bash
# Development
pnpm dev --port 3000         # Runs apps/web dev server
pnpm build                   # Monorepo build

# Package Building & Publishing
cd packages/cicero
pnpm build                   # Compiles tsup bundle + tailwind styles.css -> dist/index.css
npm publish --access public  # Publish new version to npm

# Standalone Consumer Verification
cd ../../cicero-demo
pnpm install                 # Installs latest @cicero-zcash/react
pnpm dev                     # Verifies consumer build
```

---

## 📅 10-Day Milestones Roadmap
1. **Days 1–3**: Live Production Portal & Playground (Deploy to Vercel/Cloudflare, 100% mobile responsiveness, dark mode token parity).
2. **Days 4–6**: Core Decoupling (`@cicero-zcash/core`) (Extract vanilla TypeScript wallet adapters and ZIP-321 builders for Vue, Svelte, React Native).
3. **Days 7–8**: Automated Testing & Error Telemetry (Unit and mock-provider integration tests covering all 7 wallets with 90%+ coverage).
4. **Days 9–10**: Community RFC Announcement (Showcase on Zcash Community Forum; draft `window.zcash` standard Web3 provider specification).

---

## 📜 Full Conversation History
For complete transcripts of previous discussions, decisions, and trajectory logs, see:
- [CONTEXT.md](file:///home/kaycee/Desktop/hackathon/cicero/CONTEXT.md)
- [MILESTONES.md](file:///home/kaycee/Desktop/hackathon/cicero/MILESTONES.md)
