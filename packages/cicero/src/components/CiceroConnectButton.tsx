import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { useCicero } from '../context/CiceroContext';
import { truncateAddress } from '../utils/address';
import { CiceroConnectModal } from './CiceroConnectModal';
import { CiceroAccountModal } from './CiceroAccountModal';

export interface CiceroConnectButtonProps {
  label?: string;
  variant?: 'primary' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showBalance?: boolean;
  showNetwork?: boolean;
  className?: string;
}

export const CiceroConnectButton: React.FC<CiceroConnectButtonProps> = ({
  label = 'Connect Zcash Wallet',
  variant = 'primary',
  size = 'md',
  showBalance = true,
  showNetwork = true,
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
    lg: 'text-base px-4.5 py-2.5 gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#3ecf8e] text-[#171717] hover:bg-[#24b47e] font-semibold shadow-sm',
    outline:
      'bg-white text-[#171717] border border-[#dfdfdf] hover:border-[#c7c7c7] hover:bg-[#fafafa] font-medium shadow-sm',
    dark:
      'bg-[#1c1c1c] text-white hover:bg-[#242424] font-medium shadow-sm',
  }[variant];

  return (
    <>
      {!isConnected ? (
        <button
          type="button"
          onClick={openConnectModal}
          disabled={isConnecting}
          className={`inline-flex items-center justify-center rounded-[6px] transition-all select-none ${sizeClasses} ${variantClasses} ${className}`}
        >
          <Shield
            className={`flex-shrink-0 ${
              size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
            } ${variant === 'primary' ? 'fill-[#171717]/20' : 'text-[#3ecf8e]'}`}
          />
          <span>{isConnecting ? 'Connecting...' : label}</span>
        </button>
      ) : (
        /* Connected State Pill (RainbowKit style) */
        <div className={`inline-flex items-center rounded-[6px] border border-[#dfdfdf] bg-white p-0.5 shadow-sm text-xs ${className}`}>
          {/* Network tag */}
          {showNetwork && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#707070] border-r border-[#ededed]">
              <span
                className={`w-2 h-2 rounded-full ${
                  network === 'mainnet' ? 'bg-[#3ecf8e]' : 'bg-amber-400'
                }`}
              />
              <span className="capitalize">{network}</span>
            </div>
          )}

          {/* Balance */}
          {showBalance && (
            <div className="px-2.5 py-1 font-mono font-medium text-[#171717] border-r border-[#ededed]">
              <span>{balance.zec}</span> <span className="text-[#707070] font-normal">ZEC</span>
            </div>
          )}

          {/* Account Pill button */}
          <button
            type="button"
            onClick={openAccountModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] hover:bg-[#fafafa] text-[#171717] font-medium transition-colors"
          >
            <span className="text-sm">{account.wallet?.icon || '🛡️'}</span>
            <span className="font-mono text-[11px]">
              {address ? truncateAddress(address, 6, 4) : 'Connected'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#707070]" />
          </button>
        </div>
      )}

      {/* Connected & Disconnected Modals */}
      <CiceroConnectModal />
      <CiceroAccountModal />
    </>
  );
};
