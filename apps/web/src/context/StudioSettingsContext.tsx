'use client';

import React, { createContext, useContext, useState } from 'react';
import { CiceroButtonVariant, CiceroButtonRadius } from '@cicero-zcash/react';

export type ButtonVariant = CiceroButtonVariant;
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = CiceroButtonRadius;

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  variant: ButtonVariant;
  size: ButtonSize;
  radius: ButtonRadius;
  label: string;
  showBalance: boolean;
  showNetwork: boolean;
  showIcon: boolean;
}

export const DESIGN_PRESETS: Record<string, DesignPreset> = {
  supabase: {
    id: 'supabase',
    name: 'Supabase Emerald',
    description: 'Signature #3ecf8e emerald CTA with 6px modern radius',
    variant: 'primary',
    size: 'md',
    radius: 'md',
    label: 'Connect Zcash Wallet',
    showBalance: true,
    showNetwork: true,
    showIcon: true,
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Canvas night #1c1c1c theme with smooth 12px corners',
    variant: 'dark',
    size: 'md',
    radius: 'lg',
    label: 'Connect Shielded Wallet',
    showBalance: true,
    showNetwork: true,
    showIcon: true,
  },
  gold: {
    id: 'gold',
    name: 'Zcash Amber Gold',
    description: 'Warm gold gradient with rounded-full pill styling',
    variant: 'gold',
    size: 'lg',
    radius: 'full',
    label: 'Enter zk-Shielded Portal',
    showBalance: true,
    showNetwork: true,
    showIcon: true,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Outline',
    description: 'Clean monochrome border with sharp modernist geometry',
    variant: 'outline',
    size: 'sm',
    radius: 'sm',
    label: 'Connect ZEC',
    showBalance: true,
    showNetwork: false,
    showIcon: false,
  },
  gradient: {
    id: 'gradient',
    name: 'Cyber Gradient',
    description: 'Subtle dark metallic gradient with emerald rim accent',
    variant: 'gradient',
    size: 'md',
    radius: 'full',
    label: 'Authenticate with Zcash',
    showBalance: true,
    showNetwork: true,
    showIcon: true,
  },
};

export interface StudioSettingsContextType {
  variant: ButtonVariant;
  setVariant: (v: ButtonVariant) => void;
  size: ButtonSize;
  setSize: (s: ButtonSize) => void;
  radius: ButtonRadius;
  setRadius: (r: ButtonRadius) => void;
  label: string;
  setLabel: (l: string) => void;
  showBalance: boolean;
  setShowBalance: (b: boolean) => void;
  showNetwork: boolean;
  setShowNetwork: (n: boolean) => void;
  showIcon: boolean;
  setShowIcon: (i: boolean) => void;
  activePreset: string | null;
  applyPreset: (presetId: string) => void;
}

const StudioSettingsContext = createContext<StudioSettingsContextType | null>(null);

export const StudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('sm');
  const [radius, setRadius] = useState<ButtonRadius>('md');
  const [label, setLabel] = useState<string>('Connect Zcash Wallet');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showNetwork, setShowNetwork] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string | null>('supabase');

  const applyPreset = (presetId: string) => {
    const p = DESIGN_PRESETS[presetId];
    if (!p) return;
    setActivePreset(presetId);
    setVariant(p.variant);
    setSize(p.size);
    setRadius(p.radius);
    setLabel(p.label);
    setShowBalance(p.showBalance);
    setShowNetwork(p.showNetwork);
    setShowIcon(p.showIcon);
  };

  const handleSetVariant = (v: ButtonVariant) => {
    setVariant(v);
    setActivePreset(null);
  };

  const handleSetSize = (s: ButtonSize) => {
    setSize(s);
    setActivePreset(null);
  };

  const handleSetRadius = (r: ButtonRadius) => {
    setRadius(r);
    setActivePreset(null);
  };

  const handleSetLabel = (l: string) => {
    setLabel(l);
    setActivePreset(null);
  };

  const handleSetShowBalance = (b: boolean) => {
    setShowBalance(b);
    setActivePreset(null);
  };

  const handleSetShowNetwork = (n: boolean) => {
    setShowNetwork(n);
    setActivePreset(null);
  };

  const handleSetShowIcon = (i: boolean) => {
    setShowIcon(i);
    setActivePreset(null);
  };

  return (
    <StudioSettingsContext.Provider
      value={{
        variant,
        setVariant: handleSetVariant,
        size,
        setSize: handleSetSize,
        radius,
        setRadius: handleSetRadius,
        label,
        setLabel: handleSetLabel,
        showBalance,
        setShowBalance: handleSetShowBalance,
        showNetwork,
        setShowNetwork: handleSetShowNetwork,
        showIcon,
        setShowIcon: handleSetShowIcon,
        activePreset,
        applyPreset,
      }}
    >
      {children}
    </StudioSettingsContext.Provider>
  );
};

export function useStudioSettings(): StudioSettingsContextType {
  const ctx = useContext(StudioSettingsContext);
  if (!ctx) {
    throw new Error('useStudioSettings must be used within a StudioSettingsProvider');
  }
  return ctx;
}
