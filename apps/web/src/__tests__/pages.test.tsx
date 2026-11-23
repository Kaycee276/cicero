import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import DocsPage from '../app/docs/page';
import { ClientProviders } from '../components/ClientProviders';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Web App Pages', () => {
  it('renders Home page with layout and all sections', () => {
    render(
      <ClientProviders>
        <Home />
      </ClientProviders>
    );

    expect(screen.getByText('CICERO')).toBeTruthy();
    expect(screen.getByText(/Zcash wallet connections/i)).toBeTruthy();
    expect(screen.getByText('Wallet Connection Studio')).toBeTruthy();
    expect(screen.getByText('Dev Coffee')).toBeTruthy();
  });

  it('renders DocsPage with documentation guides and package install tabs', () => {
    render(
      <ClientProviders>
        <DocsPage />
      </ClientProviders>
    );

    expect(screen.getByText('Cicero Developer Documentation')).toBeTruthy();
    expect(screen.getAllByText(/pnpm add @cicero-zcash\/react/i).length).toBeGreaterThanOrEqual(1);
  });
});
