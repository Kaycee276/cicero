import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { useCicero } from '../context/CiceroContext';
import { truncateAddress } from '../utils/address';
import { CiceroButtonVariant, CiceroButtonRadius } from '../types';

export interface CiceroConnectButtonProps {
  label?: string;
  variant?: CiceroButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  radius?: CiceroButtonRadius;
  showBalance?: boolean;
  showNetwork?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const CiceroConnectButton: React.FC<CiceroConnectButtonProps> = ({
  label = 'Connect Zcash Wallet',
  variant = 'primary',
  size = 'md',
  radius = 'md',
  showBalance = true,
  showNetwork = true,
  showIcon = true,
  className = '',
}) => {
  const {
    account,
    address,
    isConnected,
    isConnecting,
    network,
    balance,
    openConnectModal,
    openAccountModal,
  } = useCicero();

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const connectedSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  }[size];

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-[4px]',
    md: 'rounded-[6px]',
    lg: 'rounded-[12px]',
    full: 'rounded-full',
  }[radius];

  const variantClasses: Record<CiceroButtonVariant, string> = {
    primary:
      'bg-[#3ecf8e] text-[#171717] hover:bg-[#24b47e] font-semibold shadow-sm',
    outline:
      'bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-white border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] hover:bg-[#fafafa] dark:hover:bg-[#252525] font-medium shadow-sm',
    dark:
      'bg-[#1c1c1c] text-white hover:bg-[#242424] border border-[#2b2b2b] font-medium shadow-sm',
    ghost:
      'bg-transparent hover:bg-[#fafafa] dark:hover:bg-[#252525] text-[#171717] dark:text-white border border-transparent font-medium',
    gradient:
      'bg-gradient-to-r from-[#171717] via-[#262626] to-[#171717] text-white border border-[#3ecf8e]/40 hover:border-[#3ecf8e] font-medium shadow-sm',
    gold:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-sm border border-amber-600/30',
  };

  const connectedVariantClasses: Record<CiceroButtonVariant, string> = {
    primary:
      'border-[#3ecf8e]/40 bg-[#3ecf8e]/10 text-white shadow-sm',
    outline:
      'border-[#3f3f46] bg-transparent text-white',
    dark:
      'border-[#3f3f46] bg-[#18181b] text-white shadow-sm',
    ghost:
      'border-transparent bg-transparent text-white',
    gradient:
      'border-[#3ecf8e]/40 bg-gradient-to-r from-zinc-950 to-zinc-900 text-white shadow-sm',
    gold:
      'border-amber-400/40 bg-amber-400/10 text-amber-100 shadow-sm',
  };

  const accentTextClasses: Record<CiceroButtonVariant, string> = {
    primary: 'text-[#3ecf8e]',
    outline: 'text-zinc-300',
    dark: 'text-zinc-300',
    ghost: 'text-[#3ecf8e]',
    gradient: 'text-[#3ecf8e]',
    gold: 'text-amber-300',
  };

  return (
    <>
      {!isConnected ? (
        <button
          type="button"
          onClick={openConnectModal}
          disabled={isConnecting}
          aria-busy={isConnecting}
          className={`inline-flex items-center justify-center transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-wait disabled:opacity-60 ${sizeClasses} ${radiusClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
        >
          {showIcon && (
            <Shield
              className={`flex-shrink-0 ${
                size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
              } ${
                variant === 'primary'
                  ? 'fill-[#171717]/20 text-[#171717]'
                  : variant === 'gold'
                  ? 'text-amber-100 fill-white/20'
                  : 'text-[#3ecf8e]'
              }`}
            />
          )}
          <span>{isConnecting ? 'Connecting…' : label.trim() || 'Connect Zcash Wallet'}</span>
        </button>
      ) : (
        /* Connected State Pill (RainbowKit style) */
        <div
          className={`inline-flex max-w-full items-center border p-0.5 ${connectedSizeClasses} ${radiusClasses} ${connectedVariantClasses[variant]} ${className}`}
        >
          {/* Network tag */}
          {showNetwork && (
            <div className="flex items-center gap-1.5 border-r border-current/20 px-2.5 py-1 font-medium opacity-90">
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full ${
                  network === 'mainnet' ? 'bg-[#3ecf8e]' : 'bg-amber-400'
                }`}
              />
              <span className="capitalize">{network}</span>
            </div>
          )}

          {/* Balance */}
          {showBalance && (
            <div className="border-r border-current/20 px-2.5 py-1 font-mono font-medium tabular-nums">
              <span>{balance.zec}</span>{' '}
              <span className="font-normal opacity-70">ZEC</span>
            </div>
          )}

          {/* Account Pill button */}
          <button
            type="button"
            onClick={openAccountModal}
            aria-label={`Open ${account.wallet?.name || 'Zcash wallet'} account, ${network}${address ? `, ${truncateAddress(address, 6, 4)}` : ''}`}
            className={`flex min-w-0 items-center gap-1.5 px-2.5 py-1 font-medium transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${radiusClasses}`}
          >
            {showIcon && <span aria-hidden="true" className="shrink-0 text-sm">{account.wallet?.icon || '🛡️'}</span>}
            <span className={`truncate font-mono ${accentTextClasses[variant]}`}>
              {address ? truncateAddress(address, 6, 4) : 'Connected'}
            </span>
            <ChevronDown aria-hidden="true" className="h-3 w-3 shrink-0 opacity-70" />
          </button>
        </div>
      )}
    </>
  );
};
