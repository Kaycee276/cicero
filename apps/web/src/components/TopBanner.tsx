'use client';

import React, { useState } from 'react';
import { Trophy, ArrowRight, X, Sparkles } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative isolate flex items-center justify-between gap-x-6 overflow-hidden bg-gradient-to-r from-emerald-950 via-[#131b17] to-zinc-950 px-4 py-2 sm:px-6 sm:py-2.5 border-b border-emerald-500/20 text-xs font-medium text-emerald-200">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 44.5% 88.3%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-[#3ecf8e] to-[#10b981] opacity-25"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#3ecf8e] font-semibold text-[11px] border border-emerald-500/30">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Hackathon Winner</span>
        </div>

        <p className="text-zinc-300 text-xs">
          <strong className="text-white font-semibold">Cicero v0.2.10 is Live:</strong> The universal RainbowKit for shielded Zcash. 1-click connect for Noir, Zelcore, Zucchini & Zashi.
        </p>

        <a
          href="https://github.com/Kaycee276/cicero"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#3ecf8e] hover:text-emerald-300 font-semibold underline underline-offset-2 ml-1"
        >
          <span>View on GitHub</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="-m-1.5 p-1.5 text-zinc-400 hover:text-white transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
