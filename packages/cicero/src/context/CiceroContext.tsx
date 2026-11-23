import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { CiceroButtonAppearance, ZcashNetwork } from '../types';
import {
  ZcashWallet,
  WalletSession,
  SendPaymentParams,
  SendPaymentResult,
  getDefaultWallets,
} from '../wallets';
import { useZcashPrice } from '../hooks/useZcashPrice';
import { ZucchiniWalletAdapter } from '../wallet/zucchini';
import { CiceroConnectModal } from '../components/CiceroConnectModal';
import { CiceroAccountModal } from '../components/CiceroAccountModal';

export interface AccountState {
  address: string | null;
  viewingKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  wallet: ZcashWallet | null;
  error: string | null;
}

export interface BalanceState {
  zec: number;
  usd: string | null;
  isLoading: boolean;
}

export interface CiceroContextType {
  // Account
  account: AccountState;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  wallet: ZcashWallet | null;

  // Network
  network: ZcashNetwork;
  switchNetwork: (net: ZcashNetwork) => Promise<{ success: boolean; requiresManualSwitch?: boolean; currentNetwork?: ZcashNetwork }>;

  // Balance
  balance: BalanceState;
  refetchBalance: () => Promise<void>;

  // Actions
  connect: (walletId: string, customAddressOrKey?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendPayment: (params: SendPaymentParams) => Promise<SendPaymentResult>;

  // Modals
  isConnectModalOpen: boolean;
  openConnectModal: () => void;
  openConnectModalWithAppearance: (appearance: CiceroButtonAppearance) => void;
  closeConnectModal: () => void;

  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  openAccountModalWithAppearance: (appearance: CiceroButtonAppearance) => void;

  // Appearance forwarded from the button that opened a modal
  modalAppearance: CiceroButtonAppearance;
  closeAccountModal: () => void;

  // Config
  wallets: ZcashWallet[];
  appName?: string;
  appLogo?: string;
}

const CiceroContext = createContext<CiceroContextType | null>(null);

const DEFAULT_MODAL_APPEARANCE: CiceroButtonAppearance = {
  variant: 'primary',
  size: 'md',
  radius: 'md',
  showBalance: true,
  showNetwork: true,
  showIcon: true,
  accentColor: '#3ecf8e',
};

export interface CiceroProviderProps {
  children: React.ReactNode;
  initialNetwork?: ZcashNetwork;
  wallets?: ZcashWallet[];
  appName?: string;
  appLogo?: string;
  autoConnect?: boolean;
}

export const CiceroProvider: React.FC<CiceroProviderProps> = ({
  children,
  initialNetwork = 'mainnet',
  wallets = getDefaultWallets(),
  appName = 'Zcash App',
  appLogo,
  autoConnect = true,
}) => {
  const [network, setNetwork] = useState<ZcashNetwork>(initialNetwork);
  const [account, setAccount] = useState<AccountState>({
    address: null,
    viewingKey: null,
    isConnected: false,
    isConnecting: false,
    status: 'disconnected',
    wallet: null,
    error: null,
  });

  const [balance, setBalance] = useState<BalanceState>({
    zec: 0,
    usd: null,
    isLoading: false,
  });

  // Modal states
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [modalAppearance, setModalAppearance] = useState<CiceroButtonAppearance>(DEFAULT_MODAL_APPEARANCE);

  // Price oracle
  const { convertZecToUsd } = useZcashPrice(true);

  // Stable refs for props/hooks to prevent infinite re-render loops
  const convertZecToUsdRef = useRef(convertZecToUsd);
  convertZecToUsdRef.current = convertZecToUsd;

  const walletsRef = useRef(wallets);
  walletsRef.current = wallets;

  // Local storage restoration on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedWalletId = localStorage.getItem('cicero_wallet_id');
    const savedAddress = localStorage.getItem('cicero_address');
    const savedNetwork = localStorage.getItem('cicero_network') as ZcashNetwork;

    if (savedNetwork) {
      setNetwork(savedNetwork);
    }

    if (autoConnect && savedWalletId) {
      const targetWallet = walletsRef.current.find((w: ZcashWallet) => w.id === savedWalletId);
      // If we have a saved address or the wallet is available, restore session immediately
      if (targetWallet && (savedAddress || targetWallet.isAvailable())) {
        const savedBal = localStorage.getItem('cicero_balance');
        const parsedBal = savedBal ? parseFloat(savedBal) : null;
        const activeZec = parsedBal !== null && !isNaN(parsedBal) ? parsedBal : 0;
        const initialUsd = convertZecToUsdRef.current(activeZec);

        setAccount({
          address: savedAddress || null,
          viewingKey: null,
          isConnected: true,
          isConnecting: false,
          status: 'connected',
          wallet: targetWallet,
          error: null,
        });

        setBalance({
          zec: activeZec,
          usd: initialUsd,
          isLoading: false,
        });

        // Background query to sync latest real balance once wallet is ready
        if (targetWallet.getBalance) {
          targetWallet
            .getBalance({ address: savedAddress || undefined, network })
            .then((freshBal: number | null) => {
              if (freshBal !== null && !isNaN(freshBal)) {
                setBalance({
                  zec: freshBal,
                  usd: convertZecToUsdRef.current(freshBal),
                  isLoading: false,
                });
                localStorage.setItem('cicero_balance', freshBal.toString());
              }
            })
            .catch(() => {});
        }
      }
    }
  }, [autoConnect]);

  // Live Zucchini event listener: detects unlock, account changes, or late injection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for extension readiness (handles late injection without disconnect)
    const cleanupReady = ZucchiniWalletAdapter.onReady(() => {
      const savedWalletId = localStorage.getItem('cicero_wallet_id');
      const savedAddress = localStorage.getItem('cicero_address');

      if (savedWalletId === 'zucchini' && autoConnect) {
        const zucchini = walletsRef.current.find((w: ZcashWallet) => w.id === 'zucchini');
        if (zucchini) {
          // If extension became ready, ensure connected state is active
          setAccount((prev) => {
            if (prev.isConnected && prev.wallet?.id === 'zucchini') return prev;
            return {
              address: savedAddress || null,
              viewingKey: null,
              isConnected: true,
              isConnecting: false,
              status: 'connected',
              wallet: zucchini,
              error: null,
            };
          });
        }
      }
    });

    return () => {
      cleanupReady();
    };
  }, [autoConnect]);

  // Live network change listener: auto-syncs when user toggles Mainnet/Testnet in Zucchini
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const adapter = new ZucchiniWalletAdapter();
    const cleanup = adapter.onNetworkChanged(async (detectedNet: ZcashNetwork) => {
      setNetwork(detectedNet);
      localStorage.setItem('cicero_network', detectedNet);

      // Re-sync balance immediately when network changes in the extension
      if (account.wallet?.id === 'zucchini') {
        setBalance((prev) => ({ ...prev, isLoading: true }));
        try {
          const freshBal = await adapter.getBalance({
            address: account.address || undefined,
            network: detectedNet,
          });
          const activeZec = freshBal !== null && !isNaN(freshBal) ? freshBal : 0;
          setBalance({
            zec: activeZec,
            usd: convertZecToUsdRef.current(activeZec),
            isLoading: false,
          });
          localStorage.setItem('cicero_balance', activeZec.toString());
          localStorage.setItem(`cicero_balance_${detectedNet}`, activeZec.toString());
        } catch {
          setBalance((prev) => ({ ...prev, isLoading: false }));
        }
      }
    });

    return () => {
      cleanup();
    };
  }, [account.wallet?.id, account.address]);

  // Update USD balance when ZEC price updates
  useEffect(() => {
    if (account.isConnected) {
      setBalance((prev) => {
        const newUsd = convertZecToUsd(prev.zec);
        if (prev.usd === newUsd) return prev; // Prevent unnecessary state churn
        return {
          ...prev,
          usd: newUsd,
        };
      });
    }
  }, [account.isConnected, balance.zec, convertZecToUsd]);

  const switchNetwork = useCallback(
    async (newNet: ZcashNetwork): Promise<{ success: boolean; requiresManualSwitch?: boolean; currentNetwork?: ZcashNetwork }> => {
      // If a wallet is connected, consult the wallet first so Cicero doesn't get out of sync
      if (account.wallet?.switchNetwork) {
        try {
          const switchRes = await account.wallet.switchNetwork(newNet);
          if (switchRes && switchRes.requiresManualSwitch) {
            // Extension security model requires manual switch in wallet settings
            const currentNet = switchRes.currentNetwork || (account.wallet.getNetwork ? await account.wallet.getNetwork() : network);
            setNetwork(currentNet);
            if (typeof window !== 'undefined') {
              localStorage.setItem('cicero_network', currentNet);
            }
            return {
              success: false,
              requiresManualSwitch: true,
              currentNetwork: currentNet,
            };
          }
        } catch {
          // fallback
        }
      }

      setNetwork(newNet);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cicero_network', newNet);
      }

      // Re-query balance for the new network
      if (account.wallet?.getBalance) {
        setBalance((prev) => ({ ...prev, isLoading: true }));
        try {
          const freshBal = await account.wallet.getBalance({
            address: account.address || undefined,
            network: newNet,
          });
          const activeZec = freshBal !== null && !isNaN(freshBal) ? freshBal : 0;
          setBalance({
            zec: activeZec,
            usd: convertZecToUsdRef.current(activeZec),
            isLoading: false,
          });
          if (typeof window !== 'undefined' && freshBal !== null) {
            localStorage.setItem(`cicero_balance_${newNet}`, freshBal.toString());
            localStorage.setItem('cicero_balance', freshBal.toString());
          }
        } catch {
          setBalance((prev) => ({ ...prev, isLoading: false }));
        }
      }

      return { success: true, currentNetwork: newNet };
    },
    [account.wallet, account.address, network]
  );

  const connect = useCallback(
    async (walletId: string, customAddressOrKey?: string) => {
      const targetWallet = wallets.find((w: ZcashWallet) => w.id === walletId);
      if (!targetWallet) {
        throw new Error(`Wallet ${walletId} not found in registered wallets`);
      }

      setAccount((prev) => ({
        ...prev,
        isConnecting: true,
        status: 'connecting',
        error: null,
      }));

      try {
        let session: WalletSession;

        if (walletId === 'viewing-key' && customAddressOrKey) {
          session = {
            address: customAddressOrKey,
            viewingKey: customAddressOrKey.startsWith('zx') || customAddressOrKey.startsWith('uview')
              ? customAddressOrKey
              : undefined,
            connected: true,
            network,
            walletId: 'viewing-key',
          };
        } else {
          session = await targetWallet.connect({ network, customKey: customAddressOrKey });
        }

        const resolvedAddress = session.address || customAddressOrKey || null;

        // Synchronize Cicero network with the connected wallet's actual network
        const walletNetwork =
          session.network ||
          (targetWallet.getNetwork ? await targetWallet.getNetwork() : network);

        if (walletNetwork && walletNetwork !== network) {
          setNetwork(walletNetwork);
          if (typeof window !== 'undefined') {
            localStorage.setItem('cicero_network', walletNetwork);
          }
        }

        setAccount({
          address: resolvedAddress,
          viewingKey: session.viewingKey || null,
          isConnected: true,
          isConnecting: false,
          status: 'connected',
          wallet: targetWallet,
          error: null,
        });

        // Resolve real balance from wallet session or getBalance query
        let resolvedZec: number | null = session.balance ?? null;

        if (resolvedZec === null && targetWallet.getBalance) {
          try {
            resolvedZec = await targetWallet.getBalance({
              address: resolvedAddress || undefined,
              network,
            });
          } catch {
            // best effort
          }
        }

        if (resolvedZec === null && typeof window !== 'undefined') {
          const cached = localStorage.getItem('cicero_balance');
          if (cached && !isNaN(parseFloat(cached))) {
            resolvedZec = parseFloat(cached);
          }
        }

        const activeZec = resolvedZec !== null && !isNaN(resolvedZec) ? resolvedZec : 0;

        setBalance({
          zec: activeZec,
          usd: convertZecToUsd(activeZec),
          isLoading: false,
        });

        if (typeof window !== 'undefined' && resolvedZec !== null) {
          localStorage.setItem('cicero_balance', resolvedZec.toString());
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('cicero_wallet_id', walletId);
          if (resolvedAddress) {
            localStorage.setItem('cicero_address', resolvedAddress);
          }
        }

        setIsConnectModalOpen(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Connection failed';
        setAccount((prev) => ({
          ...prev,
          isConnecting: false,
          status: 'error',
          error: msg,
        }));
        throw err;
      }
    },
    [wallets, network, convertZecToUsd]
  );

  const disconnect = useCallback(async () => {
    if (account.wallet?.disconnect) {
      try {
        await account.wallet.disconnect();
      } catch {
        // best effort
      }
    }

    setAccount({
      address: null,
      viewingKey: null,
      isConnected: false,
      isConnecting: false,
      status: 'disconnected',
      wallet: null,
      error: null,
    });

    setBalance({
      zec: 0,
      usd: null,
      isLoading: false,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('cicero_wallet_id');
      localStorage.removeItem('cicero_address');
      localStorage.removeItem('cicero_balance');
    }

    setIsAccountModalOpen(false);
  }, [account.wallet]);

  const sendPayment = useCallback(
    async (params: SendPaymentParams): Promise<SendPaymentResult> => {
      if (!account.wallet) {
        throw new Error('No wallet connected. Please connect a Zcash wallet first.');
      }

      if (account.wallet.sendPayment) {
        return account.wallet.sendPayment(params);
      }

      throw new Error(`Wallet ${account.wallet.name} does not support programmatic send.`);
    },
    [account.wallet]
  );

  const refetchBalance = useCallback(async () => {
    if (!account.wallet) return;
    setBalance((prev) => ({ ...prev, isLoading: true }));

    try {
      let freshZec: number | null = null;
      if (account.wallet.getBalance) {
        freshZec = await account.wallet.getBalance({
          address: account.address || undefined,
          network,
        });
      }

      if (freshZec !== null && !isNaN(freshZec)) {
        setBalance({
          zec: freshZec,
          usd: convertZecToUsd(freshZec),
          isLoading: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('cicero_balance', freshZec.toString());
        }
        return;
      }
    } catch {
      // best effort
    }

    setBalance((prev) => ({
      ...prev,
      isLoading: false,
      usd: convertZecToUsd(prev.zec),
    }));
  }, [account.wallet, account.address, network, convertZecToUsd]);

  const openConnectModal = useCallback(() => {
    setModalAppearance(DEFAULT_MODAL_APPEARANCE);
    setIsConnectModalOpen(true);
  }, []);
  const openConnectModalWithAppearance = useCallback((appearance: CiceroButtonAppearance) => {
    setModalAppearance(appearance);
    setIsConnectModalOpen(true);
  }, []);
  const closeConnectModal = useCallback(() => setIsConnectModalOpen(false), []);
  const openAccountModal = useCallback(() => {
    setModalAppearance(DEFAULT_MODAL_APPEARANCE);
    setIsAccountModalOpen(true);
  }, []);
  const openAccountModalWithAppearance = useCallback((appearance: CiceroButtonAppearance) => {
    setModalAppearance(appearance);
    setIsAccountModalOpen(true);
  }, []);
  const closeAccountModal = useCallback(() => setIsAccountModalOpen(false), []);

  const value = useMemo<CiceroContextType>(
    () => ({
      account,
      address: account.address,
      isConnected: account.isConnected,
      isConnecting: account.isConnecting,
      wallet: account.wallet,
      network,
      switchNetwork,
      balance,
      refetchBalance,
      connect,
      disconnect,
      sendPayment,
      isConnectModalOpen,
      openConnectModal,
      openConnectModalWithAppearance,
      closeConnectModal,
      isAccountModalOpen,
      openAccountModal,
      openAccountModalWithAppearance,
      closeAccountModal,
      modalAppearance,
      wallets,
      appName,
      appLogo,
    }),
    [
      account,
      network,
      switchNetwork,
      balance,
      refetchBalance,
      connect,
      disconnect,
      sendPayment,
      isConnectModalOpen,
      openConnectModal,
      openConnectModalWithAppearance,
      closeConnectModal,
      isAccountModalOpen,
      openAccountModal,
      openAccountModalWithAppearance,
      closeAccountModal,
      modalAppearance,
      wallets,
      appName,
      appLogo,
    ]
  );

  return (
    <CiceroContext.Provider value={value}>
      {children}
      <CiceroConnectModal />
      <CiceroAccountModal />
    </CiceroContext.Provider>
  );
};

export function useCicero(): CiceroContextType {
  const ctx = useContext(CiceroContext);
  if (!ctx) {
    throw new Error('useCicero must be used within a <CiceroProvider>');
  }
  return ctx;
}

// Convenient RainbowKit-style aliases
export const useAccount = () => {
  const { account, address, isConnected, isConnecting, wallet, disconnect } = useCicero();
  return { ...account, address, isConnected, isConnecting, wallet, disconnect };
};

export const useBalance = () => {
  const { balance, refetchBalance } = useCicero();
  return { ...balance, refetch: refetchBalance };
};

export const useConnectModal = () => {
  const { isConnectModalOpen, openConnectModal, closeConnectModal } = useCicero();
  return {
    isOpen: isConnectModalOpen,
    openConnectModal,
    closeConnectModal,
  };
};

export const useAccountModal = () => {
  const { isAccountModalOpen, openAccountModal, closeAccountModal } = useCicero();
  return {
    isOpen: isAccountModalOpen,
    openAccountModal,
    closeAccountModal,
  };
};
