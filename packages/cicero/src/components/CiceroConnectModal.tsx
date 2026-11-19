import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  Shield,
  Sparkles,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useCicero } from '../context/CiceroContext';
import { CiceroQRCode } from './CiceroQRCode';
import { ZucchiniWalletAdapter } from '../wallet/zucchini';
import { getContrastTextColor, normalizeHexColor } from '../utils/color';

export interface CiceroConnectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CiceroConnectModal: React.FC<CiceroConnectModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    isConnectModalOpen,
    closeConnectModal,
    wallets,
    connect,
    network,
    appName,
    modalAppearance,
  } = useCicero();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isConnectModalOpen;
  const handleClose = propOnClose || closeConnectModal;
  const accentColor = normalizeHexColor(
    modalAppearance.accentColor,
    modalAppearance.variant === 'gold' ? '#f59e0b' : '#3ecf8e'
  );
  const modalWidth = {
    sm: 'max-w-xl',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
  }[modalAppearance.size];
  const modalRadius = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-2xl',
  }[modalAppearance.radius];

  const [selectedWalletId, setSelectedWalletId] = useState<string>('zucchini');
  const [customKeyInput, setCustomKeyInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [, setAvailabilityTick] = useState<number>(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live detection of extension readiness (e.g. user unlocks wallet while modal is open)
  useEffect(() => {
    if (!isOpen) return;

    const cleanupReady = ZucchiniWalletAdapter.onReady(() => {
      setAvailabilityTick((t) => t + 1);
    });

    const interval = setInterval(() => {
      setAvailabilityTick((t) => t + 1);
    }, 600);

    return () => {
      cleanupReady();
      clearInterval(interval);
    };
  }, [isOpen]);

  // Keep keyboard focus inside the dialog and restore it to its trigger on close.
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const getFocusable = () => Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    getFocusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, mounted, handleClose]);

  if (!isOpen || !mounted) return null;

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) || wallets[0];
  const isAvailable = selectedWallet?.isAvailable();

  const handleWalletSelect = (walletId: string) => {
    setSelectedWalletId(walletId);
    setError(null);
  };

  const handleConnectAction = async () => {
    if (!selectedWallet) return;
    setError(null);
    setIsSubmitting(true);

    try {
      if (selectedWallet.id === 'viewing-key') {
        if (!customKeyInput.trim()) {
          throw new Error('Please enter a valid Unified Address or Viewing Key.');
        }
        await connect(selectedWallet.id, customKeyInput.trim());
      } else if (selectedWallet.id === 'zelcore' || selectedWallet.id === 'noir') {
        await connect(selectedWallet.id, customKeyInput.trim() || undefined);
      } else {
        await connect(selectedWallet.id);
      }
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="dark fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-4 font-sans sm:p-6"
      style={{ '--cicero-accent': accentColor } as React.CSSProperties}
    >
      {/* Backdrop */}
              <button
                type="button"
        aria-label="Close wallet connection dialog"
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity z-[99999]"
        onClick={handleClose}
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cicero-connect-title"
        aria-describedby="cicero-connect-description"
        ref={dialogRef}
        tabIndex={-1}
        className={`relative z-[100000] w-full ${modalWidth} ${modalRadius} overflow-hidden border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0d0d10] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            {modalAppearance.showIcon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900" style={{ color: accentColor }}>
                <Shield aria-hidden="true" className="h-4 w-4 fill-current" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span id="cicero-connect-title" className="text-sm font-semibold text-white">Connect Zcash Wallet</span>
                <span className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                  {network}
                </span>
              </div>
              <p id="cicero-connect-description" className="mt-1 text-xs text-zinc-400">
                Connect to <strong className="font-medium text-zinc-200">{appName}</strong> with your preferred wallet.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cicero-accent)]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column RainbowKit Layout */}
        <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-12">
          {/* Left Column: Wallet Selector List (5 cols) */}
          <div className="space-y-1 border-r border-zinc-800 bg-[#0c0c0e] p-3 md:col-span-5">
            <div className="px-3 py-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#707070] dark:text-[#a1a1aa]">
              <span>Wallets</span>
              {wallets.some((w) => w.isAvailable()) ? (
                <span className="text-[10px] text-[#24b47e] font-semibold flex items-center gap-1 normal-case">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#24b47e] animate-pulse"></span>
                  <span>Extension found</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#9a9a9a] dark:text-[#71717a] font-normal normal-case">
                  Browser scan ready
                </span>
              )}
            </div>

            {wallets.map((w) => {
              const active = w.id === selectedWalletId;
              const available = w.isAvailable();

              return (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleWalletSelect(w.id)}
                  style={active ? { borderColor: accentColor } : undefined}
                  className={`w-full flex items-center justify-between rounded-md border p-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cicero-accent)] ${
                    active
                      ? 'bg-[#18181b] text-white font-medium'
                      : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{w.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-zinc-100">{w.name}</span>
                        {w.category === 'extension' && available && (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            Detected
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#9a9a9a] dark:text-[#71717a] line-clamp-1">
                        {w.category === 'extension'
                          ? 'Browser Extension'
                          : w.category === 'mobile'
                          ? 'Mobile / QR'
                          : w.category === 'read-only'
                          ? 'Auditor View'
                          : 'Dev Session'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Wallet Connection Screen (7 cols) */}
          <div className="flex flex-col justify-between bg-[#111114] p-5 sm:p-6 md:col-span-7">
            <div className="space-y-4">
              {/* Wallet Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedWallet.icon}</span>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {selectedWallet.name}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400">
                      {selectedWallet.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-md border border-rose-900 bg-rose-950/40 p-3 text-xs text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Specific Content by Wallet Type */}

              {/* 1. Zucchini Wallet (Browser Extension) */}
              {selectedWallet.id === 'zucchini' && (
                <div className="space-y-4 py-2">
                  {isAvailable ? (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-[#24b47e]" />
                        <span>Extension Detected & Ready</span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        Clicking connect will prompt your Zucchini Wallet side-panel to authorize access.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] text-xs text-[#707070] dark:text-[#a1a1aa] space-y-3">
                      <p>
                        Zucchini Wallet extension was not detected in this browser. Install it to enable 1-click in-browser approvals.
                      </p>
                      {selectedWallet.downloadUrl && (
                        <a
                          href={selectedWallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] dark:bg-[#2a2a2a] text-white text-xs font-medium hover:bg-[#212121] dark:hover:bg-[#333]"
                        >
                          <span>Install from Chrome Web Store</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Noir Wallet (Native Zcash Privacy Browser Extension) */}
              {selectedWallet.id === 'noir' && (
                <div className="space-y-4 py-2">
                  {isAvailable ? (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-[#24b47e]" />
                        <span>Noir Wallet Extension Detected</span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        Noir Wallet extension was detected. Clicking connect will prompt your Noir extension popup to authorize this application.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] text-xs text-[#707070] dark:text-[#a1a1aa] space-y-3">
                      <p>
                        Noir Wallet extension was not detected in this browser. Install it to enable 1-click in-browser shielded Zcash approvals.
                      </p>
                      {selectedWallet.downloadUrl && (
                        <a
                          href={selectedWallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] dark:bg-[#2a2a2a] text-white text-xs font-medium hover:bg-[#212121] dark:hover:bg-[#333]"
                        >
                          <span>Install Noir from Chrome Web Store</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-[#171717] dark:text-white block">
                      Orchard / Unified Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      placeholder="Paste u1... address from Noir (or connect via popup)"
                      className="w-full p-2.5 rounded-md bg-white dark:bg-[#141414] border border-[#dfdfdf] dark:border-[#333] font-mono text-xs text-[#171717] dark:text-white focus:outline-none focus:border-[#3ecf8e]"
                    />
                    <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">
                      Noir Wallet supports zero-knowledge shielded Orchard pools and ZECFi applications.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Zelcore Wallet (Multi-Asset Browser Extension & Desktop) */}
              {selectedWallet.id === 'zelcore' && (
                <div className="space-y-4 py-2">
                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>⚠️ Zelcore Compatibility Note</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Zelcore is a multi-asset wallet operating primarily on <strong>Mainnet</strong> for transparent Zcash (<code className="font-mono">t1...</code>) and unified addresses. Because the Zelcore browser extension does <em>not</em> provide an in-browser Zcash dApp signing RPC popup (it only injects EVM/Solana), connection is established via your Zelcore ZEC address below.
                    </p>
                  </div>

                  {isAvailable ? (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#24b47e] flex-shrink-0" />
                        <span className="font-semibold">Zelcore Extension Installed</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] text-xs text-[#707070] dark:text-[#a1a1aa] flex items-center justify-between">
                      <span>Zelcore desktop or mobile user?</span>
                      {selectedWallet.downloadUrl && (
                        <a
                          href={selectedWallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#3ecf8e] hover:underline"
                        >
                          <span>Get Zelcore</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-[#171717] dark:text-white">
                        Zelcore ZEC Address <span className="text-[11px] font-normal text-[#707070] dark:text-[#a1a1aa]">(Optional)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              if (text) setCustomKeyInput(text.trim());
                            } catch {
                              // clipboard access denied or unsupported
                            }
                          }}
                          className="text-[11px] text-[#3ecf8e] hover:text-[#24b47e] font-medium"
                        >
                          Paste Clipboard
                        </button>
                        <span className="text-[#999]">•</span>
                        <button
                          type="button"
                          onClick={() => setCustomKeyInput('t1VpwtxdvWvd8CV4ndr4wPGeF47pTWB5yRz')}
                          className="text-[11px] text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white font-mono underline"
                        >
                          Demo t1 address
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={customKeyInput}
                      onChange={(e) => {
                        setCustomKeyInput(e.target.value);
                        setError(null);
                      }}
                      placeholder="Paste your t1... address (or leave blank to use default)"
                      className="w-full p-2.5 rounded-md bg-white dark:bg-[#141414] border border-[#dfdfdf] dark:border-[#333] font-mono text-xs text-[#171717] dark:text-white focus:outline-none focus:border-[#3ecf8e]"
                    />

                    {/* Dynamic address type badge */}
                    {customKeyInput.trim() ? (
                      <div className="text-[11px]">
                        {customKeyInput.trim().startsWith('t1') ? (
                          <span className="text-[#24b47e] font-medium flex items-center gap-1">
                            ✓ Transparent Zcash address detected (Zelcore native)
                          </span>
                        ) : customKeyInput.trim().startsWith('u1') ? (
                          <span className="text-[#24b47e] font-medium flex items-center gap-1">
                            ✓ Unified Zcash address detected
                          </span>
                        ) : customKeyInput.trim().startsWith('utest1') || customKeyInput.trim().startsWith('tm') ? (
                          <span className="text-amber-500 font-medium flex items-center gap-1">
                            ℹ️ Testnet address detected (Zelcore operates on Mainnet)
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">
                            ℹ️ Custom address will be bound to this Zelcore session
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                        Click <strong>Connect</strong> below to connect immediately, or paste your own address from Zelcore (Portfolio → Zcash → Receive).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Mobile Wallets (Zashi or Ywallet via ZIP-321 QR) */}
              {(selectedWallet.id === 'zashi' || selectedWallet.id === 'ywallet') && (
                <div className="text-center space-y-3 py-1">
                  <div className="flex justify-center p-3 bg-white rounded-lg inline-block mx-auto border border-[#ededed] dark:border-[#333]">
                    <CiceroQRCode
                      value={`zcash:u1demo?message=Connect%20to%20${encodeURIComponent(appName || 'Cicero App')}`}
                      size={140}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#171717] dark:text-white">
                      Scan with {selectedWallet.name} app
                    </p>
                    <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa] mt-0.5">
                      Open {selectedWallet.name} on your device and scan this QR code to authenticate.
                    </p>
                    <p className="text-[10px] text-[#9a9a9a] dark:text-[#71717a] mt-2 leading-relaxed">
                      Browsers sandbox websites from querying local OS applications. Mobile & desktop wallets connect securely via zero-knowledge QR handoff.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Viewing Key / Auditor Mode */}
              {selectedWallet.id === 'viewing-key' && (
                <div className="space-y-3 py-2 text-xs">
                  <div>
                    <label className="font-medium text-[#171717] dark:text-white block mb-1">
                      Unified Address or Viewing Key
                    </label>
                    <textarea
                      rows={3}
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      placeholder="Paste u1... address, zxviews... or uview... key"
                      className="w-full p-2.5 rounded-md bg-white dark:bg-[#141414] border border-[#dfdfdf] dark:border-[#333] font-mono text-xs text-[#171717] dark:text-white focus:outline-none focus:border-[#3ecf8e]"
                    />
                  </div>
                  <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">
                    Read-only connection for tax calculation, accounting reconciliation, or proof-of-reserves.
                  </p>
                </div>
              )}

              {/* 4. Burner / Dev Wallet */}
              {selectedWallet.id === 'burner' && (
                <div className="space-y-3 py-2 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] space-y-1.5">
                    <span className="font-semibold text-[#171717] dark:text-white">Ephemeral Shielded Test Wallet</span>
                    <p className="text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
                      Instantly creates an in-memory session wallet pre-funded with simulated testnet ZEC. Perfect for testing dApps without needing external extensions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Connect Action Button */}
            <div className="pt-4 border-t border-[#ededed] dark:border-[#262626] mt-4 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                Wallet approval stays with your selected wallet
              </span>

                <button
                  type="button"
                onClick={handleConnectAction}
                disabled={isSubmitting}
                style={{ backgroundColor: accentColor, color: getContrastTextColor(accentColor) }}
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-sm transition-colors hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114] disabled:cursor-wait disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#171717]/30 border-t-[#171717] rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedWallet.id === 'viewing-key'
                        ? 'Connect Read-Only'
                        : selectedWallet.id === 'burner'
                        ? 'Launch Dev Session'
                        : `Connect ${selectedWallet.name}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
