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
      title: 'Quickstart Checkout Button',
      code: `import { CiceroPayButton } from '@cicero-zcash/react';

export function Checkout() {
  return (
    <CiceroPayButton
      recipient="u1qwe829xkps9482mzsll049281kz8471..."
      amount={0.15}
      memo="Order #8921 - Digital Pass"
      variant="primary"
      size="md"
      onSuccess={({ txId, amount }) => {
        alert(\`Settled on-chain! Tx: \${txId}\`);
      }}
    />
  );
}`,
    },
    {
      title: 'Direct Zucchini Browser Wallet Hook',
      code: `import { useZucchiniWallet } from '@cicero-zcash/react';

export function ZucchiniPay() {
  const { isAvailable, connect, requestPayment } = useZucchiniWallet();

  const handlePay = async () => {
    await connect();
    const { txId } = await requestPayment({
      recipient: 'u1...',
      amount: 0.25,
      memo: 'Order #1042',
    });
    alert(\`Submitted in Zucchini! Tx: \${txId}\`);
  };

  return (
    <button onClick={handlePay} disabled={!isAvailable}>
      {isAvailable ? 'Pay with Zucchini' : 'Install Zucchini'}
    </button>
  );
}`,
    },
  ];

  const propsTable = [
    {
      prop: 'recipient',
      type: 'string',
      required: true,
      desc: 'Recipient Zcash address (Unified u1, Sapling zs1, or Transparent t1)',
    },
    {
      prop: 'amount',
      type: 'number | string',
      required: true,
      desc: 'Amount to be paid in ZEC (e.g. 0.05)',
    },
    {
      prop: 'memo',
      type: 'string',
      required: false,
      desc: 'Zero-knowledge encrypted memo (up to 512 bytes on shielded addresses)',
    },
    {
      prop: 'message',
      type: 'string',
      required: false,
      desc: 'Human-readable order note per ZIP-321 specification',
    },
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
      prop: 'network',
      type: "'mainnet' | 'testnet'",
      required: false,
      desc: 'Target Zcash network (defaults to mainnet)',
    },
    {
      prop: 'onSuccess',
      type: '(tx: { txId: string; amount: number; memo?: string }) => void',
      required: false,
      desc: 'Callback triggered upon verified on-chain confirmation',
    },
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
            Everything you need to integrate zero-knowledge Zcash checkout flows into your Next.js, React, or mobile web applications.
          </p>
        </div>

        {/* Code Snippets Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            Component Props: <code className="font-mono text-sm bg-[#fafafa] px-2 py-0.5 rounded border border-[#dfdfdf]">&lt;CiceroPayButton /&gt;</code> & <code className="font-mono text-sm bg-[#fafafa] px-2 py-0.5 rounded border border-[#dfdfdf]">&lt;CiceroInvoice /&gt;</code>
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
      </div>
    </section>
  );
};
