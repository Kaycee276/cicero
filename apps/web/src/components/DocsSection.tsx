'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Copy, Check, Terminal, ExternalLink, Bot, ArrowRight, Code2 } from 'lucide-react';

export const DocsSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copySnippet = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  const codeSnippets = [
    {
      title: 'Installation',
      code: `pnpm add @cicero-zcash/react
# or
npm install @cicero-zcash/react
# or
yarn add @cicero-zcash/react`,
    },
    {
      title: 'RainbowKit-style Connect Wallet',
      code: `import { CiceroProvider, CiceroConnectButton } from '@cicero-zcash/react';

export function App() {
  return (
    <CiceroProvider initialNetwork="mainnet" appName="My Zcash dApp">
      <header className="flex justify-between items-center p-4 border-b border-zinc-800">
        <CiceroConnectButton variant="primary" size="md" radius="md" />
      </header>
      <MainApp />
    </CiceroProvider>
  );
}`,
    },
    {
      title: 'Account & Balance Hooks',
      code: `import { useAccount, useBalance, useCicero } from '@cicero-zcash/react';

function Dashboard() {
  const { address, isConnected, wallet } = useAccount();
  const { zec, usd, refetch } = useBalance();
  const { network, switchNetwork } = useCicero();

  if (!isConnected) return <p>Not connected</p>;

  return (
    <div>
      <p>{wallet?.name} on {network}</p>
      <p>{address}</p>
      <p>{zec} ZEC (~$\${usd})</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`,
    },
    {
      title: 'ZIP-321 Payment Dispatching',
      code: `import { generateZip321Uri, getWalletDeepLinks } from '@cicero-zcash/react';

const uri = generateZip321Uri({
  address: 'u1q0v6wvg9u04vj945r20s9x2kqu4r73cstfqdfm8e8m57u3...',
  amount: 0.05,
  memo: 'Order #9042 verification'
});

const { zashi, ywallet } = getWalletDeepLinks(uri);`,
    },
  ];

  const propsTable = [
    {
      prop: 'variant',
      type: "'primary' | 'outline' | 'dark' | 'ghost' | 'gradient' | 'gold'",
      required: false,
      desc: 'Button visual style token (defaults to signature emerald primary)',
    },
    {
      prop: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      desc: 'Button dimension and padding tier (defaults to md)',
    },
    {
      prop: 'radius',
      type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
      required: false,
      desc: 'Corner geometry radius (defaults to md / 6px)',
    },
    {
      prop: 'label',
      type: 'string',
      required: false,
      desc: 'Custom button label text (defaults to "Connect Zcash Wallet")',
    },
    {
      prop: 'showBalance',
      type: 'boolean',
      required: false,
      desc: 'Show shielded balance in the connected pill (defaults to true)',
    },
    {
      prop: 'showNetwork',
      type: 'boolean',
      required: false,
      desc: 'Show network indicator badge in connected pill (defaults to true)',
    },
    {
      prop: 'showIcon',
      type: 'boolean',
      required: false,
      desc: 'Show the wallet icon on the button and in its dialogs (defaults to true)',
    },
    {
      prop: 'accentColor',
      type: 'string',
      required: false,
      desc: 'Hex color shared by the button and wallet dialogs; filled states choose readable text automatically',
    },
    {
      prop: 'className',
      type: 'string',
      required: false,
      desc: 'Custom CSS classes for the connect button trigger',
    },
  ];

  const hooksTable = [
    { hook: 'useCicero()', desc: 'Full context: account, network, balance, connect, disconnect, switchNetwork, modal controls' },
    { hook: 'useAccount()', desc: 'Account state: address, isConnected, isConnecting, wallet, disconnect' },
    { hook: 'useBalance()', desc: 'Balance state: zec, usd, isLoading, refetch' },
    { hook: 'useConnectModal()', desc: 'Modal controls: isOpen, openConnectModal, closeConnectModal' },
    { hook: 'useAccountModal()', desc: 'Modal controls: isOpen, openAccountModal, closeAccountModal' },
    { hook: 'useZcashPrice()', desc: 'Live ZEC/USD price with convertZecToUsd() helper' },
    { hook: 'useZucchiniWallet()', desc: 'Direct Zucchini adapter: isAvailable, connect, address, getBalance' },
  ];

  return (
    <section id="docs" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>API & Documentation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Developer Reference
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Everything you need to integrate zero-knowledge Zcash wallet connection and ZIP-321 checkout into your React applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 text-zinc-950 font-semibold text-xs hover:bg-emerald-300 transition-colors shadow-sm"
            >
              <span>Full Interactive Docs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#ai-agent"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141418] border border-zinc-800 text-white font-medium text-xs hover:border-emerald-500/50 transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Agent Skill</span>
            </a>
          </div>
        </div>

        {/* Code Snippets Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {codeSnippets.map((snippet, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0e0e12] text-white border border-zinc-800/80 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{snippet.title}</span>
                  </span>
                  <button
                    onClick={() => copySnippet(snippet.code, idx)}
                    className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed p-2 bg-[#09090b] rounded-lg border border-zinc-800/60">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Component Props Table */}
        <div className="mt-14">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>Component Props:</span>
            <code className="break-all font-mono text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-emerald-400">&lt;CiceroConnectButton /&gt;</code>
          </h3>

          <div className="overflow-x-auto border border-zinc-800/80 rounded-2xl shadow-xl bg-[#0e0e12]">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-[#141418] border-b border-zinc-800/80 text-zinc-400 font-mono">
                <tr>
                  <th className="p-4">Prop</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Required</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {propsTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono font-semibold text-white">
                      {row.prop}
                    </td>
                    <td className="p-4 font-mono text-zinc-400">{row.type}</td>
                    <td className="p-4">
                      {row.required ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-rose-950/60 text-rose-300 border border-rose-900 font-mono">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700 font-mono">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-400">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hooks Reference Table */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4">
            React Hooks Suite
          </h3>

          <div className="overflow-x-auto border border-zinc-800/80 rounded-2xl shadow-xl bg-[#0e0e12]">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-[#141418] border-b border-zinc-800/80 text-zinc-400 font-mono">
                <tr>
                  <th className="p-4">Hook</th>
                  <th className="p-4">Returns / Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {hooksTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono font-semibold text-emerald-400">
                      {row.hook}
                    </td>
                    <td className="p-4 text-zinc-400">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
