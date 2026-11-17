'use client';

import React from 'react';
import {
  Shield,
  Smartphone,
  Eye,
  Zap,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCicero } from '@cicero-zcash/react';

interface WalletCardInfo {
  id: string;
  name: string;
  icon: string;
  badge: string;
  type: string;
  description: string;
  features: string[];
  protocol: string;
  network: string;
  accentColor: string;
}

export const WalletsMatrixSection: React.FC = () => {
  const { openConnectModal } = useCicero();

  const wallets: WalletCardInfo[] = [
    {
      id: 'noir',
      name: 'Noir Wallet',
      icon: '🖤',
      badge: 'In-Browser RPC',
      type: 'Web Extension',
      description: 'Self-custodial privacy extension for shielded Zcash & ZECFi with direct in-browser JSON-RPC authorization.',
      features: ['Native zcash_requestAccounts RPC', 'Zero-knowledge Orchard pool', 'Automatic network detection'],
      protocol: 'window.noirwallet.zcash',
      network: 'Mainnet & Testnet',
      accentColor: 'border-zinc-700 hover:border-zinc-500',
    },
    {
      id: 'zelcore',
      name: 'Zelcore Wallet',
      icon: '🔷',
      badge: '1-Click Connect',
      type: 'Extension & Desktop',
      description: 'Multi-asset web extension & desktop wallet with 1-click transparent ZEC binding and zel: protocol deep-linking.',
      features: ['Zero-friction 1-click connection', 'Native zel:?action=pay deep link', 'Multi-currency portfolio bridge'],
      protocol: 'zel: URI & Extension Binding',
      network: 'Mainnet Native',
      accentColor: 'border-blue-500/30 hover:border-blue-400',
    },
    {
      id: 'zucchini',
      name: 'Zucchini Wallet',
      icon: '🛡️',
      badge: 'Dedicated Extension',
      type: 'Web Extension',
      description: 'Built specifically for Zcash with 1-click side-panel approvals via the official @zucchinifi/dapp-sdk.',
      features: ['1-click in-browser approval', 'Live network sync listener', 'Full Unified Address (u1) support'],
      protocol: '@zucchinifi/dapp-sdk',
      network: 'Mainnet & Testnet',
      accentColor: 'border-emerald-500/30 hover:border-emerald-400',
    },
    {
      id: 'zashi',
      name: 'Zashi (Electric Coin Co.)',
      icon: '📱',
      badge: 'Official Mobile',
      type: 'iOS & Android',
      description: 'Electric Coin Company’s official shielded mobile wallet connecting securely via zero-knowledge ZIP-321 QR handoff.',
      features: ['Zero metadata exposure', 'ZIP-321 standard QR handoff', 'Full Orchard & Sapling support'],
      protocol: 'ZIP-321 QR Protocol',
      network: 'Mainnet & Testnet',
      accentColor: 'border-amber-500/30 hover:border-amber-400',
    },
    {
      id: 'ywallet',
      name: 'Ywallet',
      icon: '⚡',
      badge: 'High Performance',
      type: 'Desktop & Mobile',
      description: 'High-performance privacy wallet for desktop and mobile with ultra-fast sync and advanced transaction construction.',
      features: ['Ultra-fast blockchain sync', 'Cold-wallet signing bridge', 'Multi-account management'],
      protocol: 'ZIP-321 QR Protocol',
      network: 'Mainnet & Testnet',
      accentColor: 'border-purple-500/30 hover:border-purple-400',
    },
    {
      id: 'viewing-key',
      name: 'Viewing Keys',
      icon: '👁️',
      badge: 'Auditor Mode',
      type: 'Read-Only Key',
      description: 'Non-custodial read-only inspection for accounting, tax calculation, and proof-of-reserves without spend authority.',
      features: ['Unified & Sapling viewing keys', 'Zero spend key exposure', 'Compliance & accounting ready'],
      protocol: 'uview... / zxviews...',
      network: 'Mainnet & Testnet',
      accentColor: 'border-zinc-700 hover:border-zinc-500',
    },
    {
      id: 'burner',
      name: 'Ephemeral Dev Sessions',
      icon: '🧪',
      badge: 'Zero Setup',
      type: 'In-Memory Testnet',
      description: 'Instantly creates an in-memory session wallet pre-funded with simulated testnet ZEC for rapid local dApp testing.',
      features: ['Instant zero-dependency launch', 'Pre-funded simulated balance', 'Perfect for hackathons & CI'],
      protocol: 'In-Memory Keypair',
      network: 'Simulated Testnet',
      accentColor: 'border-emerald-500/30 hover:border-emerald-400',
    },
  ];

  return (
    <section id="wallets" className="py-20 sm:py-28 bg-[#0c0c0e] border-b border-zinc-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial-glow opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-800/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-[#3ecf8e]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Ecosystem Interoperability</span>
            </div>
            <h2 className="display-xl text-white font-bold tracking-tight">
              One Interface. All 7 Zcash Wallets.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Cicero abstracts away the fragmentation between browser extensions, mobile wallets, and viewing keys so developers write clean, unified code.
            </p>
          </div>

          <button
            type="button"
            onClick={openConnectModal}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3ecf8e] hover:bg-[#24b47e] text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/10"
          >
            <span>Launch Live Connect Modal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
          {wallets.map((w) => (
            <div
              key={w.id}
              className={`glow-card rounded-2xl border ${w.accentColor} bg-zinc-900/60 p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300 space-y-5`}
            >
              <div className="space-y-4">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner">
                      {w.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-white">{w.name}</h3>
                      <p className="text-[11px] font-mono text-zinc-400">{w.type}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700">
                    {w.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  {w.description}
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  {w.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3ecf8e] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Bottom: Protocol Meta & Connect Action */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="truncate max-w-[150px] text-zinc-500">{w.protocol}</span>
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="text-xs font-semibold text-[#3ecf8e] hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Connect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
