'use client';

import React from 'react';
import { Shield, Github, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090b] border-t border-[#1a1a1e] py-16 px-4 sm:px-6 lg:px-8 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4 fill-emerald-400/20" />
            </div>
            <span className="font-inscription text-base font-semibold tracking-wide text-white">
              Cicero
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              v0.2.10
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            The universal wallet connection kit for shielded Zcash apps. Connect Noir, Zelcore,
            Zucchini, Zashi, and Ywallet with cryptographic privacy by default.
          </p>

          <p className="text-[11px] text-zinc-500">
            Named for Marcus Tullius Cicero, the Roman orator whose legacy inspires this focus on
            clear, private communication.
          </p>
        </div>

        {/* Resources Col */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white tracking-wider uppercase font-mono text-[11px]">
            Protocol Standards
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://zips.z.cash/zip-0321"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>ZIP-321 (Payment Request URIs)</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://zips.z.cash/zip-0316"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>ZIP-316 (Unified Addresses)</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://z.cash/technology/zksnarks/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Halo 2 & Recursive SNARKs</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://eips.ethereum.org/EIPS/eip-6963"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>EIP-6963 Multi-Provider Standard</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
          </ul>
        </div>

        {/* Ecosystem Col */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white tracking-wider uppercase font-mono text-[11px]">
            Zcash Ecosystem
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://zechub.wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>ZecHub Open Source Wiki</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://electriccoin.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Electric Coin Co. (ECC)</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://ywallet.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Ywallet Shielded Mobile</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
            <li>
              <a
                href="https://zcashcommunitygrants.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Zcash Community Grants (ZCG)</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </li>
          </ul>
        </div>

        {/* Developer Col */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white tracking-wider uppercase font-mono text-[11px]">
            Developer Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Kaycee276/cicero"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5 text-zinc-400" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@cicero-zcash/react"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>NPM Package (@cicero-zcash/react)</span>
              </a>
            </li>
            <li>
              <a href="#playground" className="hover:text-emerald-400 transition-colors">
                Interactive Design Studio
              </a>
            </li>
            <li>
              <a href="#paywall-demo" className="hover:text-emerald-400 transition-colors">
                zk-Shielded Paywall Demo
              </a>
            </li>
            <li>
              <a href="#ai-agent" className="hover:text-emerald-400 transition-colors">
                AI Agent Skills (Cursor & Claude)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub-footer Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <div>
          &copy; {new Date().getFullYear()} Cicero. Released under MIT License for the Zcash builder
          community.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with zero-knowledge pride for financial privacy</span>
        </div>
      </div>
    </footer>
  );
};
