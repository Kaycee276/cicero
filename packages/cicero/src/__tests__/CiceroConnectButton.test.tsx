import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CiceroConnectButton } from '../components/CiceroConnectButton';
import * as CiceroContextModule from '../context/CiceroContext';

describe('CiceroConnectButton', () => {
  const defaultMockContext: any = {
    account: {
      address: null,
      viewingKey: null,
      isConnected: false,
      isConnecting: false,
      status: 'disconnected',
      wallet: null,
      error: null,
    },
    address: null,
    isConnected: false,
    isConnecting: false,
    network: 'mainnet',
    balance: { zec: 0, usd: null, isLoading: false },
    openConnectModalWithAppearance: vi.fn(),
    openAccountModalWithAppearance: vi.fn(),
  };

  it('renders default connect label in disconnected state', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue(defaultMockContext);

    render(<CiceroConnectButton />);
    const button = screen.getByRole('button', { name: /connect zcash wallet/i });
    expect(button).toBeTruthy();
  });

  it('renders custom label when provided', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue(defaultMockContext);

    render(<CiceroConnectButton label="Enter Shielded Realm" />);
    expect(screen.getByRole('button', { name: /enter shielded realm/i })).toBeTruthy();
  });

  it('triggers openConnectModalWithAppearance when clicked in disconnected state', () => {
    const openConnectModal = vi.fn();
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      openConnectModalWithAppearance: openConnectModal,
    });

    render(<CiceroConnectButton variant="outline" size="lg" radius="full" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(openConnectModal).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'outline',
        size: 'lg',
        radius: 'full',
      })
    );
  });

  it('displays truncated address, balance, and network when connected', () => {
    const openAccountModal = vi.fn();
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      isConnected: true,
      address: 'u1qwe829xkps9482mzsll049281kz8471hzkas093847zkd09472619as836104829371029384710',
      balance: { zec: 14.25, usd: '$498.75', isLoading: false },
      network: 'testnet',
      openAccountModalWithAppearance: openAccountModal,
    });

    render(<CiceroConnectButton showBalance={true} showNetwork={true} />);

    // Address truncated (first 6, last 4)
    expect(screen.getByText(/u1qwe8\.\.\.4710/)).toBeTruthy();
    // Network pill
    expect(screen.getByText(/testnet/i)).toBeTruthy();
    // Balance display
    expect(screen.getByText('14.25')).toBeTruthy();
    expect(screen.getByText('ZEC')).toBeTruthy();

    // Clicking connected button opens account modal
    const button = screen.getByRole('button', { name: /Open Zcash wallet account/i });
    fireEvent.click(button);
    expect(openAccountModal).toHaveBeenCalled();
  });

  it('supports hiding balance and network pills', () => {
    vi.spyOn(CiceroContextModule, 'useCicero').mockReturnValue({
      ...defaultMockContext,
      isConnected: true,
      address: 'u1sampleaddress1234567890abcdef',
      balance: { zec: 5.0, usd: null, isLoading: false },
      network: 'mainnet',
    });

    render(<CiceroConnectButton showBalance={false} showNetwork={false} />);
    expect(screen.queryByText(/ZEC/)).toBeNull();
    expect(screen.queryByText(/mainnet/i)).toBeNull();
  });
});
