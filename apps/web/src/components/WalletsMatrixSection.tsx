'use client';

import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useCicero } from '@cicero-zcash/react';
import { useStudioSettings } from '@/context/StudioSettingsContext';

interface WalletCardInfo {
  id: string;
  name: string;
  mark: string;
  badge: string;
  type: string;
  description: string;
  features: string[];
  protocol: string;
  network: string;
}

export const WalletsMatrixSection: React.FC = () => {
  const { openConnectModalWithAppearance } = useCicero();
  const { variant, size, radius, showBalance, showNetwork, showIcon, accentColor } = useStudioSettings();
  const openConnectModal = () => openConnectModalWithAppearance({
    variant,
    size,
    radius,
    showBalance,
    showNetwork,
    showIcon,
    accentColor,
  });

  const wallets: WalletCardInfo[] = [
    {
      id: 'noir',
      name: 'Noir Wallet',
      mark: 'N',
      badge: 'In-Browser RPC',
      type: 'Web Extension',
      description: 'Self-custodial privacy extension for shielded Zcash & ZECFi with direct in-browser JSON-RPC authorization.',
      features: ['Native zcash_requestAccounts RPC', 'Zero-knowledge Orchard pool', 'Automatic network detection'],
      protocol: 'window.noirwallet.zcash',
      network: 'Mainnet & Testnet',
    },
    {
      id: 'zelcore',
      name: 'Zelcore Wallet',
      mark: 'Z',
      badge: '1-Click Connect',
      type: 'Extension & Desktop',
      description: 'Multi-asset web extension & desktop wallet with 1-click transparent ZEC binding and zel: protocol deep-linking.',
      features: ['Zero-friction 1-click connection', 'Native zel:?action=pay deep link', 'Multi-currency portfolio bridge'],
      protocol: 'zel: URI & Extension Binding',
      network: 'Mainnet Native',
    },
    {
      id: 'zucchini',
      name: 'Zucchini Wallet',
      mark: 'Z',
      badge: 'Dedicated Extension',
      type: 'Web Extension',
      description: 'Built specifically for Zcash with 1-click side-panel approvals via the official @zucchinifi/dapp-sdk.',
      features: ['1-click in-browser approval', 'Live network sync listener', 'Full Unified Address (u1) support'],
      protocol: '@zucchinifi/dapp-sdk',
      network: 'Mainnet & Testnet',
    },
    {
      id: 'zashi',
      name: 'Zashi (Electric Coin Co.)',
      mark: 'Z',
      badge: 'Official Mobile',
      type: 'iOS & Android',
      description: 'Electric Coin Company’s shielded mobile wallet. Create a ZIP-321 request that users can review and approve in their wallet.',
      features: ['ZIP-321 payment request handoff', 'User reviews before approval', 'Orchard & Sapling support'],
      protocol: 'ZIP-321 QR Protocol',
      network: 'Mainnet & Testnet',
    },
    {
      id: 'ywallet',
      name: 'Ywallet',
      mark: 'Y',
      badge: 'High Performance',
      type: 'Desktop & Mobile',
      description: 'High-performance privacy wallet for desktop and mobile with ultra-fast sync and advanced transaction construction.',
      features: ['Ultra-fast blockchain sync', 'Cold-wallet signing bridge', 'Multi-account management'],
      protocol: 'ZIP-321 QR Protocol',
      network: 'Mainnet & Testnet',
    },
    {
      id: 'viewing-key',
      name: 'Viewing Keys',
      mark: 'VK',
      badge: 'Auditor Mode',
      type: 'Read-Only Key',
      description: 'Non-custodial read-only inspection for accounting, tax calculation, and proof-of-reserves without spend authority.',
      features: ['Unified & Sapling viewing keys', 'Zero spend key exposure', 'Compliance & accounting ready'],
      protocol: 'uview... / zxviews...',
      network: 'Mainnet & Testnet',
    },
    {
      id: 'burner',
      name: 'Ephemeral Dev Sessions',
      mark: 'DEV',
      badge: 'Zero Setup',
      type: 'In-Memory Testnet',
      description: 'Instantly creates an in-memory session wallet pre-funded with simulated testnet ZEC for rapid local dApp testing.',
      features: ['Instant zero-dependency launch', 'Pre-funded simulated balance', 'Perfect for hackathons & CI'],
      protocol: 'In-Memory Keypair',
      network: 'Simulated Testnet',
    },
  ];

  return (
    <section id="wallets" className="relative overflow-hidden border-y border-zinc-800/80 bg-[#0c0c0e] py-24 sm:py-32">
      {/* Background Glow */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-7 border-b border-zinc-800/80 pb-14 md:flex-row md:items-end sm:pb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#3ecf8e]">
              <span>Full Ecosystem Interoperability</span>
            </div>
            <h2 className="display-xl text-white font-bold tracking-tight">
              One Interface. All 7 Zcash Wallets.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              One API for browser extensions, mobile wallet handoffs, read-only viewing keys, and local development sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={openConnectModal}
            className="self-start md:self-auto inline-flex min-h-11 items-center gap-2 px-4 py-2.5 rounded-md bg-[#3ecf8e] hover:bg-[#24b47e] text-zinc-950 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0e]"
          >
            <span>Launch Live Connect Modal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 gap-5 pt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {wallets.map((w, index) => (
            <div
              key={w.id}
              className={`wallet-kit-card group flex flex-col justify-between p-7 transition-colors sm:p-8 ${index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-4'}`}
            >
              <div className="space-y-4">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex h-10 min-w-10 items-center justify-center rounded-md bg-[#3ecf8e]/10 px-2 font-mono text-xs font-semibold tracking-wide text-[#3ecf8e]">
                      {w.mark}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-white">{w.name}</h3>
                      <p className="text-[11px] font-mono text-zinc-400">{w.type}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">
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
                <div className="min-w-0 pr-3">
                  <span className="block truncate text-zinc-300" title={w.protocol}>{w.protocol}</span>
                  <span className="mt-1 block truncate text-[10px] text-zinc-500">{w.network}</span>
                </div>
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="min-h-10 rounded-sm text-xs font-semibold text-[#3ecf8e] hover:text-emerald-300 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
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
