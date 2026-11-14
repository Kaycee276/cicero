import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Copy,
  Check,
  LogOut,
  ExternalLink,
  Shield,
  RefreshCw,
  QrCode,
  ArrowRightLeft,
} from 'lucide-react';
import { useCicero } from '../context/CiceroContext';
import { truncateAddress } from '../utils/address';
import { CiceroQRCode } from './CiceroQRCode';

export interface CiceroAccountModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CiceroAccountModal: React.FC<CiceroAccountModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    isAccountModalOpen,
    closeAccountModal,
    address,
    wallet,
    network,
    switchNetwork,
    balance,
    refetchBalance,
    disconnect,
  } = useCicero();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAccountModalOpen;
  const handleClose = propOnClose || closeAccountModal;

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [manualNotice, setManualNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setManualNotice(null);
  }, [network, isOpen]);

  const handleNetworkChange = async (targetNet: 'mainnet' | 'testnet') => {
    if (targetNet === network) {
      setManualNotice(null);
      return;
    }
    const res = await switchNetwork(targetNet);
    if (res?.requiresManualSwitch) {
      setManualNotice(
        `Wallet is currently active on ${network === 'mainnet' ? 'Mainnet' : 'Testnet'}. Switch network inside your extension settings (Settings → Network) and Cicero will automatically update your balance.`
      );
    } else {
      setManualNotice(null);
    }
  };

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

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity z-[99999]"
        onClick={handleClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-xl border border-[#ededed] dark:border-[#262626] shadow-2xl overflow-hidden z-[100000] text-[#171717] dark:text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ededed] dark:border-[#262626] bg-[#fafafa] dark:bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{wallet?.icon || '🛡️'}</span>
            <div>
              <span className="font-semibold text-sm text-[#171717] dark:text-white">
                {wallet?.name || 'Zcash Wallet'}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#707070] dark:text-[#a1a1aa]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24b47e]"></span>
                <span>Connected</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-[#ededed] dark:hover:bg-[#262626] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Balance Display */}
          <div className="p-4 rounded-lg bg-[#fafafa] dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#2b2b2b] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#707070] dark:text-[#a1a1aa]">
              <span>Shielded Balance</span>
              <button
                onClick={() => refetchBalance()}
                className="hover:text-[#171717] dark:hover:text-white p-0.5"
                title="Refresh balance"
              >
                <RefreshCw
                  className={`w-3 h-3 ${balance.isLoading ? 'animate-spin text-[#3ecf8e]' : ''}`}
                />
              </button>
            </div>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#171717] dark:text-white tracking-tight">
                {balance.zec}
              </span>
              <span className="text-sm font-medium text-[#707070] dark:text-[#a1a1aa]">ZEC</span>
            </div>
            {balance.usd && (
              <p className="text-xs text-[#707070] dark:text-[#a1a1aa] font-mono">≈ ${balance.usd} USD</p>
            )}
          </div>

          {/* Connected Address Card */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#707070] dark:text-[#a1a1aa]">
              <span>Your Shielded Address</span>
              <button
                onClick={() => setShowQr(!showQr)}
                className="flex items-center gap-1 text-[#24b47e] hover:underline"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
              </button>
            </div>

            {address ? (
              <div className="p-3 bg-[#fafafa] dark:bg-[#141414] rounded-md border border-[#ededed] dark:border-[#2b2b2b] font-mono text-xs text-[#171717] dark:text-white break-all select-all flex items-center justify-between gap-2">
                <span className="truncate">{truncateAddress(address, 16, 12)}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 rounded hover:bg-white dark:hover:bg-[#202020] text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white transition-colors flex-shrink-0"
                  title="Copy full address"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#24b47e]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#fafafa] dark:bg-[#141414] rounded-md border border-[#ededed] dark:border-[#2b2b2b] text-xs text-[#707070] dark:text-[#a1a1aa]">
                Connected in Read-Only Mode
              </div>
            )}

            {/* Expandable Receive QR */}
            {showQr && address && (
              <div className="pt-2 flex justify-center p-3 bg-white rounded-lg inline-block mx-auto border border-[#ededed] dark:border-[#333]">
                <CiceroQRCode value={`zcash:${address}`} size={150} />
              </div>
            )}

            {/* Shielded badge & Explorer link */}
            {address && (
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="flex items-center gap-1 text-[#707070] dark:text-[#a1a1aa]">
                  <Shield className="w-3 h-3 text-[#3ecf8e]" />
                  <span>zk-Shielded Address</span>
                </span>
                <a
                  href={
                    network === 'testnet'
                      ? `https://blockexplorer.one/zcash/testnet/address/${address}`
                      : `https://blockchair.com/zcash/address/${address}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#24b47e] hover:underline"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Network Switcher Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#ededed] dark:border-[#262626] bg-white dark:bg-[#1f1f1f] text-xs">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#707070] dark:text-[#a1a1aa]" />
                <span className="text-[#171717] dark:text-white font-medium">Active Network</span>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded bg-[#fafafa] dark:bg-[#141414] border border-[#dfdfdf] dark:border-[#333]">
                <button
                  type="button"
                  onClick={() => handleNetworkChange('mainnet')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    network === 'mainnet'
                      ? 'bg-white dark:bg-[#262626] shadow-sm text-[#24b47e] font-semibold'
                      : 'text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  Mainnet
                </button>
                <button
                  type="button"
                  onClick={() => handleNetworkChange('testnet')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    network === 'testnet'
                      ? 'bg-white dark:bg-[#262626] shadow-sm text-amber-700 dark:text-amber-400 font-semibold'
                      : 'text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  Testnet
                </button>
              </div>
            </div>

            {manualNotice && (
              <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed animate-in fade-in">
                <span>{manualNotice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Disconnect */}
        <div className="px-6 py-3.5 bg-[#fafafa] dark:bg-[#141414] border-t border-[#ededed] dark:border-[#262626] flex items-center justify-between">
          <button
            onClick={disconnect}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect Wallet</span>
          </button>

          <button
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-md border border-[#dfdfdf] dark:border-[#333] bg-white dark:bg-[#202020] hover:bg-[#fafafa] dark:hover:bg-[#282828] text-xs font-medium text-[#171717] dark:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
