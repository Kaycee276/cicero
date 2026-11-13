import React, { useState } from 'react';
import {
  Shield,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
} from 'lucide-react';
import { CiceroQRCode } from './CiceroQRCode';
import { CiceroPayProps } from '../types';
import { useCiceroPayment } from '../hooks/useCiceroPayment';
import { truncateAddress } from '../utils/address';
import { useZcashPrice } from '../hooks/useZcashPrice';

export const CiceroInvoice: React.FC<CiceroPayProps> = ({
  recipient,
  amount,
  memo,
  message,
  network = 'mainnet',
  expiresInSeconds = 900,
  showUsd = true,
  invoiceId,
  customRpcUrl,
  onSuccess,
  onError,
  onStatusChange,
  className = '',
}) => {
  const [copiedType, setCopiedType] = useState<'address' | 'uri' | 'memo' | null>(null);
  const { convertZecToUsd } = useZcashPrice(showUsd);

  const {
    status,
    txId,
    secondsRemaining,
    zip321Uri,
    addressType,
    isShielded,
    memoValidation,
    simulateDetection,
    resetPayment,
  } = useCiceroPayment({
    recipient,
    amount,
    memo,
    message,
    network,
    expiresInSeconds,
    invoiceId,
    customRpcUrl,
    onSuccess,
    onError,
    onStatusChange,
  });

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
    <div
      className={`bg-white rounded-xl border border-[#ededed] shadow-sm overflow-hidden text-[#171717] font-sans ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ededed] bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#171717] flex items-center justify-center text-[#3ecf8e]">
            <Shield className="w-3.5 h-3.5 fill-[#3ecf8e]" />
          </div>
          <div>
            <span className="font-medium text-xs text-[#171717]">Shielded Zcash Invoice</span>
            {invoiceId && (
              <span className="text-[10px] text-[#707070] ml-2 font-mono">#{invoiceId}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#dfdfdf] text-[#171717]">
            {addressType === 'unified' ? 'Unified' : addressType === 'sapling' ? 'Sapling' : 'Transparent'}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#3ecf8e]/15 text-[#24b47e] border border-[#3ecf8e]/30">
            {isShielded ? 'zk-Shielded' : 'Transparent'}
          </span>
          {network === 'testnet' && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Testnet
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {status === 'confirmed' ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#3ecf8e]/15 border border-[#3ecf8e]/40 flex items-center justify-center text-[#24b47e]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#171717]">Payment Verified!</h4>
              <p className="text-xs text-[#707070] mt-0.5">
                Shielded transaction detected and settled on-chain.
              </p>
            </div>
            {txId && (
              <div className="font-mono text-[11px] p-2 bg-[#fafafa] rounded border border-[#ededed] text-[#707070] break-all">
                {txId}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Amount card */}
            <div className="flex items-center justify-between p-3.5 bg-[#fafafa] rounded-lg border border-[#ededed]">
              <div>
                <span className="text-[10px] text-[#707070] uppercase font-mono tracking-wider">Amount Due</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-semibold tracking-tight text-[#171717] font-mono">
                    {amount} <span className="text-xs font-normal text-[#707070]">ZEC</span>
                  </span>
                  {usdValue && (
                    <span className="text-xs text-[#707070] font-mono">≈ ${usdValue} USD</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[#707070] font-mono text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            {/* QR and actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <CiceroQRCode value={zip321Uri} size={140} />
              <div className="space-y-2.5 w-full">
                <a
                  href={zip321Uri}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-md bg-[#171717] text-white text-xs font-medium hover:bg-[#212121] transition-colors"
                >
                  <span>Pay with Wallet App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#3ecf8e]" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyToClipboard(zip321Uri, 'uri')}
                    className="py-1.5 px-2 rounded-md border border-[#ededed] hover:bg-[#fafafa] text-[11px] font-medium text-[#171717] transition-colors flex items-center justify-center gap-1"
                  >
                    {copiedType === 'uri' ? (
                      <Check className="w-3 h-3 text-[#24b47e]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#707070]" />
                    )}
                    <span>{copiedType === 'uri' ? 'Copied' : 'Copy URI'}</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(recipient, 'address')}
                    className="py-1.5 px-2 rounded-md border border-[#ededed] hover:bg-[#fafafa] text-[11px] font-medium text-[#171717] transition-colors flex items-center justify-center gap-1"
                  >
                    {copiedType === 'address' ? (
                      <Check className="w-3 h-3 text-[#24b47e]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#707070]" />
                    )}
                    <span>{copiedType === 'address' ? 'Copied' : 'Copy Addr'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#707070] font-mono truncate">
                  To: {truncateAddress(recipient, 10, 8)}
                </div>
              </div>
            </div>

            {/* Memo */}
            {memo && (
              <div className="p-2.5 bg-[#fafafa] rounded-md border border-[#ededed] text-xs">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#171717] mb-0.5">
                  <Lock className="w-3 h-3 text-[#3ecf8e]" />
                  <span>Encrypted Memo</span>
                </div>
                <div className="font-mono text-[11px] text-[#171717]">{memo}</div>
              </div>
            )}

            {/* Warning if any */}
            {memoValidation.warning && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                <span>{memoValidation.warning}</span>
              </div>
            )}

            {/* Expired state */}
            {status === 'expired' && (
              <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Invoice has expired</span>
                </div>
                <button
                  onClick={resetPayment}
                  className="px-2 py-0.5 text-[11px] font-medium rounded bg-[#171717] text-white hover:bg-[#212121]"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Demo bar */}
            <div className="pt-2 border-t border-[#ededed] flex items-center justify-between text-[11px] text-[#707070]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#3ecf8e]" />
                Demo test
              </span>
              <button
                onClick={simulateDetection}
                className="px-2 py-0.5 rounded border border-[#dfdfdf] hover:border-[#3ecf8e] text-[#171717] bg-white transition-colors"
              >
                Simulate Success
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
