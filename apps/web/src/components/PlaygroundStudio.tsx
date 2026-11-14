'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Sliders,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  CiceroConnectButton,
  ZucchiniWalletAdapter,
  ZcashNetwork,
} from '@cicero-zcash/react';

export const PlaygroundStudio: React.FC = () => {
  const [variant, setVariant] = useState<'primary' | 'outline' | 'dark'>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showBalance, setShowBalance] = useState(true);
  const [showNetwork, setShowNetwork] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [zucchiniDetected, setZucchiniDetected] = useState(false);

  React.useEffect(() => {
    setZucchiniDetected(ZucchiniWalletAdapter.isAvailable());
  }, []);

  const generatedCode = `import { CiceroProvider, CiceroConnectButton, useAccount, useBalance } from '@cicero-zcash/react';

export default function App() {
  return (
    <CiceroProvider initialNetwork="mainnet">
      <nav className="flex justify-between p-4 border-b">
        <span>My Zcash dApp</span>
        <CiceroConnectButton
          variant="${variant}"
          size="${size}"
          showBalance={${showBalance}}
          showNetwork={${showNetwork}}
        />
      </nav>
      <MainDashboard />
    </CiceroProvider>
  );
}

function MainDashboard() {
  const { address, isConnected, wallet } = useAccount();
  const { zec, usd } = useBalance();

  return (
    <div className="p-6">
      {isConnected ? (
        <div>
          <h3>Connected to {wallet?.name}</h3>
          <p>Address: {address}</p>
          <p>Balance: {zec} ZEC (~\${usd} USD)</p>
        </div>
      ) : (
        <p>Please connect your Zcash wallet above.</p>
      )}
    </div>
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
            Wallet Connection Studio
          </h2>
          <p className="mt-3 text-base text-[#707070] leading-relaxed">
            Customize the connect button in real-time, test the live wallet selector, and generate drop-in code for your dApp.
          </p>
        </div>

        {/* Studio 2-Column Split Pane */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configuration Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5 p-6 bg-[#fafafa] rounded-[12px] border border-[#ededed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ededed]">
              <span className="text-sm font-medium text-[#171717] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3ecf8e]" />
                <span>Button Parameters</span>
              </span>
            </div>

            {/* Button Variant */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#171717]">Button Variant</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
              >
                <option value="primary">Primary Emerald</option>
                <option value="outline">Outline</option>
                <option value="dark">Dark Night</option>
              </select>
            </div>

            {/* Button Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#171717]">Button Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full p-2.5 rounded-[6px] bg-white border border-[#dfdfdf] text-xs text-[#171717] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
              >
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </select>
            </div>

            {/* Connected State Options */}
            <div className="pt-2 border-t border-[#ededed] space-y-3">
              <span className="text-xs font-medium text-[#171717]">Connected State Display</span>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBalance}
                  onChange={(e) => setShowBalance(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#dfdfdf] text-[#3ecf8e] accent-[#3ecf8e]"
                />
                <span className="text-xs text-[#171717]">Show Balance</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNetwork}
                  onChange={(e) => setShowNetwork(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#dfdfdf] text-[#3ecf8e] accent-[#3ecf8e]"
                />
                <span className="text-xs text-[#171717]">Show Network Indicator</span>
              </label>
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
                  Click button to connect
                </span>
              </div>

              {/* Zucchini Extension Status Banner */}
              {zucchiniDetected ? (
                <div className="mb-4 p-3 bg-emerald-50 rounded-[8px] border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥒</span>
                    <div>
                      <span className="font-semibold">Zucchini Wallet Detected!</span>
                      <p className="text-[11px] text-emerald-700">Browser extension wallet is ready to connect.</p>
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
                      <span className="font-medium text-[#171717]">Zucchini Browser Wallet</span>
                      <p className="text-[11px] text-[#9a9a9a]">Install Zucchini in Chrome to connect directly.</p>
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
                <div className="text-center space-y-3">
                  <CiceroConnectButton
                    variant={variant}
                    size={size}
                    showBalance={showBalance}
                    showNetwork={showNetwork}
                  />
                  <p className="text-[11px] text-[#707070]">
                    RainbowKit-style button: opens the wallet selector modal or account drawer
                  </p>
                </div>
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
          </div>
        </div>
      </div>
    </section>
  );
};
