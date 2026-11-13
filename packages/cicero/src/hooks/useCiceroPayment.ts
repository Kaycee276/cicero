import { useState, useEffect, useCallback, useMemo } from 'react';
import { PaymentStatus, ZcashNetwork } from '../types';
import { generateZip321Uri, getWalletDeepLinks } from '../utils/zip321';
import { getAddressType, isShieldedAddress, validateMemoSupport } from '../utils/address';
import { ZucchiniWalletAdapter } from '../wallet/zucchini';

export interface UseCiceroPaymentOptions {
  recipient: string;
  amount: number | string;
  memo?: string;
  message?: string;
  network?: ZcashNetwork;
  expiresInSeconds?: number;
  invoiceId?: string;
  customRpcUrl?: string;
  onSuccess?: (tx: { txId: string; amount: number; memo?: string }) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: PaymentStatus) => void;
}

export function useCiceroPayment({
  recipient,
  amount,
  memo,
  message,
  network = 'mainnet',
  expiresInSeconds = 900, // 15 mins
  invoiceId,
  customRpcUrl,
  onSuccess,
  onError,
  onStatusChange,
}: UseCiceroPaymentOptions) {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [txId, setTxId] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(expiresInSeconds);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Zucchini Wallet detection
  const [zucchiniAvailable, setZucchiniAvailable] = useState(false);
  const [zucchiniAdapter] = useState(() => new ZucchiniWalletAdapter());
  const [zucchiniPaying, setZucchiniPaying] = useState(false);

  useEffect(() => {
    // Check after mount (window must be available)
    setZucchiniAvailable(ZucchiniWalletAdapter.isAvailable());
  }, []);

  // Address inspection
  const addressType = useMemo(() => getAddressType(recipient), [recipient]);
  const isShielded = useMemo(() => isShieldedAddress(recipient), [recipient]);
  const memoValidation = useMemo(
    () => validateMemoSupport(recipient, memo),
    [recipient, memo]
  );

  useEffect(() => {
    if (!memoValidation.valid && memoValidation.warning) {
      onError?.(new Error(memoValidation.warning));
    }
  }, [memoValidation, onError]);

  // ZIP-321 URI & Deep links
  const zip321Uri = useMemo(() => {
    return generateZip321Uri({
      address: recipient,
      amount,
      memo,
      message,
    });
  }, [recipient, amount, memo, message]);

  const deepLinks = useMemo(() => getWalletDeepLinks(zip321Uri), [zip321Uri]);

  // Update status and fire callback
  const updateStatus = useCallback(
    (newStatus: PaymentStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  // Expiration countdown
  useEffect(() => {
    if (status !== 'pending') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          updateStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, updateStatus]);

  // Reset payment state
  const resetPayment = useCallback(() => {
    setStatus('pending');
    setTxId(null);
    setSecondsRemaining(expiresInSeconds);
    setZucchiniPaying(false);
  }, [expiresInSeconds]);

  // Open & Close modal
  const openModal = useCallback(() => {
    resetPayment();
    setIsModalOpen(true);
  }, [resetPayment]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // ─── Zucchini Wallet: Pay directly via browser extension ───
  const payWithZucchini = useCallback(async () => {
    setZucchiniPaying(true);
    try {
      // Connect (prompts user in extension side-panel)
      await zucchiniAdapter.connect();

      // Request payment (opens send-review screen)
      const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
      const result = await zucchiniAdapter.requestPayment({
        recipient,
        amount: numAmount,
        memo,
      });

      // Mark as detected then confirmed
      updateStatus('detected');
      setTxId(result.txId);

      // Brief delay to show the "detected" animation, then confirm
      setTimeout(() => {
        updateStatus('confirmed');
        onSuccess?.({
          txId: result.txId,
          amount: isNaN(numAmount) ? 0 : numAmount,
          memo,
        });
        setZucchiniPaying(false);
      }, 1500);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Zucchini payment failed');
      onError?.(error);
      setZucchiniPaying(false);
    }
  }, [recipient, amount, memo, zucchiniAdapter, updateStatus, onSuccess, onError]);

  // Demo simulator functions (allows judges and developers to test the payment flow)
  const simulateDetection = useCallback(() => {
    updateStatus('detected');
    setTimeout(() => {
      const mockTxId = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      setTxId(mockTxId);
      updateStatus('confirmed');
      const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
      onSuccess?.({
        txId: mockTxId,
        amount: isNaN(numAmount) ? 0 : numAmount,
        memo,
      });
    }, 2000);
  }, [amount, memo, onSuccess, updateStatus]);

  return {
    status,
    txId,
    secondsRemaining,
    isModalOpen,
    openModal,
    closeModal,
    resetPayment,
    zip321Uri,
    deepLinks,
    addressType,
    isShielded,
    memoValidation,
    simulateDetection,
    invoiceId,
    network,
    customRpcUrl,
    // Zucchini Wallet
    zucchiniAvailable,
    zucchiniPaying,
    payWithZucchini,
  };
}
