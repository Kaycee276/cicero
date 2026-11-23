import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { WalletsMatrixSection } from '@/components/WalletsMatrixSection';
import { LivePaywallDemo } from '@/components/LivePaywallDemo';
import { PlaygroundStudio } from '@/components/PlaygroundStudio';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UseCasesSection } from '@/components/UseCasesSection';
import { DocsSection } from '@/components/DocsSection';
import { AiSkillSection } from '@/components/AiSkillSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-[#3ecf8e]/30 selection:text-white">
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <PlaygroundStudio />
        <WalletsMatrixSection />
        <LivePaywallDemo />
        <FeaturesSection />
        <UseCasesSection />
        <DocsSection />
        <section id="ai-agent" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AiSkillSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
