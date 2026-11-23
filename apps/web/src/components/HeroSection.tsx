"use client";

import React, { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
} from "lucide-react";
import {
  CiceroConnectButton,
  useAccount,
  useBalance,
  useCicero,
} from "@cicero-zcash/react";
import { useStudioSettings } from "@/context/StudioSettingsContext";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

export const HeroSection: React.FC = () => {
  const [selectedPm, setSelectedPm] = useState<PackageManager>("pnpm");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const { isConnected, address, wallet } = useAccount();
  const { zec, usd, isLoading: isBalLoading } = useBalance();
  const { network, switchNetwork } = useCicero();
  const {
    variant,
    size,
    radius,
    label,
    showBalance,
    showNetwork,
    showIcon,
    accentColor,
  } = useStudioSettings();

  const commands: Record<PackageManager, string> = {
    pnpm: "pnpm add @cicero-zcash/react",
    npm: "npm install @cicero-zcash/react",
    yarn: "yarn add @cicero-zcash/react",
    bun: "bun add @cicero-zcash/react",
  };

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(commands[selectedPm]);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-[#09090b] text-white">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="relative z-10 lg:col-span-6">
          <h1 className="display-xxl max-w-3xl text-balance text-white">
            Zcash wallet connections,{" "}
            <span className="text-[#3ecf8e]">spoken clearly.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            One measured interface for Zcash wallets, shielded accounts, and
            ZIP-321 payments.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#playground"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#3ecf8e] px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#24b47e] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
            >
              Try the connection studio
              <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="/docs"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-zinc-700 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
            >
              Read the documentation
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-9 max-w-xl overflow-hidden rounded-lg border border-zinc-800 bg-[#101013]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-3 py-2">
              <div
                className="flex items-center gap-1"
                role="group"
                aria-label="Choose package manager"
              >
                {packageManagers.map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    aria-pressed={selectedPm === pm}
                    onClick={() => setSelectedPm(pm)}
                    className={`min-h-8 rounded px-2.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] ${
                      selectedPm === pm
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                @cicero-zcash/react
              </span>
            </div>

            <div className="flex min-h-14 items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:text-sm">
                <Terminal
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[#3ecf8e]"
                />
                <code className="truncate text-zinc-200">
                  {commands[selectedPm]}
                </code>
              </div>
              <button
                type="button"
                onClick={copyInstall}
                aria-label={
                  copyState === "copied"
                    ? "Install command copied"
                    : "Copy install command"
                }
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
              >
                {copyState === "copied" ? (
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 text-[#3ecf8e]"
                  />
                ) : (
                  <Copy aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {copyState === "copied"
                ? "Install command copied to clipboard."
                : copyState === "error"
                  ? "Could not copy the command. Select and copy it manually."
                  : ""}
            </p>
          </div>

          <ul
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-800/80 pt-5 text-xs text-zinc-400 sm:text-sm"
            aria-label="Integration highlights"
          >
            <li>
              <span className="font-mono text-white">7</span> wallet paths
            </li>
            <li>
              <span className="font-mono text-white">ZIP-316</span> addresses
            </li>
            <li>
              <span className="font-mono text-white">ZIP-321</span> payments
            </li>
          </ul>
        </div>

        <div className="relative lg:col-span-6 lg:pl-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -inset-y-6 rounded-3xl border border-zinc-800/50 sm:-inset-6"
          />
          <div className="relative overflow-hidden rounded-xl border border-zinc-700/80 bg-[#111114] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Wallet connection preview
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Try the real connect flow
                </p>
              </div>
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

            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-400">
                    {isConnected
                      ? "Connected wallet balance"
                      : "Your shielded balance"}
                  </p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span
                      className="font-mono text-4xl font-medium tracking-tight text-white sm:text-5xl"
                      aria-live="polite"
                    >
                      {isConnected ? (isBalLoading ? "Loading…" : zec) : "—"}
                    </span>
                    <span className="text-sm text-zinc-400">ZEC</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-zinc-300">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${network === "mainnet" ? "bg-[#3ecf8e]" : "bg-amber-400"}`}
                    />
                    {network}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      void switchNetwork(
                        network === "mainnet" ? "testnet" : "mainnet",
                      )
                    }
                    className="mt-2 block w-full text-xs text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
                  >
                    Switch network
                  </button>
                </div>
              </div>

              <div className="mt-7 border-y border-zinc-800 py-4">
                {isConnected ? (
                  <>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-zinc-400">Connected with</span>
                      <span className="font-medium text-white">
                        {wallet?.name ?? "Zcash wallet"}
                      </span>
                    </div>
                    <p className="mt-3 break-all font-mono text-xs leading-5 text-zinc-500">
                      {address}
                    </p>
                    {usd && (
                      <p className="mt-3 text-xs text-zinc-400">
                        Estimated value: {usd}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs text-[#3ecf8e]">
                      01
                    </span>
                    <p className="max-w-sm text-sm leading-6 text-zinc-300">
                      Connect a supported wallet to display its current account
                      and balance here. No sample balance is shown.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>Wallet state</span>
                <span className="font-mono text-zinc-300">
                  {isConnected ? "Connected" : "Waiting for connection"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#0d0d10] px-5 py-3 text-[11px] text-zinc-500 sm:px-7">
              <span>React SDK · v0.2.10</span>
              <span>Shielded-first · ZIP-316</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
