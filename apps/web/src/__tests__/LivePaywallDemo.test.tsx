import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LivePaywallDemo } from '../components/LivePaywallDemo';
import { ClientProviders } from '../components/ClientProviders';

describe('LivePaywallDemo', () => {
  it('renders payment presets and updates amount upon selection', () => {
    render(
      <ClientProviders>
        <LivePaywallDemo />
      </ClientProviders>
    );

    expect(screen.getByText('Dev Coffee')).toBeTruthy();
    expect(screen.getByText('Unlock Alpha Memo')).toBeTruthy();
    expect(screen.getByText('Shielded Sponsor')).toBeTruthy();

    // Default is 0.02 ZEC for Unlock Alpha Memo
    expect(screen.getByText('0.02 ZEC')).toBeTruthy();

    // Click Dev Coffee
    fireEvent.click(screen.getByText('Dev Coffee'));
    expect(screen.getByText('0.005 ZEC')).toBeTruthy();
  });

  it('renders payment simulation controls and copy uri triggers', () => {
    render(
      <ClientProviders>
        <LivePaywallDemo />
      </ClientProviders>
    );

    expect(screen.getByText('Build a ZIP-321 payment request')).toBeTruthy();
    expect(screen.getByText('Interactive payment demo')).toBeTruthy();
  });
});
