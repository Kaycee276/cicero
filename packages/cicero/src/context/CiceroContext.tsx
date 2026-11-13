import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { ZcashNetwork } from '../types';
import {
  ZcashWallet,
  WalletSession,
  SendPaymentParams,
  SendPaymentResult,
  getDefaultWallets,
} from '../wallets';
import { useZcashPrice } from '../hooks/useZcashPrice';
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
  switchNetwork: (net: ZcashNetwork) => void;

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
  closeConnectModal: () => void;

  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;

  // Config
  wallets: ZcashWallet[];
  appName?: string;
  appLogo?: string;
}

const CiceroContext = createContext<CiceroContextType | null>(null);

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

  // Price oracle
  const { convertZecToUsd } = useZcashPrice(true);

  // Local storage restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedWalletId = localStorage.getItem('cicero_wallet_id');
    const savedAddress = localStorage.getItem('cicero_address');
    const savedNetwork = localStorage.getItem('cicero_network') as ZcashNetwork;

    if (savedNetwork) {
      setNetwork(savedNetwork);
    }

    if (autoConnect && savedWalletId) {
      const targetWallet = wallets.find((w) => w.id === savedWalletId);
      if (targetWallet && (targetWallet.isAvailable() || savedAddress)) {
        setAccount({
          address: savedAddress || null,
          viewingKey: null,
          isConnected: true,
          isConnecting: false,
          status: 'connected',
          wallet: targetWallet,
          error: null,
        });

        // Set simulated initial balance for demo
        const demoZec = 1.45;
        setBalance({
          zec: demoZec,
          usd: convertZecToUsd(demoZec),
          isLoading: false,
        });
      }
    }
  }, [autoConnect, wallets, convertZecToUsd]);

  // Update USD balance when ZEC price updates
  useEffect(() => {
    if (account.isConnected) {
      setBalance((prev) => ({
        ...prev,
        usd: convertZecToUsd(prev.zec),
      }));
    }
  }, [account.isConnected, balance.zec, convertZecToUsd]);

  const switchNetwork = useCallback((newNet: ZcashNetwork) => {
    setNetwork(newNet);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cicero_network', newNet);
    }
  }, []);

  const connect = useCallback(
    async (walletId: string, customAddressOrKey?: string) => {
      const targetWallet = wallets.find((w) => w.id === walletId);
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
          session = await targetWallet.connect({ network });
        }

        const resolvedAddress = session.address || customAddressOrKey || null;

        setAccount({
          address: resolvedAddress,
          viewingKey: session.viewingKey || null,
          isConnected: true,
          isConnecting: false,
          status: 'connected',
          wallet: targetWallet,
          error: null,
        });

        // Demo initial balance
        const initialZec = 1.25;
        setBalance({
          zec: initialZec,
          usd: convertZecToUsd(initialZec),
          isLoading: false,
        });

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
    setBalance((prev) => ({ ...prev, isLoading: true }));
    // Simulate query or query light client
    await new Promise((resolve) => setTimeout(resolve, 800));
    setBalance((prev) => ({
      ...prev,
      isLoading: false,
      usd: convertZecToUsd(prev.zec),
    }));
  }, [convertZecToUsd]);

  const openConnectModal = useCallback(() => setIsConnectModalOpen(true), []);
  const closeConnectModal = useCallback(() => setIsConnectModalOpen(false), []);
  const openAccountModal = useCallback(() => setIsAccountModalOpen(true), []);
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
      closeConnectModal,
      isAccountModalOpen,
      openAccountModal,
      closeAccountModal,
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
      closeConnectModal,
      isAccountModalOpen,
      openAccountModal,
      closeAccountModal,
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
