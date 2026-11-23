import { describe, expect, it } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import {
  CiceroProvider,
  useCicero,
  useAccount,
  useBalance,
  useConnectModal,
  useAccountModal,
} from '../context/CiceroContext';

function TestConsumer() {
  const { isConnected, address, connect, disconnect, network, switchNetwork } = useCicero();
  const account = useAccount();
  const balance = useBalance();
  const connectModal = useConnectModal();
  const accountModal = useAccountModal();

  return (
    <div>
      <div data-testid="status">{isConnected ? 'connected' : 'disconnected'}</div>
      <div data-testid="address">{address || 'none'}</div>
      <div data-testid="network">{network}</div>
      <div data-testid="account-status">{account.status}</div>
      <div data-testid="balance-zec">{balance.zec}</div>
      <button onClick={() => connect('burner')}>Connect Dev</button>
      <button onClick={() => disconnect()}>Disconnect</button>
      <button onClick={() => switchNetwork('testnet')}>Switch Testnet</button>
      <button onClick={() => connectModal.openConnectModal()}>Open Connect Modal</button>
      <button onClick={() => accountModal.openAccountModal()}>Open Account Modal</button>
    </div>
  );
}

describe('CiceroProvider & CiceroContext', () => {
  it('throws error when useCicero is used outside of provider', () => {
    // Suppress console.error for expected throw
    const originalError = console.error;
    console.error = () => {};

    expect(() => render(<TestConsumer />)).toThrow(
      'useCicero must be used within a <CiceroProvider>'
    );

    console.error = originalError;
  });

  it('provides default disconnected state and connects to burner wallet', async () => {
    render(
      <CiceroProvider initialNetwork="mainnet">
        <TestConsumer />
      </CiceroProvider>
    );

    expect(screen.getByTestId('status').textContent).toBe('disconnected');
    expect(screen.getByTestId('address').textContent).toBe('none');
    expect(screen.getByTestId('network').textContent).toBe('mainnet');

    // Trigger connect with burner
    await act(async () => {
      screen.getByText('Connect Dev').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('connected');
    });
    expect(screen.getByTestId('address').textContent).toMatch(/^u1/);

    // Disconnect
    await act(async () => {
      screen.getByText('Disconnect').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('disconnected');
    });
    expect(screen.getByTestId('address').textContent).toBe('none');
  });

  it('switches network properly', async () => {
    render(
      <CiceroProvider initialNetwork="mainnet">
        <TestConsumer />
      </CiceroProvider>
    );

    expect(screen.getByTestId('network').textContent).toBe('mainnet');

    await act(async () => {
      screen.getByText('Switch Testnet').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('network').textContent).toBe('testnet');
    });
  });
});
