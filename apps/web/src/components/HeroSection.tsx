'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Copy, Check, Terminal, Wallet, Sparkles } from 'lucide-react';
import { CiceroConnectButton } from '@cicero-zcash/react';

export const HeroSection: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const installCmd = 'pnpm add @cicero-zcash/react';

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#ededed] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 text-xs font-medium text-[#24b47e] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24b47e] animate-pulse"></span>
            <span>The RainbowKit of Shielded Zcash • Cicero v0.2.0</span>
          </div>

          {/* Display Headline */}
          <h1 className="display-xxl text-[#171717] tracking-tight">
            Universal wallet connection for <span className="underline decoration-[#3ecf8e] decoration-4 underline-offset-4">Shielded Zcash</span>.
          </h1>

          {/* Body Lead */}
          <p className="mt-6 text-lg sm:text-xl text-[#707070] leading-relaxed font-normal">
            The developer toolkit for Zcash: connect to any wallet (Zucchini browser extension, Zashi, Ywallet, Viewing Keys) with a single component. Auto-detects network, syncs balances, and renders a RainbowKit-style account drawer — all zero-knowledge native.
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#3ecf8e] text-[#171717] font-medium text-sm hover:bg-[#24b47e] transition-colors shadow-sm"
            >
              <span>Explore Interactive Studio</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-white text-[#171717] font-medium text-sm border border-[#dfdfdf] hover:border-[#c7c7c7] hover:bg-[#fafafa] transition-colors shadow-sm"
            >
              <span>Read Documentation</span>
            </a>
          </div>

          {/* Quick Install Terminal */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-[6px] bg-[#1c1c1c] text-white border border-[#2b2b2b] shadow-sm font-mono text-xs">
            <Terminal className="w-3.5 h-3.5 text-[#3ecf8e]" />
            <span className="text-[#9a9a9a]">$</span>
            <span className="text-white font-medium">{installCmd}</span>
            <button
              onClick={copyInstall}
              className="ml-3 p-1 rounded hover:bg-[#2b2b2b] text-[#9a9a9a] hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {copiedInstall ? (
                <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Hero Live Demonstration — Wallet Connect */}
        <div className="mt-14 p-6 sm:p-8 rounded-[12px] bg-[#fafafa] border border-[#ededed] shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#24b47e] bg-[#3ecf8e]/15 px-2 py-0.5 rounded-full border border-[#3ecf8e]/30">
                  Live Component Preview
                </span>
                <span className="text-xs text-[#707070]">• Zero Setup</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#171717] tracking-tight">
                One component. Full wallet integration.
              </h3>
              <p className="text-sm text-[#707070] leading-relaxed">
                Click the button below to connect your Zcash wallet. Cicero auto-detects the active network (Mainnet or Testnet), queries your shielded balance, and renders a RainbowKit-style account pill with network indicator, balance display, and account drawer.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-[#707070]">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  <span>Multi-Wallet Support</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  <span>Auto Network Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  <span>Live Balance</span>
                </div>
              </div>
            </div>

            {/* Live interactive trigger */}
            <div className="flex-shrink-0 p-6 bg-white rounded-[12px] border border-[#ededed] shadow-md flex flex-col items-center gap-3 w-full sm:w-auto min-w-[280px]">
              <span className="text-xs font-mono text-[#707070]">Try the wallet connect button:</span>
              <CiceroConnectButton size="lg" variant="primary" />
              <span className="text-[11px] text-[#9a9a9a]">Opens wallet selector or account drawer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
