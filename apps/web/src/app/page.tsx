import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { PlaygroundStudio } from '@/components/PlaygroundStudio';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UseCasesSection } from '@/components/UseCasesSection';
import { DocsSection } from '@/components/DocsSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171717]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PlaygroundStudio />
        <FeaturesSection />
        <UseCasesSection />
        <DocsSection />
      </main>
      <Footer />
    </div>
  );
}
