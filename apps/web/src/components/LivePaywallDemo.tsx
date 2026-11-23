'use client';

import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Zap,
  RefreshCw,
  Coins,
  FileText,
  HeartHandshake,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import {
  useAccount,
  useBalance,
  useZcashPrice,
  generateZip321Uri,
  getWalletDeepLinks,
  CiceroQRCode,
} from '@cicero-zcash/react';

interface PresetTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: string;
  memo: string;
  description: string;
  badge: string;
}

const DEMO_RECIPIENT =
  'u1q0v6wvg9u04vj945r20s9x2kqu4r73cstfqdfm8e8m57u3a59u39sp4x76scl30f2q39k8cws6k6x8k5g4eexn57k87w7z8f7k';

export const LivePaywallDemo: React.FC = () => {
  const { isConnected, address, wallet } = useAccount();
  const { zec: userBalance } = useBalance();
  const { usdPrice } = useZcashPrice();

  const presets: PresetTier[] = [
    {
      id: 'coffee',
      name: 'Dev Coffee',
      icon: <Coins className="w-4 h-4 text-emerald-400" />,
      amount: '0.005',
      memo: 'Thanks for building Cicero! ☕',
      description: 'Micro-tip support for open-source Zcash tooling',
      badge: 'Micro-Payment',
    },
    {
      id: 'research',
      name: 'Unlock Alpha Memo',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
      amount: '0.02',
      memo: 'PAYWALL:unlock:halo2-zk-alpha-v1',
      description: 'Decrypted technical brief on Halo 2 client recursion',
      badge: 'Protected Content',
    },
    {
      id: 'sponsor',
      name: 'Shielded Sponsor',
      icon: <HeartHandshake className="w-4 h-4 text-cyan-400" />,
      amount: '0.1',
      memo: 'Cicero Sovereign Sponsor Tier #01',
      description: 'Priority feature voting & private repo recognition',
      badge: 'zk-Patron',
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>('research');
  const [amount, setAmount] = useState<string>('0.02');
  const [memo, setMemo] = useState<string>('PAYWALL:unlock:halo2-zk-alpha-v1');
  const [recipient, setRecipient] = useState<string>(DEMO_RECIPIENT);
  const [copiedUri, setCopiedUri] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(true);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'authorizing' | 'proving' | 'settled'
  >('idle');
  const [txHash, setTxHash] = useState<string>('');

  const handleSelectPreset = (p: PresetTier) => {
    setSelectedPreset(p.id);
    setAmount(p.amount);
    setMemo(p.memo);
  };

  // Generate live ZIP-321 URI
  const zip321Uri = useMemo(() => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) return '';
      return generateZip321Uri({
        address: recipient,
        amount: parsedAmount,
        memo: memo.trim() || undefined,
      });
    } catch {
      return `zcash:${recipient}?amount=${amount}`;
    }
  }, [recipient, amount, memo]);

  const deepLinks = useMemo(() => {
    if (!zip321Uri) return { zashi: '', ywallet: '', raw: '' };
    return getWalletDeepLinks(zip321Uri);
  }, [zip321Uri]);

  // Live USD calculated value
  const fiatEstimate = useMemo(() => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || !usdPrice) return '0.00';
    return (parsed * usdPrice).toFixed(2);
  }, [amount, usdPrice]);

  const copyUri = async () => {
    if (!zip321Uri) return;
    try {
      await navigator.clipboard.writeText(zip321Uri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTriggerPayment = async () => {
    setPaymentStatus('authorizing');
    setTimeout(() => {
      setPaymentStatus('proving');
      setTimeout(() => {
        setPaymentStatus('settled');
        setTxHash(
          '9c2b4e87' + Math.random().toString(16).substring(2, 10) + '007a' + Math.random().toString(16).substring(2, 10)
        );
      }, 1200);
    }, 900);
  };

  const handleReset = () => {
    setPaymentStatus('idle');
    setTxHash('');
  };

  return (
    <section id="paywall-demo" className="py-20 bg-[#09090b] relative overflow-hidden border-t border-[#1a1a1e]">
      {/* Glow Backdrop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono font-medium tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive payment demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Build a ZIP-321 payment request
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Configure a recipient, amount, and memo. Cicero builds the payment URI and QR code for compatible wallets. This page demonstrates the request flow; it does not submit a transaction or generate a proof.
          </p>
        </div>

        <p className="mt-8 border-l-2 border-[#3ecf8e] bg-[#101013] px-4 py-3 text-sm leading-6 text-zinc-300" role="note">
          Demo only: no ZEC is transferred. The final unlock is simulated so you can preview a paywall experience.
        </p>

        {/* Studio Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preset Selector & Transaction Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-4 rounded-xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-[#121216] border-emerald-500/60 shadow-[0_0_20px_rgba(62,207,142,0.15)] ring-1 ring-emerald-500/40'
                        : 'bg-[#0f0f12] border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        {p.icon}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                        {p.badge}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-white">{p.name}</div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        {p.amount} ZEC
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-2">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Customizer Box */}
            <div className="p-6 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transaction Parameters</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  ZIP-321 Protocol Ready
                </span>
              </div>

              {/* Recipient Address */}
              <div className="space-y-1.5">
                <label htmlFor="payment-recipient" className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  <span>Merchant Shielded Unified Address (u1)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Demo address</span>
                </label>
                <div className="relative">
                  <input
                    id="payment-recipient"
                    name="recipient"
                    type="text"
                    autoComplete="off"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Amount & Memo Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="payment-amount" className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                    <span>Payment Amount (ZEC)</span>
                    <span className="text-[10px] text-zinc-400 font-mono">≈ ${fiatEstimate} USD</span>
                  </label>
                  <div className="relative">
                    <input
                      id="payment-amount"
                      name="amount"
                      type="number"
                      inputMode="decimal"
                      step="0.001"
                      min="0.0001"
                      value={amount}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setAmount(e.target.value);
                      }}
                      className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-400">
                      ZEC
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="payment-memo" className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                    <span>Encrypted Memo (ZIP-321)</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{memo.length}/512 B</span>
                  </label>
                  <input
                    id="payment-memo"
                    name="memo"
                    type="text"
                    value={memo}
                    onChange={(e) => {
                      setSelectedPreset('custom');
                      setMemo(e.target.value);
                    }}
                    placeholder="Encrypted shielded memo..."
                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Live ZIP-321 URI Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-zinc-400">Constructed ZIP-321 Payment URI:</span>
                  <button
                    onClick={copyUri}
                    type="button"
                    aria-label={copiedUri ? "Payment URI copied" : "Copy payment URI"}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedUri ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Copy URI</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141418] border border-zinc-800 font-mono text-[11px] text-zinc-300 truncate select-all">
                  {zip321Uri || 'zcash:u1...?amount=0.02'}
                </div>
              </div>

              {/* Deep Link Quick Dispatch */}
              <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
                <span className="text-zinc-400 text-[11px]">Direct Handoff:</span>
                <a
                  href={deepLinks.zashi || zip321Uri}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Open Zashi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={deepLinks.ywallet || zip321Uri}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Open Ywallet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] flex items-center gap-1 transition-colors ml-auto"
                >
                  <QrCode className="w-3 h-3 text-emerald-400" />
                  <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Paywall Receiver / Unlock Chamber (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 shadow-2xl relative overflow-hidden space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      paymentStatus === 'settled'
                        ? 'bg-emerald-400 ring-4 ring-emerald-500/20'
                        : paymentStatus === 'proving'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="text-xs font-mono uppercase font-semibold text-white tracking-wider" aria-live="polite">
                    {paymentStatus === 'settled'
                      ? 'Demo flow complete'
                      : paymentStatus === 'proving'
                      ? 'Simulating verification…'
                      : paymentStatus === 'authorizing'
                      ? 'Simulating authorization…'
                      : 'Payment request preview'}
                  </span>
                </div>
                {paymentStatus === 'settled' ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Request ready</span>
                  </span>
                )}
              </div>

              {/* State 1: Locked State with QR and One-Click Dispatch */}
              {paymentStatus !== 'settled' && (
                <div className="space-y-5">
                  {showQr && zip321Uri && (
                    <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-3">
                      <div className="p-2.5 bg-white rounded-lg shadow-inner">
                        <CiceroQRCode
                          value={zip321Uri}
                          size={168}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 text-center">
                        Scan to review a {amount} ZEC payment request in a compatible wallet
                      </p>
                    </div>
                  )}

                  {/* Connected Wallet Bar */}
                  <div className="p-3.5 rounded-xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-zinc-400">Payer Status</div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {isConnected ? (
                          <span>Connected ({wallet?.name})</span>
                        ) : (
                          <span className="text-zinc-400">No Wallet Linked</span>
                        )}
                      </div>
                    </div>
                    {isConnected && (
                      <div className="text-right">
                        <div className="text-[11px] text-zinc-400">Available</div>
                        <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                          {userBalance || '0.00'} ZEC
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleTriggerPayment}
                      disabled={paymentStatus !== 'idle'}
                      className="w-full py-3.5 px-4 rounded-md font-semibold text-sm bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {paymentStatus === 'authorizing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                          <span>Simulating authorization…</span>
                        </>
                      ) : paymentStatus === 'proving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                          <span>Simulating verification…</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-zinc-950" />
                          <span>Run payment simulation ({amount} ZEC)</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-zinc-400 text-center">
                      Simulates authorization and an access grant. No wallet prompt or transaction is created.
                    </p>
                  </div>
                </div>
              )}

              {/* State 2: Unlocked Decrypted Content */}
              {paymentStatus === 'settled' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                      <Unlock className="w-4 h-4" />
                      <span>Simulated access granted</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Preview state only. No transaction, block confirmation, or zero-knowledge proof was generated.
                    </p>
                    <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                      <span>Demo reference:</span>
                      <span className="text-emerald-400">{txHash}</span>
                    </div>
                  </div>

                  {/* Secret Decrypted Payload */}
                  <div className="p-4 rounded-xl bg-[#141418] border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-white">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sample protected content</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">Confidential</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-serif leading-relaxed italic bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                      “This sample content represents material a merchant could show after verifying a real payment.”
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Example content shown after the simulated unlock.</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Paywall Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
