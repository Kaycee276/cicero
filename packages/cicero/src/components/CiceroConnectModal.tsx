import React, { useState, useEffect } from 'react';
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
  } = useCicero();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isConnectModalOpen;
  const handleClose = propOnClose || closeConnectModal;

  const [selectedWalletId, setSelectedWalletId] = useState<string>('zucchini');
  const [customKeyInput, setCustomKeyInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [, setAvailabilityTick] = useState<number>(0);

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

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

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
      } else if (selectedWallet.id === 'zelcore') {
        await connect(selectedWallet.id, customKeyInput.trim() || undefined);
      } else {
        await connect(selectedWallet.id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity z-[99999]"
        onClick={handleClose}
      />

      {/* Modal Surface - Supabase design */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#181818] rounded-xl border border-[#ededed] dark:border-[#262626] shadow-2xl overflow-hidden z-[100000] text-[#171717] dark:text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#171717] dark:bg-[#262626] flex items-center justify-center text-[#3ecf8e]">
              <Shield className="w-4 h-4 fill-[#3ecf8e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#171717] dark:text-white">Connect Zcash Wallet</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#3ecf8e]/15 text-[#24b47e] border border-[#3ecf8e]/30">
                  {network}
                </span>
              </div>
              <p className="text-xs text-[#707070] dark:text-[#a1a1aa] mt-0.5">
                Connect to <strong className="text-[#171717] dark:text-white">{appName}</strong> with your preferred zero-knowledge wallet.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-[#ededed] dark:hover:bg-[#262626] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column RainbowKit Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Left Column: Wallet Selector List (5 cols) */}
          <div className="md:col-span-5 p-3 bg-[#fafafa] dark:bg-[#141414] border-r border-[#ededed] dark:border-[#262626] space-y-1">
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
                  onClick={() => handleWalletSelect(w.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs transition-all ${
                    active
                      ? 'bg-white dark:bg-[#202020] shadow-sm border border-[#dfdfdf] dark:border-[#333] text-[#171717] dark:text-white font-medium'
                      : 'hover:bg-white/60 dark:hover:bg-[#202020]/60 text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{w.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#171717] dark:text-white font-medium">{w.name}</span>
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
          <div className="md:col-span-7 p-6 flex flex-col justify-between bg-white dark:bg-[#181818]">
            <div className="space-y-4">
              {/* Wallet Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#ededed] dark:border-[#262626]">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedWallet.icon}</span>
                  <div>
                    <h4 className="text-base font-semibold text-[#171717] dark:text-white">
                      {selectedWallet.name}
                    </h4>
                    <p className="text-xs text-[#707070] dark:text-[#a1a1aa] mt-0.5">
                      {selectedWallet.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
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

              {/* 2. Zelcore Wallet (Multi-Asset Browser Extension) */}
              {selectedWallet.id === 'zelcore' && (
                <div className="space-y-4 py-2">
                  {isAvailable ? (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-[#24b47e]" />
                        <span>Zelcore Extension Detected</span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        Zelcore browser extension was detected. Click connect to authorize, or specify your Zelcore ZEC address below.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] text-xs text-[#707070] dark:text-[#a1a1aa] space-y-3">
                      <p>
                        Zelcore browser extension was not detected on this page. If you recently installed it, please refresh your tab or paste your Zelcore ZEC address below.
                      </p>
                      {selectedWallet.downloadUrl && (
                        <a
                          href={selectedWallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] dark:bg-[#2a2a2a] text-white text-xs font-medium hover:bg-[#212121] dark:hover:bg-[#333]"
                        >
                          <span>Zelcore Download Page</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-[#171717] dark:text-white block">
                      Zelcore ZEC Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      placeholder="Paste your t1... transparent address from Zelcore"
                      className="w-full p-2.5 rounded-md bg-white dark:bg-[#141414] border border-[#dfdfdf] dark:border-[#333] font-mono text-xs text-[#171717] dark:text-white focus:outline-none focus:border-[#3ecf8e]"
                    />
                    <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa]">
                      Zelcore manages transparent ZEC addresses (t1). Cicero connects to read balances and generate payment requests.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Mobile Wallets (Zashi or Ywallet via ZIP-321 QR) */}
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
              <span className="text-[11px] text-[#9a9a9a] dark:text-[#71717a]">
                End-to-End Encrypted
              </span>

              <button
                onClick={handleConnectAction}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#3ecf8e] text-[#171717] font-semibold text-xs hover:bg-[#24b47e] transition-colors disabled:opacity-50 shadow-sm"
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
