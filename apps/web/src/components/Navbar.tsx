'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Github, Menu, X, ArrowUpRight, Sun, Moon, Bot, Sparkles, Terminal } from 'lucide-react';
import { CiceroConnectButton } from '@cicero-zcash/react';
import { useStudioSettings } from '@/context/StudioSettingsContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDocs = pathname === '/docs';

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

  const studioHref = isDocs ? '/#playground' : '#playground';
  const walletsHref = isDocs ? '/#wallets' : '#wallets';
  const paywallHref = isDocs ? '/#paywall-demo' : '#paywall-demo';
  const featuresHref = isDocs ? '/#features' : '#features';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center text-[#3ecf8e] shadow-lg shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-500/50 transition-all">
                <Shield className="w-4 h-4 fill-[#3ecf8e]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Cicero
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#3ecf8e] border border-emerald-500/20">
                Zcash
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a
            href={studioHref}
            className="hover:text-white transition-colors"
          >
            Studio
          </a>
          <a
            href={walletsHref}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>7 Wallets</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
              New
            </span>
          </a>
          <a
            href={paywallHref}
            className="hover:text-white transition-colors"
          >
            Paywall Demo
          </a>
          <a
            href={featuresHref}
            className="hover:text-white transition-colors"
          >
            Standards
          </a>
          <Link
            href="/docs"
            className={`transition-colors ${
              isDocs
                ? 'text-[#3ecf8e] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Docs
          </Link>
          <Link
            href="/docs#ai-agent"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-[#3ecf8e] hover:bg-emerald-500/20 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Skill</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* GitHub Stars Link */}
          <a
            href="https://github.com/Kaycee276/cicero"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Star</span>
            <span className="text-zinc-500">|</span>
            <span className="text-emerald-400 font-mono">v0.2.10</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white transition-all shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          {/* Cicero Live Connect Button */}
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

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <a
              href={studioHref}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Studio
            </a>
            <a
              href={walletsHref}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              7 Wallets Matrix
            </a>
            <a
              href={paywallHref}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Paywall Demo
            </a>
            <a
              href={featuresHref}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Protocol Features
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Documentation
            </Link>
            <Link
              href="/docs#ai-agent"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              AI Skill Installer
            </Link>
          </nav>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-3">
            <CiceroConnectButton
              variant={variant}
              size="md"
              radius={radius}
              label={label}
              showBalance={showBalance}
              showNetwork={showNetwork}
              showIcon={showIcon}
              className="w-full justify-center"
            />
          </div>
        </div>
      )}
    </header>
  );
};
