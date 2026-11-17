'use client';

import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Lock,
  Unlock,
  Coins,
  Globe,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { CiceroConnectButton, useAccount, useBalance, useCicero } from '@cicero-zcash/react';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export const HeroSection: React.FC = () => {
  const [selectedPm, setSelectedPm] = useState<PackageManager>('pnpm');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const { isConnected, address, wallet } = useAccount();
  const { zec, usd, isLoading: isBalLoading } = useBalance();
  const { network, switchNetwork, openConnectModal } = useCicero();

  const pmCommands: Record<PackageManager, string> = {
    pnpm: 'pnpm add @cicero-zcash/react',
    npm: 'npm install @cicero-zcash/react',
    yarn: 'yarn add @cicero-zcash/react',
    bun: 'bun add @cicero-zcash/react',
  };

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(pmCommands[selectedPm]);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 md:pt-24 md:pb-32 overflow-hidden bg-[#09090b] text-white">
      {/* Ambient Radial Glow & Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-radial-glow opacity-80 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-radial-glow-cyan opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Vision & Primary Action */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Pulsing Beacon Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-[#3ecf8e] shadow-lg shadow-emerald-500/10 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>The RainbowKit of Shielded Zcash • v0.2.10</span>
            </div>

            {/* Master Headline */}
            <h1 className="display-xxl text-white font-extrabold tracking-tight leading-[1.08]">
              Universal Wallet Connect for{' '}
              <span className="bg-gradient-to-r from-[#3ecf8e] via-emerald-300 to-teal-400 bg-clip-text text-transparent underline decoration-[#3ecf8e]/40 decoration-4 underline-offset-8">
                Shielded Zcash
              </span>
              .
            </h1>

            {/* Lead Narrative */}
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              One provider. One button. Drop-in wallet connection for <strong className="text-white">Noir</strong>, <strong className="text-white">Zelcore</strong>, <strong className="text-white">Zucchini</strong>, <strong className="text-white">Zashi</strong>, <strong className="text-white">Ywallet</strong>, and viewing keys. Zero setup, real-time balances, and automatic ZIP-321 zero-knowledge payments.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#playground"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#3ecf8e] hover:bg-[#24b47e] text-zinc-950 font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                <span>Launch Interactive Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#wallets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95 backdrop-blur-sm"
              >
                <span>Explore 7 Wallets</span>
              </a>

              <a
                href="/docs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-zinc-400 hover:text-white font-medium text-sm transition-colors"
              >
                <span>Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Interactive Package Manager Selector */}
            <div className="pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md overflow-hidden shadow-2xl">
                {/* PM Tabs */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/60">
                  <div className="flex items-center gap-1.5">
                    {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setSelectedPm(pm)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors ${
                          selectedPm === pm
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    v0.2.10
                  </span>
                </div>

                {/* Command Line */}
                <div className="flex items-center justify-between px-4 py-3 font-mono text-xs text-zinc-200">
                  <div className="flex items-center gap-2.5 truncate">
                    <Terminal className="w-3.5 h-3.5 text-[#3ecf8e] flex-shrink-0" />
                    <span className="text-zinc-500">$</span>
                    <span className="text-emerald-300 font-medium truncate">{pmCommands[selectedPm]}</span>
                  </div>

                  <button
                    onClick={copyInstall}
                    className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-3 flex-shrink-0"
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
            </div>

            {/* Value Trust Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-900/80 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white font-mono">7 Wallets</p>
                <p className="text-xs text-zinc-500 mt-0.5">Orchard, Sapling, Transparent</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#3ecf8e] font-mono">&lt; 60s</p>
                <p className="text-xs text-zinc-500 mt-0.5">Integration time</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white font-mono">ZIP-316</p>
                <p className="text-xs text-zinc-500 mt-0.5">Unified Address Native</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">Zero Setup</p>
                <p className="text-xs text-zinc-500 mt-0.5">Built-in dev test sessions</p>
              </div>
            </div>

          </div>

          {/* Right Column: Live Glassmorphic Simulation Card */}
          <div className="lg:col-span-5 relative">
            <div className="glow-card relative rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-zinc-950/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Card Header Simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
                    <Shield className="w-4 h-4 fill-[#3ecf8e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Live dApp Interface</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">zkResearch Portal</p>
                  </div>
                </div>

                {/* Drop-in Cicero Button live in hero */}
                <CiceroConnectButton variant="primary" size="sm" radius="full" />
              </div>

              {/* Shielded Balance Status Card */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    Shielded Pool Balance (Orchard)
                  </span>
                  <button
                    onClick={() => switchNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors uppercase font-semibold"
                  >
                    {network}
                  </button>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                      {isBalLoading ? '...' : zec}
                    </span>
                    <span className="text-sm font-semibold text-zinc-400 ml-1.5">ZEC</span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                    {usd ? usd : '≈ $0.00 USD'}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Halo 2 Zero-Knowledge Proofs</span>
                  <span className="text-emerald-400 font-mono">Active</span>
                </div>
              </div>

              {/* Connected Wallet State or Interactive Trigger */}
              {isConnected ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Connected: {wallet?.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      Live Session
                    </span>
                  </div>
                  <p className="truncate text-zinc-400 text-[11px]">{address}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-xs text-zinc-400 space-y-3">
                  <p className="leading-relaxed">
                    Test the live wallet connection drawer right here. Select Noir, Zelcore, Zucchini, or launch an instant ephemeral test session.
                  </p>
                  <button
                    type="button"
                    onClick={openConnectModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    <span>Open Cicero Connect Modal</span>
                  </button>
                </div>
              )}

              {/* Supported Wallets Row in Hero */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Wallets:</span>
                <span className="text-zinc-300">Noir • Zelcore • Zucchini • Zashi • Ywallet</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
