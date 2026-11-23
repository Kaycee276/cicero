import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../components/HeroSection';
import { WalletsMatrixSection } from '../components/WalletsMatrixSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { UseCasesSection } from '../components/UseCasesSection';
import { DocsSection } from '../components/DocsSection';
import { AiSkillSection } from '../components/AiSkillSection';
import { Footer } from '../components/Footer';
import { ClientProviders } from '../components/ClientProviders';

describe('Landing Page Sections', () => {
  it('renders HeroSection with headline and actions', () => {
    render(
      <ClientProviders>
        <HeroSection />
      </ClientProviders>
    );
    expect(screen.getByText(/Zcash wallet connections/i)).toBeTruthy();
  });

  it('renders WalletsMatrixSection with supported wallets', () => {
    render(
      <ClientProviders>
        <WalletsMatrixSection />
      </ClientProviders>
    );
    expect(screen.getByText('Zucchini Wallet')).toBeTruthy();
    expect(screen.getByText('Noir Wallet')).toBeTruthy();
    expect(screen.getByText('Zelcore Wallet')).toBeTruthy();
    expect(screen.getByText('Zashi (Electric Coin Co.)')).toBeTruthy();
  });

  it('renders FeaturesSection with core privacy pillars', () => {
    render(
      <ClientProviders>
        <FeaturesSection />
      </ClientProviders>
    );
    expect(screen.getByText('RainbowKit-Style Connect Experience')).toBeTruthy();
  });

  it('renders UseCasesSection with payment scenarios', () => {
    render(
      <ClientProviders>
        <UseCasesSection />
      </ClientProviders>
    );
    expect(screen.getByText('Privacy-First dApp Onboarding')).toBeTruthy();
  });

  it('renders DocsSection with installation steps', () => {
    render(
      <ClientProviders>
        <DocsSection />
      </ClientProviders>
    );
    expect(screen.getByText('RainbowKit-style Connect Wallet')).toBeTruthy();
  });

  it('renders AiSkillSection with agent instructions', () => {
    render(
      <ClientProviders>
        <AiSkillSection />
      </ClientProviders>
    );
    expect(screen.getByText('Full dApp Specialist')).toBeTruthy();
  });

  it('renders Footer with Marcus Tullius Cicero attribution', () => {
    render(
      <ClientProviders>
        <Footer />
      </ClientProviders>
    );
    expect(screen.getByText(/Marcus Tullius Cicero/i)).toBeTruthy();
  });
});
