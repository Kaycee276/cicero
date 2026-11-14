'use client';

import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

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
    <CiceroProvider initialNetwork="mainnet">
      <header>
        <CiceroConnectButton variant="primary" size="md" />
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
      type: "'primary' | 'outline' | 'dark'",
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
      prop: 'className',
      type: 'string',
      required: false,
      desc: 'Custom CSS classes for the connect button',
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
    <section id="docs" className="py-20 bg-white border-b border-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-[#24b47e] uppercase tracking-wider">
            API & Documentation
          </span>
          <h2 className="display-lg text-[#171717] tracking-tight mt-2">
            Developer Reference
          </h2>
          <p className="mt-3 text-base text-[#707070] leading-relaxed">
            Everything you need to integrate Zcash wallet connection into your React applications.
          </p>
        </div>

        {/* Code Snippets Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {codeSnippets.map((snippet, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[12px] bg-[#1c1c1c] text-white border border-[#2b2b2b] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2b2b2b]">
                  <span className="text-xs font-mono font-medium text-[#3ecf8e]">
                    {snippet.title}
                  </span>
                  <button
                    onClick={() => copySnippet(snippet.code, idx)}
                    className="p-1 rounded hover:bg-[#2b2b2b] text-[#9a9a9a] hover:text-white transition-colors"
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
        <div className="mt-14">
          <h3 className="text-lg font-semibold text-[#171717] mb-4">
            Component Props: <code className="font-mono text-sm bg-[#fafafa] px-2 py-0.5 rounded border border-[#dfdfdf]">&lt;CiceroConnectButton /&gt;</code>
          </h3>

          <div className="overflow-x-auto border border-[#ededed] rounded-[12px] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#ededed] text-[#707070] font-mono">
                <tr>
                  <th className="p-4">Prop</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Required</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] bg-white">
                {propsTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fafafa]/80 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#171717]">
                      {row.prop}
                    </td>
                    <td className="p-4 font-mono text-[#707070]">{row.type}</td>
                    <td className="p-4">
                      {row.required ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[#fafafa] text-[#707070] border border-[#ededed]">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#171717]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hooks Reference Table */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#171717] mb-4">
            React Hooks
          </h3>

          <div className="overflow-x-auto border border-[#ededed] rounded-[12px] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#ededed] text-[#707070] font-mono">
                <tr>
                  <th className="p-4">Hook</th>
                  <th className="p-4">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] bg-white">
                {hooksTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fafafa]/80 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#24b47e]">
                      {row.hook}
                    </td>
                    <td className="p-4 text-[#171717]">{row.desc}</td>
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
