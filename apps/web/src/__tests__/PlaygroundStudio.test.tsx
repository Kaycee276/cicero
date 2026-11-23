import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaygroundStudio } from '../components/PlaygroundStudio';
import { ClientProviders } from '../components/ClientProviders';

describe('PlaygroundStudio', () => {
  it('renders playground studio controls, preset swatches, and code export', () => {
    render(
      <ClientProviders>
        <PlaygroundStudio />
      </ClientProviders>
    );

    expect(screen.getByText('Wallet Connection Studio')).toBeTruthy();
    expect(screen.getByText('Interactive Design Studio')).toBeTruthy();
    expect(screen.getByText('Supabase Emerald')).toBeTruthy();
    expect(screen.getByText('Midnight Dark')).toBeTruthy();

    // Click Midnight Dark preset
    fireEvent.click(screen.getByText('Midnight Dark'));

    // Verify code block is rendered
    expect(screen.getByText(/@cicero-zcash\/react/i)).toBeTruthy();
  });
});
