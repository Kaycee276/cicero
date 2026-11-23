import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CiceroConnectModal } from '../components/CiceroConnectModal';
import * as CiceroContextModule from '../context/CiceroContext';
import { getDefaultWallets } from '../wallets';

describe('CiceroConnectModal', () => {
  const defaultMockContext: any = {
    isConnectModalOpen: true,
    closeConnectModal: vi.fn(),
    wallets: getDefaultWallets(),
    connect: vi.fn(),
    network: 'mainnet',
    appName: 'Cicero App',
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

  it('renders modal when open with wallet options', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue(defaultMockContext);

    render(<CiceroConnectModal isOpen={true} />);

    expect(screen.getByText(/Connect Zcash Wallet/i)).toBeTruthy();
    expect(screen.getAllByText(/Zucchini Wallet/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Zashi by ECC/i)).toBeTruthy();
    expect(screen.getByText(/Ywallet/i)).toBeTruthy();
    expect(screen.getByText(/Zelcore Wallet/i)).toBeTruthy();
  });

  it('allows selecting different wallets and closes on backdrop/button click', () => {
    const closeConnectModal = vi.fn();
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      closeConnectModal,
    });

    render(<CiceroConnectModal isOpen={true} onClose={closeConnectModal} />);

    // Click Ywallet
    const ywalletBtn = screen.getByText(/Ywallet/i);
    fireEvent.click(ywalletBtn);

    // Close button (X)
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(closeConnectModal).toHaveBeenCalled();
  });

  it('does not render content when isOpen is false', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      isConnectModalOpen: false,
    });

    const { container } = render(<CiceroConnectModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });
});
