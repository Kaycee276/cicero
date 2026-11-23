'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Bot,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  FileCode,
  Sliders,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AiSkillSection } from '@/components/AiSkillSection';
import { CiceroConnectButton } from '@cicero-zcash/react';

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeInstallTab, setActiveInstallTab] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');

  const copyCode = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const installCommands = {
    pnpm: 'pnpm add @cicero-zcash/react',
    npm: 'npm install @cicero-zcash/react',
    yarn: 'yarn add @cicero-zcash/react',
    bun: 'bun add @cicero-zcash/react',
  };

  interface NavItem {
    id: string;
    label: string;
    highlight?: boolean;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: 'Getting Started',
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'installation', label: 'Installation' },
        { id: 'quickstart', label: 'Quick Start Provider' },
      ],
    },
    {
      title: 'AI Agent Acceleration',
      items: [
        { id: 'ai-agent', label: '🤖 AI Agent Skill & Prompts', highlight: true },
      ],
    },
    {
      title: 'Components API',
      items: [
        { id: 'component-connect-button', label: 'CiceroConnectButton' },
        { id: 'component-qrcode', label: 'CiceroQRCode' },
        { id: 'component-modals', label: 'Programmatic Modals' },
      ],
    },
    {
      title: 'Hooks API',
      items: [
        { id: 'hook-use-account', label: 'useAccount()' },
        { id: 'hook-use-balance', label: 'useBalance()' },
        { id: 'hook-use-cicero', label: 'useCicero()' },
        { id: 'hook-use-zucchini', label: 'useZucchiniWallet()' },
      ],
    },
    {
      title: 'Architecture & Standards',
      items: [
        { id: 'wallets', label: 'Supported Wallets' },
        { id: 'standards', label: 'ZIP-321 & ZIP-316' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-[#3ecf8e]/30 selection:text-white">
      <a href="#docs-content" className="skip-link">
        Skip to documentation
      </a>
      <Navbar />

      {/* Docs Header Banner */}
      <div className="border-b border-zinc-800/80 bg-[#0c0c0f] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-400 font-semibold">Docs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Cicero Developer Documentation
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              The universal wallet connection toolkit for shielded Zcash. Drop-in React components, real-time balance polling, and AI agent skills for high-speed dApp development.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a
              href="#ai-agent"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 text-zinc-950 font-semibold text-xs hover:bg-emerald-300 transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Install AI Skill</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@cicero-zcash/react"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-white transition-colors shadow-sm font-mono"
            >
              <span>NPM v0.2.10</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Docs Body: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Sticky Sidebar (3 cols on desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 text-xs max-h-[calc(100vh-8rem)] overflow-y-auto pr-3">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <span className="font-mono text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {sec.title}
                </span>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                          item.highlight
                            ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Right Main Content (9 cols) */}
          <main id="docs-content" className="lg:col-span-9 space-y-16 max-w-4xl" tabIndex={-1}>
            
            {/* 1. Overview */}
            <section id="overview" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Overview
                </h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Cicero is the developer payment and wallet connection kit for shielded Zcash apps. Designed with the familiar ergonomics of RainbowKit, it abstracts the complexities of Zcash browser extension APIs, mobile QR handoffs, zero-knowledge unified addresses, and real-time balance queries into simple React hooks and components.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#0e0e12] space-y-1">
                  <span className="font-semibold text-xs text-white">One Button Integration</span>
                  <p className="text-[11px] text-zinc-400">Drop &lt;CiceroConnectButton /&gt; into your navigation bar for instant wallet connectivity.</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#0e0e12] space-y-1">
                  <span className="font-semibold text-xs text-white">Zero-Knowledge Shielded</span>
                  <p className="text-[11px] text-zinc-400">Supports Orchard and Sapling shielded pools, unified addresses (ZIP-316), and encrypted memos.</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#0e0e12] space-y-1">
                  <span className="font-semibold text-xs text-white">RainbowKit Experience</span>
                  <p className="text-[11px] text-zinc-400">Modal drawer with live balance display, network switching indicator, and address copy.</p>
                </div>
              </div>
            </section>

            {/* 2. Installation */}
            <section id="installation" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Installation
                </h2>
                <span className="text-xs font-mono text-emerald-400">v0.2.10 (Latest)</span>
              </div>
              <p className="text-sm text-zinc-400">
                Install the package using your favorite package manager:
              </p>

              {/* Package Manager Tabs */}
              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <div className="flex items-center justify-between px-3 py-2 bg-[#141418] border-b border-zinc-800/80">
                  <div className="flex items-center gap-1.5">
                    {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setActiveInstallTab(pm)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          activeInstallTab === pm
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => copyCode(installCommands[activeInstallTab], 'install')}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedId === 'install' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-3.5 font-mono text-xs text-emerald-400 bg-[#09090b]">
                  <span>$ {installCommands[activeInstallTab]}</span>
                </div>
              </div>
            </section>

            {/* 3. Quickstart Provider */}
            <section id="quickstart" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Quick Start: Provider Setup
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Wrap your client component tree in <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs font-mono text-white">CiceroProvider</code>. This establishes the React context for wallet discovery, balance polling, and modal state.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141418] border-b border-zinc-800/80">
                  <span className="text-xs font-mono text-zinc-400">app/providers.tsx</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        `'use client';\n\nimport { CiceroProvider } from '@cicero-zcash/react';\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    <CiceroProvider initialNetwork="mainnet" appName="My Zcash dApp">\n      {children}\n    </CiceroProvider>\n  );\n}`,
                        'provider-code'
                      )
                    }
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedId === 'provider-code' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`'use client';

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
}`}
                </pre>
              </div>
            </section>

            {/* 4. AI AGENT SKILL & PROMPTS SECTION */}
            <section id="ai-agent" className="space-y-4 scroll-mt-24 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/80">
                <Bot className="w-5 h-5 text-emerald-400" />
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  AI Agent Skill & Developer Prompts
                </h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Build 10x faster by giving your AI coding assistant (Cursor, Claude Code, Windsurf, Antigravity, Copilot, ChatGPT) the exact Cicero mental model. Never deal with hallucinations or outdated API calls.
              </p>

              {/* Interactive AI Skill Component */}
              <AiSkillSection />
            </section>

            {/* 5. Component: CiceroConnectButton */}
            <section id="component-connect-button" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Component: CiceroConnectButton
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The primary UI component. When disconnected, it displays a connect trigger. When connected, it transforms into an interactive pill showing active network, shielded balance, and a truncated address.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141418] border-b border-zinc-800/80">
                  <span className="text-xs font-mono text-zinc-400">Header.tsx</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        `import { CiceroConnectButton } from '@cicero-zcash/react';\n\nexport function Header() {\n  return (\n    <header className="flex justify-between items-center p-4 border-b">\n      <h1 className="font-semibold">My Zcash Store</h1>\n      <CiceroConnectButton\n        variant="primary"\n        size="md"\n        radius="md"\n        label="Connect Zcash Wallet"\n        showBalance={true}\n        showNetwork={true}\n        showIcon={true}\n      />\n    </header>\n  );\n}`,
                        'btn-example'
                      )
                    }
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedId === 'btn-example' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { CiceroConnectButton } from '@cicero-zcash/react';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-zinc-800">
      <h1 className="font-semibold text-white">My Zcash Store</h1>
      <CiceroConnectButton
        variant="primary"       // 'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'
        size="md"              // 'sm' | 'md' | 'lg'
        radius="md"            // 'none' | 'sm' | 'md' | 'lg' | 'full'
        label="Connect Zcash"  // Custom disconnected button text
        showBalance={true}     // Displays balance pill when connected
        showNetwork={true}     // Displays active network pill (mainnet/testnet)
        showIcon={true}        // Displays shielded icon
        accentColor="#3ecf8e" // Carries through to the wallet dialogs
      />
    </header>
  );
}`}
                </pre>
              </div>

              {/* Props Table */}
              <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800/80 bg-[#0e0e12]">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-[#141418] border-b border-zinc-800/80 font-mono text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3">Prop</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Default</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">variant</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'primary'</td>
                      <td className="py-2.5 px-3 text-zinc-400">Button visual appearance token.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">size</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'sm' | 'md' | 'lg'</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'md'</td>
                      <td className="py-2.5 px-3 text-zinc-400">Padding and typography tier.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">radius</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'none' | 'sm' | 'md' | 'lg' | 'full'</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'md'</td>
                      <td className="py-2.5 px-3 text-zinc-400">Corner border-radius token.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">label</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">string</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">'Connect Zcash Wallet'</td>
                      <td className="py-2.5 px-3 text-zinc-400">Disconnected state text.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">showBalance</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">boolean</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">true</td>
                      <td className="py-2.5 px-3 text-zinc-400">Renders shielded ZEC balance in connected pill.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">showNetwork</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">boolean</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">true</td>
                      <td className="py-2.5 px-3 text-zinc-400">Renders mainnet/testnet status indicator.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">showIcon</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">boolean</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">true</td>
                      <td className="py-2.5 px-3 text-zinc-400">Shows the wallet icon in the button and dialogs.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">accentColor</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">string</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">Variant default</td>
                      <td className="py-2.5 px-3 text-zinc-400">Hex color shared by the connected pill and wallet dialogs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Component: CiceroQRCode */}
            <section id="component-qrcode" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Component: CiceroQRCode
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A hardened SVG QR code component optimized for high-density ZIP-321 payment request URIs and unified addresses. Includes error correction level 'M'.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { CiceroQRCode } from '@cicero-zcash/react';

// ZIP-321 Payment URI with amount and encrypted memo
const zip321Uri = "zcash:u1testaddress...?amount=1.25&message=Order%20%234912";

export function PaymentBox() {
  return (
    <div className="p-4 bg-white rounded-lg border inline-block">
      <CiceroQRCode value={zip321Uri} size={180} />
    </div>
  );
}`}
                </pre>
              </div>
            </section>

            {/* 7. Hooks API */}
            <section id="hook-use-account" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Hook: useAccount()
              </h2>
              <p className="text-sm text-zinc-400">
                Provides access to current connection status, connected shielded address, and active wallet metadata.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { useAccount } from '@cicero-zcash/react';

export function ProfileWidget() {
  const { isConnected, isConnecting, address, wallet } = useAccount();

  if (isConnecting) return <span>Authorizing wallet...</span>;
  if (!isConnected) return <span>Not connected</span>;

  return (
    <div>
      <p>Wallet: {wallet?.name} ({wallet?.category})</p>
      <p>Address: {address}</p>
    </div>
  );
}`}
                </pre>
              </div>
            </section>

            {/* Hook: useBalance */}
            <section id="hook-use-balance" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Hook: useBalance()
              </h2>
              <p className="text-sm text-zinc-400">
                Queries shielded balance in ZEC, computes fiat USD estimates, tracks loading state, and exposes manual refetch.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { useBalance } from '@cicero-zcash/react';

export function WalletBalance() {
  const { zec, usd, isLoading, refetch } = useBalance();

  return (
    <div className="flex items-center gap-3">
      <span>{isLoading ? 'Syncing...' : \`\${zec} ZEC\`}</span>
      {usd && <span className="text-zinc-500">(≈ $\${usd} USD)</span>}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}`}
                </pre>
              </div>
            </section>

            {/* Hook: useCicero */}
            <section id="hook-use-cicero" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Hook: useCicero()
              </h2>
              <p className="text-sm text-zinc-400">
                Exposes the master Cicero context: network switching between Mainnet and Testnet, modal triggers, and disconnect controls.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { useCicero } from '@cicero-zcash/react';

export function NetworkSwitch() {
  const { network, switchNetwork, openConnectModal, disconnect } = useCicero();

  return (
    <div>
      <p>Current Network: {network}</p>
      <button onClick={() => switchNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')}>
        Switch to {network === 'mainnet' ? 'Testnet' : 'Mainnet'}
      </button>
      <button onClick={openConnectModal}>Open Wallet List</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}`}
                </pre>
              </div>
            </section>

            {/* Hook: useZucchiniWallet */}
            <section id="hook-use-zucchini" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Hook: useZucchiniWallet()
              </h2>
              <p className="text-sm text-zinc-400">
                Direct interface to the Zucchini web browser extension via <code className="text-xs font-mono text-emerald-400">@zucchinifi/dapp-sdk</code>. Auto-detects extension presence and listens for unlock events.
              </p>

              <div className="rounded-xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden text-white shadow-xl">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-[#09090b]">
{`import { useZucchiniWallet } from '@cicero-zcash/react';

export function ExtensionCard() {
  const { isAvailable, isConnected, connect, address } = useZucchiniWallet();

  if (!isAvailable) {
    return <a href="https://chromewebstore.google.com">Install Zucchini Extension</a>;
  }

  if (!isConnected) {
    return <button onClick={() => connect()}>Connect Zucchini</button>;
  }

  return <div>Connected: {address}</div>;
}`}
                </pre>
              </div>
            </section>

            {/* 8. Supported Wallets Matrix */}
            <section id="wallets" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Supported Wallets Architecture
              </h2>
              <p className="text-sm text-zinc-400">
                Web browsers enforce strict sandbox security preventing websites from querying arbitrary local OS processes. Cicero supports both in-browser injected extensions and zero-knowledge QR handoffs for mobile wallets:
              </p>

              <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-[#0e0e12]">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-[#141418] border-b border-zinc-800/80 font-mono text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3">Wallet</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Connection Type</th>
                      <th className="py-2.5 px-3">Shielded Pool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">🥒 Zucchini Wallet</td>
                      <td className="py-2.5 px-3 text-zinc-400">Browser Extension</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">1-Click Sidepanel Approval</td>
                      <td className="py-2.5 px-3">Mainnet & Testnet (Orchard & Sapling)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">🖤 Noir Wallet</td>
                      <td className="py-2.5 px-3 text-zinc-400">Browser Extension</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">1-Click In-Browser Popup</td>
                      <td className="py-2.5 px-3">Mainnet & Testnet (Shielded & ZECFi)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">🔷 Zelcore</td>
                      <td className="py-2.5 px-3 text-zinc-400">Multi-Asset Extension</td>
                      <td className="py-2.5 px-3 font-mono text-amber-400">Address Input (No ZEC dApp RPC)</td>
                      <td className="py-2.5 px-3">Mainnet Only (Transparent t1)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">🛡️ Zashi</td>
                      <td className="py-2.5 px-3 text-zinc-400">Mobile (ECC)</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">ZIP-321 QR Scan</td>
                      <td className="py-2.5 px-3">Mainnet (Orchard & Sapling)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">📱 Ywallet</td>
                      <td className="py-2.5 px-3 text-zinc-400">Mobile & Desktop</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">ZIP-321 QR Scan</td>
                      <td className="py-2.5 px-3">Mainnet & Testnet (Orchard & Sapling)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">👁️ Viewing Key</td>
                      <td className="py-2.5 px-3 text-zinc-400">Auditor / Read-Only</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">Unified Viewing Key (uview...)</td>
                      <td className="py-2.5 px-3">Shielded Decryption</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">🔥 Burner Dev Session</td>
                      <td className="py-2.5 px-3 text-zinc-400">Local Development</td>
                      <td className="py-2.5 px-3 font-mono text-amber-400">Ephemeral In-Memory Testnet</td>
                      <td className="py-2.5 px-3">Testnet Orchard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 9. Standards */}
            <section id="standards" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-zinc-800/80">
                Zcash Standards: ZIP-321 & ZIP-316
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#0e0e12] space-y-2">
                  <span className="font-semibold text-xs text-white">ZIP-321: Payment Request URIs</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Standardizes payment URIs for Zcash (<code className="font-mono text-emerald-400">zcash:&lt;address&gt;?amount=&lt;val&gt;&message=&lt;memo&gt;</code>). Enables mobile and desktop wallets to auto-fill recipients, exact amounts, and encrypted memos.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#0e0e12] space-y-2">
                  <span className="font-semibold text-xs text-white">ZIP-316: Unified Addresses</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Combines multiple receiver types (Orchard, Sapling, and Transparent) into a single address starting with <code className="font-mono text-emerald-400">u1</code> (mainnet) or <code className="font-mono text-emerald-400">utest1</code> (testnet) to prevent cross-pool confusion.
                  </p>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
