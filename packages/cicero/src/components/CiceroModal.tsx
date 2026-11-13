import React, { useState, useEffect } from 'react';
import {
  Shield,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CiceroQRCode } from './CiceroQRCode';
import { PaymentStatus, ZcashNetwork } from '../types';
import { truncateAddress } from '../utils/address';
import { useZcashPrice } from '../hooks/useZcashPrice';

export interface CiceroModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: string;
  amount: number | string;
  memo?: string;
  message?: string;
  network?: ZcashNetwork;
  status: PaymentStatus;
  txId: string | null;
  secondsRemaining: number;
  zip321Uri: string;
  addressType: string;
  isShielded: boolean;
  memoValidation: { valid: boolean; warning?: string; byteLength: number };
  onSimulateDetection?: () => void;
  onResetPayment?: () => void;
  title?: string;
  subtitle?: string;
  showUsd?: boolean;
}

export const CiceroModal: React.FC<CiceroModalProps> = ({
  isOpen,
  onClose,
  recipient,
  amount,
  memo,
  message,
  network = 'mainnet',
  status,
  txId,
  secondsRemaining,
  zip321Uri,
  addressType,
  isShielded,
  memoValidation,
  onSimulateDetection,
  onResetPayment,
  title = 'Pay with Shielded Zcash',
  subtitle = 'Zero-Knowledge, Confidential Checkout',
  showUsd = true,
}) => {
  const [copiedType, setCopiedType] = useState<'address' | 'uri' | 'memo' | null>(null);
  const { convertZecToUsd } = useZcashPrice(showUsd);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, type: 'address' | 'uri' | 'memo') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // fallback
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const usdValue = convertZecToUsd(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface - Supabase clean canvas */}
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-[#ededed] shadow-2xl overflow-hidden z-10 text-[#171717] font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ededed] bg-[#fafafa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#171717] flex items-center justify-center text-[#3ecf8e]">
              <Shield className="w-4 h-4 fill-[#3ecf8e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[#171717]">{title}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#3ecf8e]/15 text-[#24b47e] border border-[#3ecf8e]/30">
                  {isShielded ? 'zk-Shielded' : 'Transparent'}
                </span>
                {network === 'testnet' && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Testnet
                  </span>
                )}
              </div>
              <p className="text-xs text-[#707070] mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#707070] hover:text-[#171717] hover:bg-[#ededed] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-6 py-2.5 bg-white border-b border-[#ededed] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {status === 'pending' && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ecf8e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#24b47e]"></span>
                </span>
                <span className="text-[#707070]">Listening for transaction...</span>
              </>
            )}
            {status === 'detected' && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-800 font-medium">Transaction spotted in mempool! Confirming...</span>
              </>
            )}
            {status === 'confirmed' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#24b47e]" />
                <span className="text-[#24b47e] font-medium">Payment Confirmed On-Chain!</span>
              </>
            )}
            {status === 'expired' && (
              <>
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span className="text-rose-600 font-medium">Payment window expired</span>
              </>
            )}
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-1 text-[#707070] font-mono text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Confirmed State View */}
          {status === 'confirmed' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#3ecf8e]/15 border border-[#3ecf8e]/40 flex items-center justify-center text-[#24b47e] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#171717]">Payment Received & Shielded!</h3>
                <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1">
                  Your transaction has been verified using zero-knowledge proofs. No sender or recipient address was leaked.
                </p>
              </div>

              {txId && (
                <div className="p-3 bg-[#fafafa] rounded-md border border-[#ededed] text-left">
                  <div className="flex items-center justify-between text-[11px] text-[#707070] mb-1">
                    <span>Transaction Hash</span>
                    <span className="text-[#24b47e] font-mono">Shielded Note</span>
                  </div>
                  <div className="font-mono text-xs text-[#171717] break-all">
                    {txId}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-md bg-[#3ecf8e] text-[#171717] font-medium text-sm hover:bg-[#24b47e] transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <>
              {/* Payment Amount Card */}
              <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg border border-[#ededed]">
                <div>
                  <span className="text-xs text-[#707070] uppercase font-mono tracking-wider">Total Amount</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-semibold tracking-tight text-[#171717] font-mono">
                      {amount} <span className="text-sm font-normal text-[#707070]">ZEC</span>
                    </span>
                    {usdValue && (
                      <span className="text-xs text-[#707070] font-mono">
                        ≈ ${usdValue} USD
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#707070] block font-mono">Address Standard</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-mono font-medium rounded bg-white border border-[#dfdfdf] text-[#171717]">
                    {addressType === 'unified' ? 'Unified (ZIP-316)' : addressType === 'sapling' ? 'Sapling (Shielded)' : 'Transparent'}
                  </span>
                </div>
              </div>

              {/* Optional Order / Invoice Message */}
              {message && (
                <div className="px-3.5 py-2 bg-[#fafafa] rounded-md border border-[#ededed] text-xs text-[#707070]">
                  <span className="font-medium text-[#171717]">Order Note: </span>
                  <span>{message}</span>
                </div>
              )}

              {/* QR Code & Mobile Deep Link */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-lg border border-[#ededed] bg-white">
                <div className="flex-shrink-0">
                  <CiceroQRCode value={zip321Uri} size={150} />
                </div>

                <div className="space-y-3 w-full text-center sm:text-left">
                  <div>
                    <h4 className="text-sm font-medium text-[#171717] flex items-center justify-center sm:justify-start gap-1.5">
                      <span>Scan with Shielded Wallet</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#3ecf8e]" />
                    </h4>
                    <p className="text-xs text-[#707070] mt-0.5 leading-relaxed">
                      Compatible with <strong className="text-[#171717]">Zashi</strong>, <strong className="text-[#171717]">Ywallet</strong>, or any ZIP-321 compliant Zcash wallet.
                    </p>
                  </div>

                  {/* Deep link button */}
                  <a
                    href={zip321Uri}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-md bg-[#171717] text-white text-xs font-medium hover:bg-[#212121] transition-colors"
                  >
                    <span>Open in Mobile / Desktop Wallet</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(zip321Uri, 'uri')}
                      className="flex-1 py-1.5 px-2.5 rounded-md border border-[#ededed] hover:border-[#dfdfdf] hover:bg-[#fafafa] text-xs font-medium text-[#171717] transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedType === 'uri' ? (
                        <>
                          <Check className="w-3 h-3 text-[#24b47e]" />
                          <span className="text-[#24b47e]">Copied URI</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#707070]" />
                          <span>Copy ZIP-321 URI</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(recipient, 'address')}
                      className="flex-1 py-1.5 px-2.5 rounded-md border border-[#ededed] hover:border-[#dfdfdf] hover:bg-[#fafafa] text-xs font-medium text-[#171717] transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedType === 'address' ? (
                        <>
                          <Check className="w-3 h-3 text-[#24b47e]" />
                          <span className="text-[#24b47e]">Copied Address</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#707070]" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Recipient Address Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#707070]">
                  <span>Recipient Address</span>
                  <span className="font-mono text-[11px]">{truncateAddress(recipient, 12, 10)}</span>
                </div>
                <div className="p-2 bg-[#fafafa] rounded-md border border-[#ededed] font-mono text-[11px] text-[#171717] break-all select-all">
                  {recipient}
                </div>
              </div>

              {/* Encrypted Memo Section (if present) */}
              {memo && (
                <div className="space-y-1.5 text-xs p-3 rounded-md bg-[#fafafa] border border-[#ededed]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                      <Lock className="w-3 h-3 text-[#3ecf8e]" />
                      <span>Encrypted Memo</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#707070]">
                      {memoValidation.byteLength}/512 bytes
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#171717] bg-white p-2 rounded border border-[#dfdfdf]">
                    {memo}
                  </p>
                  <p className="text-[11px] text-[#707070]">
                    Only the recipient holding the viewing/spending key can decrypt this message on-chain.
                  </p>
                </div>
              )}

              {/* Warning if transparent with memo */}
              {memoValidation.warning && (
                <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <span>{memoValidation.warning}</span>
                </div>
              )}

              {/* Hackathon Developer Testing Tool Bar */}
              <div className="pt-2 border-t border-[#ededed] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-[#707070]">
                  <Zap className="w-3 h-3 text-[#3ecf8e]" />
                  <span>Demo Controls:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onSimulateDetection}
                    className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#dfdfdf] hover:border-[#3ecf8e] hover:text-[#24b47e] bg-white text-[#171717] transition-colors"
                  >
                    Simulate Payment
                  </button>
                  {status === 'expired' && (
                    <button
                      onClick={onResetPayment}
                      className="px-2.5 py-1 text-[11px] font-medium rounded bg-[#171717] text-white hover:bg-[#212121] transition-colors"
                    >
                      Refresh
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
