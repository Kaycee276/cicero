'use client';

import React from 'react';
import { Briefcase, Globe, ShieldAlert, Check } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Globe className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Privacy-First dApp Onboarding',
      problem:
        'Ethereum dApps expose full wallet history the moment a user connects, compromising financial privacy before a single transaction occurs.',
      solution:
        'Cicero connects users via Zcash shielded wallets where addresses are unlinkable and balances are hidden by zero-knowledge proofs — privacy by default, from the first click.',
      highlights: [
        'Shielded balance display (no public ledger)',
        'Auto network detection (Mainnet / Testnet)',
        'Multi-wallet support (Zucchini, Zashi, Ywallet)',
      ],
    },
    {
      icon: <Briefcase className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Confidential Treasury Dashboards',
      problem:
        'DAOs and companies using transparent chains inadvertently publish their entire treasury balance, payroll runway, and vendor relationships.',
      solution:
        'Connect a Zcash viewing key through Cicero to build internal dashboards that show balances only to authorized stakeholders — invisible to the public.',
      highlights: [
        'Viewing key read-only mode',
        'Real-time ZEC/USD price feeds',
        'One-click account drawer with QR receive',
      ],
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Journalist & Whistleblower Portals',
      problem:
        'Informants risk exposure when connecting wallets on public chains — their identity can be inferred from transaction graphs and address clustering.',
      solution:
        'Cicero + Zcash shielded addresses ensure that connecting a wallet reveals zero metadata. Even the wallet address shown in the dApp is mathematically unlinkable to any on-chain history.',
      highlights: [
        'Zero metadata or IP address leakage',
        'Mathematically unlinkable addresses',
        'Unified Address (ZIP-316) native',
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-20 bg-[#fafafa] dark:bg-[#181818] border-b border-[#ededed] dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-[#24b47e] dark:text-[#3ecf8e] uppercase tracking-wider">
            Real-World Impact
          </span>
          <h2 className="display-lg text-[#171717] dark:text-white tracking-tight mt-2">
            Where Zero-Knowledge Wallet Connection Matters
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
            Privacy isn't just a luxury — it is fundamental security for decentralized applications, treasury management, and freedom of information.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-[12px] bg-white dark:bg-[#121212] border border-[#dfdfdf] dark:border-[#262626] shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-[6px] bg-[#fafafa] dark:bg-[#202020] border border-[#ededed] dark:border-[#333] flex items-center justify-center">
                  {uc.icon}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#171717] dark:text-white">{uc.title}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <p className="text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                      <strong className="text-[#171717] dark:text-[#ededed]">The Pain: </strong>
                      {uc.problem}
                    </p>
                    <p className="text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                      <strong className="text-[#24b47e] dark:text-[#3ecf8e]">The Cicero Fix: </strong>
                      {uc.solution}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ededed] dark:border-[#262626] space-y-2">
                  {uc.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-2 text-xs text-[#171717] dark:text-[#ededed]">
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e] flex-shrink-0" />
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
