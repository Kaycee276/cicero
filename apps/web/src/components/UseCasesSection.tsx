'use client';

import React from 'react';
import { Briefcase, BookOpen, ShieldAlert, Check } from 'lucide-react';
import { CiceroPayButton } from '@cicero-zcash/react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Briefcase className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Confidential Payroll & Contractor Invoicing',
      problem:
        'Paying remote contractors via Ethereum or Solana publishes their salaries, net worth, and financial history on public block explorers.',
      solution:
        'Cicero generates shielded invoices with encrypted milestone identifiers. Only the contractor and employer can audit the transaction.',
      amount: 1.25,
      memo: 'Salary: Contractor #84 - Sprint 14 Milestone Settlement',
      label: 'Disburse Salary (1.25 ZEC)',
      highlights: [
        'Total financial confidentiality',
        'Viewing key auditor compliance',
        'Zero wealth exposure or doxxing risk',
      ],
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Sub-Cent Creator & Research Micro-Paywalls',
      problem:
        'Credit cards charge $0.30 + 2.9% per swipe, making $0.05 to $0.50 pay-per-article business models economically impossible.',
      solution:
        'Readers unlock individual articles, AI model weights, or research PDFs by paying micro-ZEC fees with negligible network costs.',
      amount: 0.015,
      memo: 'Unlock License: Paper #441 (Deep Learning In Zero-Knowledge)',
      label: 'Unlock Article (0.015 ZEC)',
      highlights: [
        'Sub-cent transaction economics',
        'Instant digital license delivery',
        'No monthly recurring subscription lock-in',
      ],
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Whistleblower & Investigative Bounties',
      problem:
        'Informants exposing corruption or fraud risk physical retaliation when Web2 forms or public crypto wallets reveal their identities.',
      solution:
        'News organizations and bounty sponsors receive encrypted verification keys in the 512-byte memo and disburse shielded rewards.',
      amount: 2.0,
      memo: 'Anonymous Reward: Document Leak Hash #88219-VERIFIED',
      label: 'Claim Shielded Bounty (2.0 ZEC)',
      highlights: [
        'Zero metadata or IP address leakage',
        'Encrypted on-chain submission receipts',
        'Mathematically un-linkable recipient addresses',
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#fafafa] border-b border-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-[#24b47e] uppercase tracking-wider">
            Real-World Impact
          </span>
          <h2 className="display-lg text-[#171717] tracking-tight mt-2">
            Where Zero-Knowledge Payments Matter Most
          </h2>
          <p className="mt-3 text-base text-[#707070] leading-relaxed">
            Privacy isn’t just a luxury—it is fundamental security for remote work, digital commerce, and freedom of information.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-8 rounded-[12px] bg-white border border-[#dfdfdf] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-[6px] bg-[#fafafa] border border-[#ededed] flex items-center justify-center">
                  {uc.icon}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#171717]">{uc.title}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <p className="text-[#707070] leading-relaxed">
                      <strong className="text-[#171717]">The Pain: </strong>
                      {uc.problem}
                    </p>
                    <p className="text-[#707070] leading-relaxed">
                      <strong className="text-[#24b47e]">The Cicero Fix: </strong>
                      {uc.solution}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ededed] space-y-2">
                  {uc.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-2 text-xs text-[#171717]">
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#ededed]">
                <CiceroPayButton
                  recipient="u1qwe829xkps9482mzsll049281kz8471hzkas093847zkd09472619as8361048293710293847102938471029384710"
                  amount={uc.amount}
                  memo={uc.memo}
                  label={uc.label}
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
