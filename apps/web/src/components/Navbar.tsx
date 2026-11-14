'use client';

import React, { useState } from 'react';
import { Shield, Github, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { CiceroConnectButton } from '@cicero-zcash/react';
import { useStudioSettings } from '@/context/StudioSettingsContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    variant,
    size,
    radius,
    label,
    showBalance,
    showNetwork,
    showIcon,
    theme,
    toggleTheme,
  } = useStudioSettings();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ededed] dark:border-[#262626] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[6px] bg-[#171717] dark:bg-white flex items-center justify-center text-[#3ecf8e] dark:text-[#171717] transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4 fill-[#3ecf8e] dark:fill-[#171717]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg tracking-tight text-[#171717] dark:text-white">
                Cicero
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#3ecf8e]/15 text-[#24b47e] dark:text-[#3ecf8e] border border-[#3ecf8e]/30">
                Zcash
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#707070] dark:text-[#a1a1aa]">
          <a
            href="#playground"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Studio
          </a>
          <a
            href="#features"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Protocol Features
          </a>
          <a
            href="#use-cases"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#docs"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Documentation
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-[6px] border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] bg-white dark:bg-[#1a1a1a] text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white transition-all shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#707070]" />
            )}
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/Kaycee276/cicero"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f] text-[#171717] dark:text-[#ededed] transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-[#707070] dark:text-[#a1a1aa]" />
          </a>

          {/* Connect Button */}
          <CiceroConnectButton
            variant={variant}
            size={size}
            radius={radius}
            label={label}
            showBalance={showBalance}
            showNetwork={showNetwork}
            showIcon={showIcon}
          />
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-[6px] border border-[#dfdfdf] dark:border-[#333] text-[#707070] dark:text-[#a1a1aa]"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[6px] text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#ededed] dark:border-[#262626] bg-white dark:bg-[#121212] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <a
            href="#playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] dark:text-[#ededed] py-2"
          >
            Design Studio
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] dark:text-[#ededed] py-2"
          >
            Protocol Features
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] dark:text-[#ededed] py-2"
          >
            Use Cases
          </a>
          <a
            href="#docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#171717] dark:text-[#ededed] py-2"
          >
            Documentation
          </a>

          <div className="pt-2 border-t border-[#ededed] dark:border-[#262626] flex flex-col gap-2.5">
            <a
              href="https://github.com/Kaycee276/cicero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-[6px] border border-[#dfdfdf] dark:border-[#333] text-[#171717] dark:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f]"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
              <ArrowUpRight className="w-3 h-3 text-[#707070]" />
            </a>

            <div className="pt-1">
              <CiceroConnectButton
                variant={variant}
                size={size}
                radius={radius}
                label={label}
                showBalance={showBalance}
                showNetwork={showNetwork}
                showIcon={showIcon}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
