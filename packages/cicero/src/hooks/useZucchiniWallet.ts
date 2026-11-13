import { useState, useEffect, useCallback } from 'react';
import {
  ZucchiniWalletAdapter,
  WalletConnectionStatus,
  WalletPaymentStatus,
  WalletSession,
} from '../wallet/zucchini';

export interface UseZucchiniWalletOptions {
  /** Auto-connect on mount when extension is detected */
  autoConnect?: boolean;
}

export function useZucchiniWallet(options: UseZucchiniWalletOptions = {}) {
  const { autoConnect = false } = options;

  const [adapter] = useState(() => new ZucchiniWalletAdapter());
  const [isAvailable, setIsAvailable] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<WalletConnectionStatus>('disconnected');
  const [paymentStatus, setPaymentStatus] =
    useState<WalletPaymentStatus>('idle');
  const [session, setSession] = useState<WalletSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect extension on mount
  useEffect(() => {
    const detected = ZucchiniWalletAdapter.isAvailable();
    setIsAvailable(detected);

    if (detected && autoConnect) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    setConnectionStatus('connecting');
    setError(null);
    try {
      const sess = await adapter.connect();
      setSession(sess);
      setConnectionStatus('connected');
      return sess;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to connect to Zucchini Wallet';
      setError(msg);
      setConnectionStatus('error');
      throw err;
    }
  }, [adapter]);

  const requestPayment = useCallback(
    async (params: { recipient: string; amount: number | string; memo?: string }) => {
      setPaymentStatus('requesting');
      setError(null);
      try {
        const result = await adapter.requestPayment(params);
        setPaymentStatus('submitted');
        return result;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Payment request failed';
        setError(msg);
        setPaymentStatus('error');
        throw err;
      }
    },
    [adapter]
  );

  const disconnect = useCallback(async () => {
    await adapter.disconnect();
    setSession(null);
    setConnectionStatus('disconnected');
    setPaymentStatus('idle');
  }, [adapter]);

  return {
    /** Whether the Zucchini extension is installed in this browser */
    isAvailable,
    /** Current wallet connection lifecycle state */
    connectionStatus,
    /** Current payment request lifecycle state */
    paymentStatus,
    /** Active session info (address, etc.) */
    session,
    /** Last error message (if any) */
    error,
    /** Prompt the user to connect their Zucchini Wallet */
    connect,
    /** Send a ZIP-321 payment request for user review & approval */
    requestPayment,
    /** Disconnect the current session */
    disconnect,
  };
}
