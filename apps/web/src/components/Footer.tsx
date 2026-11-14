import React from 'react';
import { Shield, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#121212] border-t border-[#ededed] dark:border-[#262626] py-16 px-4 sm:px-6 lg:px-8 text-xs text-[#707070] dark:text-[#a1a1aa] transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[4px] bg-[#171717] dark:bg-[#262626] flex items-center justify-center text-[#3ecf8e]">
              <Shield className="w-3.5 h-3.5 fill-[#3ecf8e]" />
            </div>
            <span className="font-semibold text-sm text-[#171717] dark:text-white">Cicero</span>
          </div>
          <p className="text-xs text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
            The universal wallet connection kit for shielded Zcash apps. Connect Zashi, Ywallet, Zingo, Keystones, and Orchard addresses in one click.
          </p>
          <p className="text-[11px] text-[#9a9a9a] dark:text-[#71717a]">
            Named after Marcus Tullius Cicero, champion of confidential correspondence.
          </p>
        </div>

        {/* Resources Col */}
        <div>
          <h4 className="font-semibold text-[#171717] dark:text-white mb-3">Protocol Standards</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://zips.z.cash/zip-0321"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                ZIP-321 (Payment Request URIs)
              </a>
            </li>
            <li>
              <a
                href="https://zips.z.cash/zip-0316"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                ZIP-316 (Unified Addresses)
              </a>
            </li>
            <li>
              <a
                href="https://z.cash/technology/zksnarks/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Halo 2 & zk-SNARKs
              </a>
            </li>
          </ul>
        </div>

        {/* Ecosystem Col */}
        <div>
          <h4 className="font-semibold text-[#171717] dark:text-white mb-3">Zcash Ecosystem</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://zechub.wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                ZecHub Open Source Wiki
              </a>
            </li>
            <li>
              <a
                href="https://electriccoin.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Electric Coin Co. (Zashi Wallet)
              </a>
            </li>
            <li>
              <a
                href="https://ywallet.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Ywallet
              </a>
            </li>
            <li>
              <a
                href="https://zcashcommunitygrants.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                Zcash Community Grants
              </a>
            </li>
          </ul>
        </div>

        {/* GitHub & Open Source */}
        <div>
          <h4 className="font-semibold text-[#171717] dark:text-white mb-3">Open Source</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Kaycee276/cicero"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Kaycee276/cicero</span>
              </a>
            </li>
            <li>
              <span className="text-[#9a9a9a] dark:text-[#71717a]">MIT Licensed</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#ededed] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#9a9a9a] dark:text-[#71717a]">
          © {new Date().getFullYear()} Cicero. Built for the privacy-first Web3 economy.
        </p>
        <div className="flex items-center gap-1 text-[11px] text-[#9a9a9a] dark:text-[#71717a]">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-[#3ecf8e] fill-[#3ecf8e]" />
          <span>for the Zcash Hackathon</span>
        </div>
      </div>
    </footer>
  );
};
