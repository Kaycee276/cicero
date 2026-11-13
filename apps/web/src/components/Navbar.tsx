'use client';

import React, { useState } from 'react';
import { Shield, Github, Menu, X, ArrowUpRight } from 'lucide-react';
import { CiceroConnectButton } from '@cicero-zcash/react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ededed] bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-[#3ecf8e] transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4 fill-[#3ecf8e]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg tracking-tight text-[#171717]">Cicero</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#3ecf8e]/15 text-[#24b47e] border border-[#3ecf8e]/30">
                Zcash
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#707070]">
          <a href="#playground" className="hover:text-[#171717] transition-colors">
            Playground
          </a>
          <a href="#features" className="hover:text-[#171717] transition-colors">
            Protocol Features
          </a>
          <a href="#use-cases" className="hover:text-[#171717] transition-colors">
            Use Cases
          </a>
          <a href="#docs" className="hover:text-[#171717] transition-colors">
            Documentation
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/Kaycee276/cicero"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#dfdfdf] hover:border-[#c7c7c7] hover:bg-[#fafafa] text-[#171717] transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-[#707070]" />
          </a>

          <CiceroConnectButton size="sm" />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[6px] text-[#707070] hover:text-[#171717] hover:bg-[#fafafa]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#ededed] bg-white px-4 pt-2 pb-4 space-y-3">
          <a
            href="#playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] py-2"
          >
            Playground
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] py-2"
          >
            Protocol Features
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] py-2"
          >
            Use Cases
          </a>
          <a
            href="#docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] py-2"
          >
            Documentation
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://github.com/Kaycee276/cicero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-[6px] border border-[#dfdfdf] text-[#171717]"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <div className="pt-1">
              <CiceroConnectButton size="sm" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
