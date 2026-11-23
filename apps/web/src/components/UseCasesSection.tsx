'use client';

import React from 'react';
import { Briefcase, Globe, ShieldAlert, Check } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      title: 'Privacy-First dApp Onboarding',
      problem:
        'Public wallet addresses can make transaction history easy to inspect and link across applications.',
      solution:
        'Cicero supports shielded Zcash address flows. The privacy properties depend on the address pool, wallet behavior, and how the application handles user data.',
      highlights: [
        'Shielded address support (pool dependent)',
        'Auto network detection (Mainnet / Testnet)',
        'Multi-wallet support (Noir, Zelcore, Zucchini, Zashi, Ywallet)',
      ],
    },
    {
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      title: 'Confidential Treasury Dashboards',
      problem:
        'Teams may need to share selected balance data with auditors without granting transaction signing authority.',
      solution:
        'Use a read-only viewing key in an internal dashboard. Viewing keys can expose transaction details, so limit access and handle them like sensitive credentials.',
      highlights: [
        'Viewing key read-only auditor mode (uview/zxviews)',
        'Cached ZEC/USD price data',
        'One-click account drawer with instant QR receive',
      ],
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
      title: 'Whistleblower & Investigative Portals',
      problem:
        'Public transaction histories can reveal relationships between addresses and make sensitive activity easier to trace.',
      solution:
        'Cicero supports shielded Zcash wallet flows, which can reduce public transaction visibility. Wallets and apps may still expose network or account metadata; operational privacy needs separate care.',
      highlights: [
        'Shielded pool support where available',
        'Unified Address (ZIP-316) support',
        'Ephemeral Dev Sessions for air-gapped test workflows',
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
            <span>Real-World Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where shielded wallet support helps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Privacy isn't just an optional feature — it is foundational security for decentralized commerce, confidential corporate treasuries, and free speech.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-7 bg-[#101013] transition-colors space-y-6"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-md bg-[#19191d] flex items-center justify-center">
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
