import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { ClientProviders } from '../components/ClientProviders';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar', () => {
  it('renders brand name and navigation links', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 120 }),
    } as any);

    render(
      <ClientProviders>
        <Navbar />
      </ClientProviders>
    );

    expect(screen.getByText('CICERO')).toBeTruthy();
    expect(screen.getByText('Studio')).toBeTruthy();
    expect(screen.getByText('Docs')).toBeTruthy();
  });

  it('toggles light/dark theme when theme button is clicked', () => {
    render(
      <ClientProviders>
        <Navbar />
      </ClientProviders>
    );

    const themeToggleBtns = screen.getAllByRole('button', { name: /switch to light mode/i });
    expect(themeToggleBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(themeToggleBtns[0]);
  });
});
