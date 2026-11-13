'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Shield,
  Sliders,
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  CiceroPayButton,
  CiceroInvoice,
  getAddressType,
  validateMemoSupport,
  generateZip321Uri,
  ZcashNetwork,
  ZucchiniWalletAdapter,
} from '@cicero-zcash/react';

interface ScenarioPreset {
  name: string;
  recipient: string;
  amount: number;
  memo: string;
  message: string;
  label: string;
}

const PRESETS: Record<string, ScenarioPreset> = {
  creator: {
    name: 'Creator Micro-Paywall',
    recipient:
      'u1qwe829xkps9482mzsll049281kz8471hzkas093847zkd09472619as8361048293710293847102938471029384710',
    amount: 0.02,
    memo: 'Unlock Research Paper #104: Zero-Knowledge Protocols',
    message: 'Single article paywall unlock',
    label: 'Unlock Article (0.02 ZEC)',
  },
  ecommerce: {
    name: 'Confidential E-Commerce',
    recipient:
      'u1z84892kssm04829skzk09384820193847291038472910384729103847291038472910384729103847291038472910',
    amount: 0.75,
    memo: 'Order #9821 - Hardware Security Key (Tracking ID: SH-8821)',
    message: 'Store item checkout',
    label: 'Pay with Zcash',
  },
  whistleblower: {
    name: 'Whistleblower Bounty',
    recipient:
      'zs1z7rejlpsa98s23m6x699yd3ynv8wseqtvd30dm2f2jxap9s0vd6qa9uh0mkpv4cac9gqaf8e5ms',
    amount: 1.5,
    memo: 'Bounty Reward: Tip #771 Evidence Verified',
    message: 'Shielded informant reward',
    label: 'Claim Shielded Bounty',
  },
};

export const PlaygroundStudio: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('creator');
  const [recipient, setRecipient] = useState<string>(PRESETS.creator.recipient);
  const [amount, setAmount] = useState<number | string>(PRESETS.creator.amount);
  const [memo, setMemo] = useState<string>(PRESETS.creator.memo);
  const [message, setMessage] = useState<string>(PRESETS.creator.message);
  const [label, setLabel] = useState<string>(PRESETS.creator.label);
  const [variant, setVariant] = useState<'primary' | 'outline' | 'dark'>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [network, setNetwork] = useState<ZcashNetwork>('mainnet');
  const [displayMode, setDisplayMode] = useState<'modal' | 'invoice'>('modal');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [zucchiniDetected, setZucchiniDetected] = useState(false);

  React.useEffect(() => {
    setZucchiniDetected(ZucchiniWalletAdapter.isAvailable());
  }, []);

  const addressType = getAddressType(recipient);
  const memoValidation = validateMemoSupport(recipient, memo);

  const handlePresetChange = (key: string) => {
    setSelectedPreset(key);
    const p = PRESETS[key];
    if (p) {
      setRecipient(p.recipient);
      setAmount(p.amount);
      setMemo(p.memo);
      setMessage(p.message);
      setLabel(p.label);
    }
  };

  const rawZip321Uri = generateZip321Uri({
    address: recipient,
    amount,
    memo,
    message,
  });

  const generatedCode =
    displayMode === 'modal'
      ? `import { CiceroPayButton } from '@cicero-zcash/react';

export default function CheckoutPage() {
  return (
    <CiceroPayButton
      recipient="${recipient}"
      amount={${amount}}
      memo="${memo}"
      message="${message}"
      label="${label}"
      variant="${variant}"
      size="${size}"
      network="${network}"
      onSuccess={({ txId, amount }) => {
        console.log('Payment settled on-chain!', txId, amount);
      }}
    />
  );
}`
      : `import { CiceroInvoice } from '@cicero-zcash/react';

export default function EmbeddedInvoice() {
  return (
    <CiceroInvoice
      recipient="${recipient}"
      amount={${amount}}
      memo="${memo}"
      message="${message}"
      network="${network}"
      invoiceId="INV-9821"
      onSuccess={({ txId, amount }) => {
        console.log('Invoice paid!', txId);
      }}
    />
  );
}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  const copyUri = async () => {
    try {
      await navigator.clipboard.writeText(rawZip321Uri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section id="playground" className="py-20 bg-white border-b border-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#24b47e] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Workbench</span>
          </div>
          <h2 className="display-lg text-[#171717] tracking-tight">
            Cicero Studio & Live Sandbox
          </h2>
          <p className="mt-3 text-base text-[#707070] leading-relaxed">
            Customize parameters in real-time, test the component preview live, and generate drop-in code for your dApp or checkout flow.
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2 p-2 bg-[#fafafa] rounded-[8px] border border-[#ededed]">
          <span className="text-xs font-medium text-[#707070] px-3">Scenario Presets:</span>
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                selectedPreset === key
                  ? 'bg-white text-[#171717] shadow-sm border border-[#dfdfdf]'
                  : 'text-[#707070] hover:text-[#171717]'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Studio 2-Column Split Pane */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configuration Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5 p-6 bg-[#fafafa] rounded-[12px] border border-[#ededed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ededed]">
              <span className="text-sm font-medium text-[#171717] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3ecf8e]" />
                <span>Widget Parameters</span>
              </span>
              <div className="flex items-center rounded-[6px] border border-[#dfdfdf] p-0.5 bg-white text-xs">
                <button
                  onClick={() => setDisplayMode('modal')}
                  className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors ${
                    displayMode === 'modal'
                      ? 'bg-[#171717] text-white'
                      : 'text-[#707070] hover:text-[#171717]'
                  }`}
                >
                  Modal Button
                </button>
                <button
                  onClick={() => setDisplayMode('invoice')}
                  className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors ${
                    displayMode === 'invoice'
                      ? 'bg-[#171717] text-white'
                      : 'text-[#707070] hover:text-[#171717]'
                  }`}
                >
                  Inline Card
                </button>
              </div>
            </div>

            {/* Recipient Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-[#171717]">Recipient Address</label>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#dfdfdf] text-[#24b47e]">
                  {addressType === 'unified'
                    ? 'Unified (ZIP-316)'
                    : addressType === 'sapling'
                    ? 'Sapling'
                    : addressType === 'transparent'
                    ? 'Transparent'
                    : 'Unknown'}
                </span>
              </div>
              <textarea
                rows={2}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
                placeholder="u1... or zs1... or t1..."
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#171717]">Amount (ZEC)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
              />
            </div>

            {/* Encrypted Memo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-[#171717] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  <span>Encrypted Memo (zk-Shielded)</span>
                </label>
                <span className="font-mono text-[10px] text-[#707070]">
                  {memoValidation.byteLength}/512 bytes
                </span>
              </div>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
                placeholder="Encrypted metadata, order number, or secret key"
              />
              {memoValidation.warning && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  {memoValidation.warning}
                </p>
              )}
            </div>

            {/* Order Note / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#171717]">Human-Readable Message</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
                placeholder="Optional customer-facing order description"
              />
            </div>

            {/* Button Styling Controls (if in modal mode) */}
            {displayMode === 'modal' && (
              <div className="pt-2 border-t border-[#ededed] grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-[#171717]">Button Variant</label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value as any)}
                    className="w-full p-2 rounded-[6px] bg-white border border-[#dfdfdf] text-xs text-[#171717]"
                  >
                    <option value="primary">Primary Emerald</option>
                    <option value="outline">Outline</option>
                    <option value="dark">Dark Night</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#171717]">Button Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="w-full p-2 rounded-[6px] bg-white border border-[#dfdfdf] text-xs text-[#171717]"
                  >
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Network Selector */}
            <div className="space-y-1 text-xs">
              <label className="font-medium text-[#171717]">Network</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNetwork('mainnet')}
                  className={`flex-1 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                    network === 'mainnet'
                      ? 'bg-white border-[#3ecf8e] text-[#24b47e] shadow-sm font-semibold'
                      : 'border-[#dfdfdf] text-[#707070] bg-[#fafafa]'
                  }`}
                >
                  Mainnet
                </button>
                <button
                  type="button"
                  onClick={() => setNetwork('testnet')}
                  className={`flex-1 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                    network === 'testnet'
                      ? 'bg-white border-amber-500 text-amber-700 shadow-sm font-semibold'
                      : 'border-[#dfdfdf] text-[#707070] bg-[#fafafa]'
                  }`}
                >
                  Testnet
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview & Generated Code (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Component Preview Box */}
            <div className="p-6 bg-white rounded-[12px] border border-[#ededed] shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ededed]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]"></div>
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#171717]">
                    Live Interactive Preview
                  </span>
                </div>
                <span className="text-xs text-[#707070]">
                  {displayMode === 'modal' ? 'Click trigger below' : 'Interactive inline card'}
                </span>
              </div>

              {/* Zucchini Extension Status Banner */}
              {zucchiniDetected ? (
                <div className="mb-4 p-3 bg-emerald-50 rounded-[8px] border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥒</span>
                    <div>
                      <span className="font-semibold">Zucchini Wallet Detected!</span>
                      <p className="text-[11px] text-emerald-700">1-click browser extension payment is active in the modal.</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-800">
                    Active
                  </span>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-[#fafafa] rounded-[8px] border border-[#ededed] text-xs text-[#707070] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥒</span>
                    <div>
                      <span className="font-medium text-[#171717]">Zucchini Browser Wallet Ready</span>
                      <p className="text-[11px] text-[#9a9a9a]">Install Zucchini in Chrome to enable direct 1-click in-browser approval.</p>
                    </div>
                  </div>
                  <a
                    href="https://chromewebstore.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-[#24b47e] hover:underline flex items-center gap-1"
                  >
                    <span>Extension</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Component Rendering Area */}
              <div className="min-h-[160px] flex items-center justify-center p-6 bg-[#fafafa] rounded-[8px] border border-dashed border-[#dfdfdf]">
                {displayMode === 'modal' ? (
                  <div className="text-center space-y-3">
                    <CiceroPayButton
                      recipient={recipient}
                      amount={amount}
                      memo={memo}
                      message={message}
                      label={label}
                      variant={variant}
                      size={size}
                      network={network}
                      onSuccess={({ txId }) => {
                        alert(`Success! Confirmed Tx: ${txId.slice(0, 16)}...`);
                      }}
                    />
                    <p className="text-[11px] text-[#707070]">
                      Clicking button activates the zero-knowledge checkout modal
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <CiceroInvoice
                      recipient={recipient}
                      amount={amount}
                      memo={memo}
                      message={message}
                      network={network}
                      invoiceId="INV-DEMO"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Generated Code Snippet */}
            <div className="p-6 bg-[#1c1c1c] rounded-[12px] border border-[#2b2b2b] text-white shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2b2b2b]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#3ecf8e]">
                  <Code className="w-4 h-4" />
                  <span>Generated React Code</span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#2b2b2b] hover:bg-[#383838] text-xs text-white transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                      <span className="text-[#3ecf8e]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9a9a9a]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-[#ededed] overflow-x-auto leading-relaxed p-2">
                <code>{generatedCode}</code>
              </pre>
            </div>

            {/* Raw ZIP-321 URI Inspector */}
            <div className="p-4 bg-[#fafafa] rounded-[8px] border border-[#ededed] text-xs space-y-2">
              <div className="flex items-center justify-between text-[#707070]">
                <span className="font-mono text-[11px]">Raw ZIP-321 Payment URI</span>
                <button
                  onClick={copyUri}
                  className="text-[#24b47e] hover:underline font-mono text-[11px]"
                >
                  {copiedUri ? 'Copied URI!' : 'Copy URI'}
                </button>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#dfdfdf] font-mono text-[11px] text-[#171717] break-all select-all">
                {rawZip321Uri}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
