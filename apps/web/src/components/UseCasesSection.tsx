'use client';

import React from 'react';
import { Briefcase, Globe, ShieldAlert, Check, Sparkles } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      title: 'Privacy-First dApp Onboarding',
      problem:
        'Ethereum & Solana dApps expose full wallet transaction histories the moment a user connects, compromising financial privacy before a transaction even starts.',
      solution:
        'Cicero connects users via shielded Zcash addresses where history is unlinkable and balances are shielded by zero-knowledge proofs — privacy by default from the first click.',
      highlights: [
        'Shielded balance verification (no public ledger surveillance)',
        'Auto network detection (Mainnet / Testnet)',
        'Multi-wallet support (Noir, Zelcore, Zucchini, Zashi, Ywallet)',
      ],
    },
    {
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      title: 'Confidential Treasury Dashboards',
      problem:
        'DAOs and companies using public transparent chains inadvertently publish their entire treasury balance, runway, and private vendor settlements.',
      solution:
        'Connect a Zcash viewing key through Cicero to build internal dashboards that show shielded balances only to authorized compliance teams — completely invisible to the public.',
      highlights: [
        'Viewing key read-only auditor mode (uview/zxviews)',
        'Real-time ZEC/USD price feeds with automated caching',
        'One-click account drawer with instant QR receive',
      ],
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
      title: 'Whistleblower & Investigative Portals',
      problem:
        'Informants and contributors risk severe physical or legal exposure when connecting wallets on transparent blockchains where clusters trace back to their identity.',
      solution:
        'Cicero + Zcash Orchard addresses ensure connecting a wallet reveals zero identity metadata. Addresses are mathematically unlinkable across multiple interactions.',
      highlights: [
        'Zero metadata or IP address leakage',
        'Unified Address (ZIP-316) native Orchard pool',
        'Ephemeral Dev Sessions for air-gapped test workflows',
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-World Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where Zero-Knowledge Connection Matters
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Privacy isn't just an optional feature — it is foundational security for decentralized commerce, confidential corporate treasuries, and free speech.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-7 rounded-2xl bg-[#0e0e12] border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-xl space-y-6"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#141418] border border-zinc-800 flex items-center justify-center">
                  {uc.icon}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{uc.title}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <p className="text-zinc-400 leading-relaxed">
                      <strong className="text-rose-400 font-mono">The Pain: </strong>
                      {uc.problem}
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      <strong className="text-emerald-400 font-mono">The Cicero Fix: </strong>
                      {uc.solution}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  {uc.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
