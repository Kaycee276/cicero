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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-[#171717] dark:text-[#ededed] transition-colors duration-200">
      <Navbar />

      {/* Docs Header Banner */}
      <div className="border-b border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#151515] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#707070] dark:text-[#a1a1aa]">
              <Link href="/" className="hover:text-[#171717] dark:hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-[#3ecf8e] font-semibold">Docs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717] dark:text-white">
              Cicero Developer Documentation
            </h1>
            <p className="text-sm sm:text-base text-[#707070] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
              The universal wallet connection toolkit for shielded Zcash. Drop-in React components, real-time balance polling, and AI agent skills for high-speed dApp development.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <a
              href="#ai-agent"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#3ecf8e] text-[#171717] font-semibold text-xs hover:bg-[#24b47e] transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Install AI Skill</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@cicero-zcash/react"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] bg-white dark:bg-[#1e1e1e] border border-[#dfdfdf] dark:border-[#333] text-xs font-medium text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors shadow-sm"
            >
              <span>NPM v0.2.1</span>
              <ExternalLink className="w-3 h-3 text-[#707070] dark:text-[#a1a1aa]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Docs Body: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Sticky Sidebar (3 cols on desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 text-xs max-h-[calc(100vh-8rem)] overflow-y-auto pr-3">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <span className="font-mono text-[11px] font-semibold text-[#707070] dark:text-[#71717a] uppercase tracking-wider">
                  {sec.title}
                </span>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block py-1.5 px-2 rounded-[4px] transition-colors ${
                          item.highlight
                            ? 'text-[#24b47e] dark:text-[#3ecf8e] font-semibold bg-[#3ecf8e]/10 border border-[#3ecf8e]/20'
                            : 'text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]'
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
          <main className="lg:col-span-9 space-y-16 max-w-4xl">
            
            {/* 1. Overview */}
            <section id="overview" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]"></div>
                <h2 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-white">
                  Overview
                </h2>
              </div>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                Cicero is the developer payment and wallet connection kit for shielded Zcash apps. Designed with the familiar developer ergonomics of RainbowKit, it abstracts the complexities of Zcash browser extension APIs, mobile QR handoffs, zero-knowledge unified addresses, and real-time balance queries into simple React hooks and components.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-[8px] border border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#181818] space-y-1">
                  <span className="font-semibold text-xs text-[#171717] dark:text-white">One Button Integration</span>
                  <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">Drop &lt;CiceroConnectButton /&gt; into your navigation bar for instant wallet connectivity.</p>
                </div>
                <div className="p-4 rounded-[8px] border border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#181818] space-y-1">
                  <span className="font-semibold text-xs text-[#171717] dark:text-white">Zero-Knowledge Shielded</span>
                  <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">Supports Orchard and Sapling shielded pools, unified addresses (ZIP-316), and encrypted memos.</p>
                </div>
                <div className="p-4 rounded-[8px] border border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#181818] space-y-1">
                  <span className="font-semibold text-xs text-[#171717] dark:text-white">RainbowKit Experience</span>
                  <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">Modal drawer with live balance display, network switching indicator, and address copy.</p>
                </div>
              </div>
            </section>

            {/* 2. Installation */}
            <section id="installation" className="space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2 border-b border-[#ededed] dark:border-[#262626]">
                <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white">
                  Installation
                </h2>
                <span className="text-xs font-mono text-[#3ecf8e]">v0.2.1 (Latest)</span>
              </div>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Install the package using your favorite package manager:
              </p>

              {/* Package Manager Tabs */}
              <div className="rounded-[8px] border border-[#ededed] dark:border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 bg-[#141414] border-b border-[#262626]">
                  <div className="flex items-center gap-1.5">
                    {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setActiveInstallTab(pm)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          activeInstallTab === pm
                            ? 'bg-[#2b2b2b] text-white font-semibold'
                            : 'text-[#71717a] hover:text-[#ededed]'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => copyCode(installCommands[activeInstallTab], 'install')}
                    className="p-1 rounded hover:bg-[#2b2b2b] text-[#a1a1aa] hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedId === 'install' ? (
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-3 font-mono text-xs text-[#3ecf8e]">
                  <span>$ {installCommands[activeInstallTab]}</span>
                </div>
              </div>
            </section>

            {/* 3. Quickstart Provider */}
            <section id="quickstart" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Quick Start: Provider Setup
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                Wrap your client component tree in <code className="px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#1f1f1f] text-xs font-mono text-[#171717] dark:text-[#ededed]">CiceroProvider</code>. This establishes the React context for wallet discovery, balance polling, and modal state.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#262626]">
                  <span className="text-xs font-mono text-[#a1a1aa]">app/providers.tsx</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        `'use client';\n\nimport { CiceroProvider } from '@cicero-zcash/react';\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    <CiceroProvider initialNetwork="mainnet" appName="My Zcash dApp">\n      {children}\n    </CiceroProvider>\n  );\n}`,
                        'provider-code'
                      )
                    }
                    className="p-1 rounded hover:bg-[#2b2b2b] text-[#a1a1aa] hover:text-white transition-colors"
                  >
                    {copiedId === 'provider-code' ? (
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
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
              <div className="flex items-center gap-2 pb-2 border-b border-[#ededed] dark:border-[#262626]">
                <Bot className="w-5 h-5 text-[#3ecf8e]" />
                <h2 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-white">
                  AI Agent Skill & Developer Prompts
                </h2>
              </div>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                Build 10x faster by giving your AI coding assistant (Cursor, Claude Code, Windsurf, Antigravity, Copilot, ChatGPT) the exact Cicero mental model. Never deal with hallucinations or outdated API calls.
              </p>

              {/* Interactive AI Skill Component */}
              <AiSkillSection />
            </section>

            {/* 5. Component: CiceroConnectButton */}
            <section id="component-connect-button" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Component: CiceroConnectButton
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                The primary UI component. When disconnected, it displays a connect trigger. When connected, it transforms into an interactive pill showing active network, shielded balance, and a truncated address.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#262626]">
                  <span className="text-xs font-mono text-[#a1a1aa]">Header.tsx</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        `import { CiceroConnectButton } from '@cicero-zcash/react';\n\nexport function Header() {\n  return (\n    <header className="flex justify-between items-center p-4 border-b">\n      <h1 className="font-semibold">My Zcash Store</h1>\n      <CiceroConnectButton\n        variant="primary"\n        size="md"\n        radius="md"\n        label="Connect Zcash Wallet"\n        showBalance={true}\n        showNetwork={true}\n        showIcon={true}\n      />\n    </header>\n  );\n}`,
                        'btn-example'
                      )
                    }
                    className="p-1 rounded hover:bg-[#2b2b2b] text-[#a1a1aa] hover:text-white transition-colors"
                  >
                    {copiedId === 'btn-example' ? (
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
{`import { CiceroConnectButton } from '@cicero-zcash/react';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="font-semibold">My Zcash Store</h1>
      <CiceroConnectButton
        variant="primary"       // 'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'
        size="md"              // 'sm' | 'md' | 'lg'
        radius="md"            // 'none' | 'sm' | 'md' | 'lg' | 'full'
        label="Connect Zcash"  // Custom disconnected button text
        showBalance={true}     // Displays balance pill when connected
        showNetwork={true}     // Displays active network pill (mainnet/testnet)
        showIcon={true}        // Displays shielded icon
      />
    </header>
  );
}`}
                </pre>
              </div>

              {/* Props Table */}
              <div className="mt-4 overflow-x-auto rounded-[8px] border border-[#ededed] dark:border-[#262626]">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-[#fafafa] dark:bg-[#181818] border-b border-[#ededed] dark:border-[#262626] font-mono text-[#707070] dark:text-[#a1a1aa]">
                    <tr>
                      <th className="py-2.5 px-3">Prop</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Default</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ededed] dark:divide-[#262626]">
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">variant</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'</td>
                      <td className="py-2 px-3 font-mono">'primary'</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Button visual appearance token.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">size</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">'sm' | 'md' | 'lg'</td>
                      <td className="py-2 px-3 font-mono">'md'</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Padding and typography tier.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">radius</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">'none' | 'sm' | 'md' | 'lg' | 'full'</td>
                      <td className="py-2 px-3 font-mono">'md'</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Corner border-radius token.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">label</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">string</td>
                      <td className="py-2 px-3 font-mono">'Connect Zcash Wallet'</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Disconnected state text.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">showBalance</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">boolean</td>
                      <td className="py-2 px-3 font-mono">true</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Renders shielded ZEC balance in connected pill.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-[#3ecf8e]">showNetwork</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">boolean</td>
                      <td className="py-2 px-3 font-mono">true</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Renders mainnet/testnet status indicator.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Component: CiceroQRCode */}
            <section id="component-qrcode" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Component: CiceroQRCode
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                A hardened SVG QR code component optimized for high-density ZIP-321 payment request URIs and unified addresses. Includes error correction level 'M'.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
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
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Hook: useAccount()
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Provides access to current connection status, connected shielded address, and active wallet metadata.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
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
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Hook: useBalance()
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Queries shielded balance in ZEC, computes fiat USD estimates, tracks loading state, and exposes manual refetch.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
{`import { useBalance } from '@cicero-zcash/react';

export function WalletBalance() {
  const { zec, usd, isLoading, refetch } = useBalance();

  return (
    <div className="flex items-center gap-3">
      <span>{isLoading ? 'Syncing...' : \`\${zec} ZEC\`}</span>
      {usd && <span className="text-gray-500">(≈ $\${usd} USD)</span>}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}`}
                </pre>
              </div>
            </section>

            {/* Hook: useCicero */}
            <section id="hook-use-cicero" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Hook: useCicero()
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Exposes the master Cicero context: network switching between Mainnet and Testnet, modal triggers, and disconnect controls.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
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
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Hook: useZucchiniWallet()
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Direct interface to the Zucchini web browser extension via <code className="text-xs font-mono">@zucchinifi/dapp-sdk</code>. Auto-detects extension presence and listens for unlock events.
              </p>

              <div className="rounded-[8px] border border-[#2b2b2b] bg-[#181818] overflow-hidden text-white shadow-sm">
                <pre className="p-4 text-xs font-mono text-[#d4d4d8] overflow-x-auto leading-relaxed">
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
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Supported Wallets Architecture
              </h2>
              <p className="text-sm text-[#707070] dark:text-[#a1a1aa]">
                Web browsers enforce strict sandbox security preventing websites from querying arbitrary local OS processes. Cicero supports both in-browser injected extensions and zero-knowledge QR handoffs for mobile wallets:
              </p>

              <div className="overflow-x-auto rounded-[8px] border border-[#ededed] dark:border-[#262626]">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-[#fafafa] dark:bg-[#181818] border-b border-[#ededed] dark:border-[#262626] font-mono text-[#707070] dark:text-[#a1a1aa]">
                    <tr>
                      <th className="py-2.5 px-3">Wallet</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Connection Type</th>
                      <th className="py-2.5 px-3">Shielded Pool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ededed] dark:divide-[#262626]">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[#171717] dark:text-white">🥒 Zucchini Wallet</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Browser Extension</td>
                      <td className="py-2 px-3 font-mono text-[#24b47e] dark:text-[#3ecf8e]">1-Click Sidepanel Approval</td>
                      <td className="py-2 px-3">Orchard & Sapling</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[#171717] dark:text-white">🛡️ Zashi</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Mobile (ECC)</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">ZIP-321 QR Scan</td>
                      <td className="py-2 px-3">Orchard & Sapling</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[#171717] dark:text-white">📱 Ywallet</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Mobile & Desktop</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">ZIP-321 QR Scan</td>
                      <td className="py-2 px-3">Orchard & Sapling</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[#171717] dark:text-white">👁️ Viewing Key</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Auditor / Read-Only</td>
                      <td className="py-2 px-3 font-mono text-[#707070] dark:text-[#a1a1aa]">Unified Viewing Key (uview...)</td>
                      <td className="py-2 px-3">Shielded Decryption</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[#171717] dark:text-white">🔥 Burner Dev Session</td>
                      <td className="py-2 px-3 text-[#707070] dark:text-[#a1a1aa]">Local Development</td>
                      <td className="py-2 px-3 font-mono text-amber-500">Ephemeral In-Memory Testnet</td>
                      <td className="py-2 px-3">Testnet Orchard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 9. Standards */}
            <section id="standards" className="space-y-4 scroll-mt-24 pt-4">
              <h2 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white pb-2 border-b border-[#ededed] dark:border-[#262626]">
                Zcash Standards: ZIP-321 & ZIP-316
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[8px] border border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#181818] space-y-2">
                  <span className="font-semibold text-xs text-[#171717] dark:text-white">ZIP-321: Payment Request URIs</span>
                  <p className="text-xs text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                    Standardizes payment URIs for Zcash (<code className="font-mono">zcash:&lt;address&gt;?amount=&lt;val&gt;&message=&lt;memo&gt;</code>). Enables mobile and desktop wallets to auto-fill recipients, exact amounts, and encrypted memos.
                  </p>
                </div>
                <div className="p-4 rounded-[8px] border border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#181818] space-y-2">
                  <span className="font-semibold text-xs text-[#171717] dark:text-white">ZIP-316: Unified Addresses</span>
                  <p className="text-xs text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                    Combines multiple receiver types (Orchard, Sapling, and Transparent) into a single address starting with <code className="font-mono">u1</code> (mainnet) or <code className="font-mono">utest1</code> (testnet) to prevent cross-pool confusion.
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
