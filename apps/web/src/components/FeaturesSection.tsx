'use client';

import React from 'react';
import {
  Shield,
  Wallet,
  Smartphone,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      title: 'RainbowKit-Style Connect Experience',
      badge: 'Core UI',
      description:
        'A single <CiceroConnectButton /> renders a multi-state wallet pill: connect trigger → modal selector → connected drawer with live balance, network badge, QR code, and disconnect.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      title: 'Unified Support for 7 Zcash Wallets',
      badge: 'Multi-Wallet',
      description:
        'Supports Noir, Zelcore, Zucchini extension, mobile Zashi, Ywallet, read-only Viewing Keys, and Ephemeral Dev Sessions without writing custom adapters.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
      title: 'Bi-Directional Network Synchronization',
      badge: 'Live Sync',
      description:
        'Cicero auto-detects the wallet\'s active network on connect and listens for live change events. Toggling Mainnet ↔ Testnet in extension or app updates state in real-time.',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Unified Address (ZIP-316) Parsing',
      badge: 'Multi-Pool',
      description:
        'Validates and classifies Unified Addresses (u1), Sapling shielded pools (zs1), and transparent addresses (t1). Cryptographic network inference directly from address prefixes.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: 'Isolated Network Balance Queries',
      badge: 'State Machine',
      description:
        'Balances are queried and cached per-network. Switching from Mainnet to Testnet instantly fetches the correct shielded balance with zero cross-state pollution.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: 'Real-Time Fiat Rate Oracle',
      badge: 'Price Feed',
      description:
        'The useZcashPrice() hook provides live ZEC → USD conversion with decentralized API fallbacks, automatic caching, and configurable refresh intervals.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Engineered For Zero-Knowledge Privacy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Zcash Cryptographic Standards
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Cicero provides a shared React interface for wallet connection, account state, balances, and Zcash payment requests.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-[#0e0e12] border border-zinc-800/80 hover:border-zinc-700 hover:shadow-[0_0_25px_rgba(62,207,142,0.08)] transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#141418] border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                  {feat.icon}
                </div>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                  {feat.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
