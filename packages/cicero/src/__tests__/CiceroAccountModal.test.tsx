import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CiceroAccountModal } from '../components/CiceroAccountModal';
import * as CiceroContextModule from '../context/CiceroContext';
import { burnerWallet } from '../wallets';

describe('CiceroAccountModal', () => {
  const sampleAddr =
    'u1qwe829xkps9482mzsll049281kz8471hzkas093847zkd09472619as83610482937102938471029384710';
  const defaultMockContext: any = {
    isAccountModalOpen: true,
    closeAccountModal: vi.fn(),
    address: sampleAddr,
    wallet: burnerWallet,
    network: 'testnet',
    switchNetwork: vi.fn(),
    balance: { zec: 10.5, usd: '$367.50', isLoading: false },
    refetchBalance: vi.fn(),
    disconnect: vi.fn(),
    modalAppearance: {
      variant: 'primary',
      size: 'md',
      radius: 'md',
      showBalance: true,
      showNetwork: true,
      showIcon: true,
      accentColor: '#3ecf8e',
    },
  };

  it('renders account details when open', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue(defaultMockContext);

    render(<CiceroAccountModal isOpen={true} />);

    expect(screen.getByText(/Dev Session Wallet/i)).toBeTruthy();
    expect(screen.getByText(/Connected/i)).toBeTruthy();
    expect(screen.getByText('10.5')).toBeTruthy();
  });

  it('triggers disconnect on button click', () => {
    const disconnect = vi.fn();
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      disconnect,
    });

    render(<CiceroAccountModal isOpen={true} />);

    const disconnectBtn = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectBtn);
    expect(disconnect).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      isAccountModalOpen: false,
    });

    const { container } = render(<CiceroAccountModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });
});
