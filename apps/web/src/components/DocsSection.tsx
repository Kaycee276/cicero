'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Copy, Check, Terminal, ExternalLink, Bot, ArrowRight, Sparkles } from 'lucide-react';

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
      <header>
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
      <p>{zec} ZEC (~\${usd})</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`,
    },
    {
      title: 'Direct Zucchini Wallet Hook',
      code: `import { useZucchiniWallet } from '@cicero-zcash/react';

export function ZucchiniConnect() {
  const { isAvailable, isConnected, connect, address } = useZucchiniWallet();

  return (
    <div>
      {!isAvailable && <p>Install Zucchini extension</p>}
      {isAvailable && !isConnected && (
        <button onClick={() => connect()}>Connect Zucchini</button>
      )}
      {isConnected && <p>Connected: {address}</p>}
    </div>
  );
}`,
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
      desc: 'Display zero-knowledge privacy shield icon beside label (defaults to true)',
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
    <section id="docs" className="py-16 sm:py-20 bg-white dark:bg-[#121212] border-b border-[#ededed] dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-[#24b47e] dark:text-[#3ecf8e] uppercase tracking-wider">
              API & Documentation
            </span>
            <h2 className="display-lg text-[#171717] dark:text-white tracking-tight mt-2">
              Developer Reference
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
              Everything you need to integrate Zcash wallet connection into your React applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[#3ecf8e] text-[#171717] font-semibold text-xs hover:bg-[#24b47e] transition-colors shadow-sm"
            >
              <span>Explore Dedicated Docs Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs#ai-agent"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[#1c1c1c] dark:bg-[#202020] border border-[#2b2b2b] dark:border-[#333] text-white font-medium text-xs hover:border-[#3ecf8e] transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Install AI Skill</span>
            </Link>
          </div>
        </div>

        {/* Code Snippets Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {codeSnippets.map((snippet, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-[12px] bg-[#1c1c1c] dark:bg-[#181818] text-white border border-[#2b2b2b] dark:border-[#333] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2b2b2b] dark:border-[#333]">
                  <span className="text-xs font-mono font-medium text-[#3ecf8e]">
                    {snippet.title}
                  </span>
                  <button
                    onClick={() => copySnippet(snippet.code, idx)}
                    className="p-1 rounded hover:bg-[#2b2b2b] dark:hover:bg-[#252525] text-[#9a9a9a] hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-[#ededed] overflow-x-auto leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Component Props Table */}
        <div className="mt-12 sm:mt-14">
          <h3 className="text-lg font-semibold text-[#171717] dark:text-white mb-4">
            Component Props: <code className="font-mono text-sm bg-[#fafafa] dark:bg-[#1c1c1c] px-2 py-0.5 rounded border border-[#dfdfdf] dark:border-[#333] text-[#171717] dark:text-[#ededed]">&lt;CiceroConnectButton /&gt;</code>
          </h3>

          <div className="overflow-x-auto border border-[#ededed] dark:border-[#262626] rounded-[12px] shadow-sm">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-[#fafafa] dark:bg-[#181818] border-b border-[#ededed] dark:border-[#262626] text-[#707070] dark:text-[#a1a1aa] font-mono">
                <tr>
                  <th className="p-4">Prop</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Required</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] dark:divide-[#262626] bg-white dark:bg-[#121212]">
                {propsTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fafafa]/80 dark:hover:bg-[#181818] transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#171717] dark:text-[#ededed]">
                      {row.prop}
                    </td>
                    <td className="p-4 font-mono text-[#707070] dark:text-[#a1a1aa]">{row.type}</td>
                    <td className="p-4">
                      {row.required ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[#fafafa] dark:bg-[#202020] text-[#707070] dark:text-[#a1a1aa] border border-[#ededed] dark:border-[#333]">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#171717] dark:text-[#ededed]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hooks Reference Table */}
        <div className="mt-10 sm:mt-12">
          <h3 className="text-lg font-semibold text-[#171717] dark:text-white mb-4">
            React Hooks
          </h3>

          <div className="overflow-x-auto border border-[#ededed] dark:border-[#262626] rounded-[12px] shadow-sm">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-[#fafafa] dark:bg-[#181818] border-b border-[#ededed] dark:border-[#262626] text-[#707070] dark:text-[#a1a1aa] font-mono">
                <tr>
                  <th className="p-4">Hook</th>
                  <th className="p-4">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] dark:divide-[#262626] bg-white dark:bg-[#121212]">
                {hooksTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fafafa]/80 dark:hover:bg-[#181818] transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#24b47e] dark:text-[#3ecf8e]">
                      {row.hook}
                    </td>
                    <td className="p-4 text-[#171717] dark:text-[#ededed]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Skill & Prompts Callout Banner */}
          <div className="mt-8 p-6 rounded-[12px] bg-gradient-to-r from-[#171717] via-[#212121] to-[#171717] border border-[#2b2b2b] dark:border-[#333] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-lg bg-[#3ecf8e]/20 border border-[#3ecf8e]/40 flex items-center justify-center flex-shrink-0 text-[#3ecf8e]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Using Cursor, Claude Code, Windsurf, or Antigravity?
                </h4>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  Install the official Cicero Agent Skill or copy battle-tested prompts to supercharge your AI coding speed.
                </p>
              </div>
            </div>

            <Link
              href="/docs#ai-agent"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#3ecf8e] text-[#171717] text-xs font-semibold hover:bg-[#24b47e] transition-colors flex-shrink-0 shadow-sm"
            >
              <span>Get Agent Skill & Prompts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
