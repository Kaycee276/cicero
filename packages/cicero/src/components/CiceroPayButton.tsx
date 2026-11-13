import React from 'react';
import { Shield } from 'lucide-react';
import { CiceroPayProps } from '../types';
import { useCiceroPayment } from '../hooks/useCiceroPayment';
import { CiceroModal } from './CiceroModal';

export const CiceroPayButton: React.FC<CiceroPayProps> = ({
  recipient,
  amount,
  memo,
  message,
  label = 'Pay with Zcash',
  network = 'mainnet',
  variant = 'primary',
  size = 'md',
  showUsd = true,
  modalTitle,
  modalSubtitle,
  expiresInSeconds = 900,
  customRpcUrl,
  invoiceId,
  onSuccess,
  onError,
  onStatusChange,
  className = '',
  disabled = false,
}) => {
  const {
    status,
    txId,
    secondsRemaining,
    isModalOpen,
    openModal,
    closeModal,
    resetPayment,
    zip321Uri,
    addressType,
    isShielded,
    memoValidation,
    simulateDetection,
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

  // Supabase styling tokens
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantClasses = {
    // Signature Supabase emerald CTA: #3ecf8e background, #171717 text, 6px radius
    primary:
      'bg-[#3ecf8e] text-[#171717] hover:bg-[#24b47e] active:bg-[#24b47e] shadow-sm font-medium',
    // Secondary outline on white
    outline:
      'bg-white text-[#171717] border border-[#dfdfdf] hover:border-[#c7c7c7] hover:bg-[#fafafa] font-medium shadow-sm',
    // Dark canvas-night
    dark:
      'bg-[#1c1c1c] text-white hover:bg-[#242424] font-medium shadow-sm',
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-[6px] transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      >
        <Shield
          className={`flex-shrink-0 ${
            size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
          } ${variant === 'primary' ? 'fill-[#171717]/20' : 'text-[#3ecf8e]'}`}
        />
        <span>{label}</span>
      </button>

      <CiceroModal
        isOpen={isModalOpen}
        onClose={closeModal}
        recipient={recipient}
        amount={amount}
        memo={memo}
        message={message}
        network={network}
        status={status}
        txId={txId}
        secondsRemaining={secondsRemaining}
        zip321Uri={zip321Uri}
        addressType={addressType}
        isShielded={isShielded}
        memoValidation={memoValidation}
        onSimulateDetection={simulateDetection}
        onResetPayment={resetPayment}
        title={modalTitle}
        subtitle={modalSubtitle}
        showUsd={showUsd}
      />
    </>
  );
};
