"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Github,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { CiceroConnectButton } from "@cicero-zcash/react";
import { useStudioSettings } from "@/context/StudioSettingsContext";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDocs = pathname === "/docs";

  const {
    variant,
    size,
    radius,
    label,
    showBalance,
    showNetwork,
    showIcon,
    accentColor,
    theme,
    toggleTheme,
  } = useStudioSettings();

  const studioHref = isDocs ? "/#playground" : "#playground";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Cicero home" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950">
            <div className="flex items-center gap-2">
              <span className="font-science-gothic uppercase font-[850] text-lg tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                CICERO
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href={studioHref} className="rounded-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
            Studio
          </a>
          <Link
            href="/docs"
            className={`rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] ${
              isDocs ? "text-[#3ecf8e] font-semibold" : "hover:text-white"
            }`}
          >
            Docs
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
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white transition-all shadow-sm"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
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
            accentColor={accentColor}
          />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="sm:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <a
              href={studioHref}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Studio
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
              accentColor={accentColor}
              className="w-full justify-center"
            />
          </div>
        </div>
      )}
    </header>
  );
};
