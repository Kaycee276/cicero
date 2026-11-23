'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CiceroButtonVariant, CiceroButtonRadius } from '@cicero-zcash/react';

export type ButtonVariant = CiceroButtonVariant;
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = CiceroButtonRadius;
export type ThemeMode = 'light' | 'dark';

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
  accentColor: string;
}

type StoredStudioSettings = Partial<Omit<DesignPreset, 'id'>> & {
  id?: string | null;
};

const STUDIO_SETTINGS_KEY = 'cicero_studio_settings_v1';

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
    accentColor: '#3ecf8e',
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
    accentColor: '#3ecf8e',
  },
  gold: {
    id: 'gold',
    name: 'Zcash Amber Gold',
    description: 'Warm amber with rounded-full pill styling',
    variant: 'gold',
    size: 'lg',
    radius: 'full',
    label: 'Enter zk-Shielded Portal',
    showBalance: true,
    showNetwork: true,
    showIcon: true,
    accentColor: '#f59e0b',
  },
  minimal: {
    id: 'minimal',
    name: 'Flat Minimal',
    description: 'Quiet text and a flat surface with sharp geometry',
    variant: 'ghost',
    size: 'sm',
    radius: 'sm',
    label: 'Connect ZEC',
    showBalance: true,
    showNetwork: false,
    showIcon: false,
    accentColor: '#a1a1aa',
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
  accentColor: string;
  setAccentColor: (color: string) => void;
  activePreset: string | null;
  applyPreset: (presetId: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
}

const StudioSettingsContext = createContext<StudioSettingsContextType | null>(null);

export const StudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [radius, setRadius] = useState<ButtonRadius>('md');
  const [label, setLabel] = useState<string>('Connect Zcash Wallet');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showNetwork, setShowNetwork] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [accentColor, setAccentColorState] = useState<string>('#3ecf8e');
  const [activePreset, setActivePreset] = useState<string | null>('supabase');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STUDIO_SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored) as StoredStudioSettings;
        if (settings.variant && ['primary', 'outline', 'dark', 'ghost', 'gold'].includes(settings.variant)) {
          setVariant(settings.variant === 'outline' ? 'ghost' : settings.variant);
        }
        if (settings.size && ['sm', 'md', 'lg'].includes(settings.size)) setSize(settings.size);
        if (settings.radius && ['none', 'sm', 'md', 'lg', 'full'].includes(settings.radius)) setRadius(settings.radius);
        if (typeof settings.label === 'string') setLabel(settings.label.slice(0, 40));
        if (typeof settings.showBalance === 'boolean') setShowBalance(settings.showBalance);
        if (typeof settings.showNetwork === 'boolean') setShowNetwork(settings.showNetwork);
        if (typeof settings.showIcon === 'boolean') setShowIcon(settings.showIcon);
        if (typeof settings.accentColor === 'string' && /^#[\da-f]{6}$/i.test(settings.accentColor)) setAccentColorState(settings.accentColor);
        if (settings.id === null) setActivePreset(null);
        else if (typeof settings.id === 'string' && settings.id in DESIGN_PRESETS) setActivePreset(settings.id);
        else setActivePreset(null);
      }
    } catch {
      // Ignore invalid or unavailable local settings and keep the defaults.
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    try {
      localStorage.setItem(STUDIO_SETTINGS_KEY, JSON.stringify({
        variant,
        size,
        radius,
        label,
        showBalance,
        showNetwork,
        showIcon,
        accentColor,
        id: activePreset,
      }));
    } catch {
      // The Studio still works when storage is unavailable.
    }
  }, [settingsLoaded, variant, size, radius, label, showBalance, showNetwork, showIcon, accentColor, activePreset]);

  // Synchronize theme with DOM & localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let saved: ThemeMode | null = null;
    try {
      saved = localStorage.getItem('cicero_theme') as ThemeMode | null;
    } catch {
      // Keep the default theme when storage is unavailable.
    }
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved);
      if (saved === 'dark') {
        document.documentElement.classList.toggle('dark', true);
        document.documentElement.classList.toggle('light', false);
      } else {
        document.documentElement.classList.toggle('dark', false);
        document.documentElement.classList.toggle('light', true);
      }
    } else {
      setThemeState('dark');
      document.documentElement.classList.toggle('dark', true);
      document.documentElement.classList.toggle('light', false);
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cicero_theme', newTheme);
      } catch {
        // Theme changes still apply for the current session.
      }
      if (newTheme === 'dark') {
        document.documentElement.classList.toggle('dark', true);
        document.documentElement.classList.toggle('light', false);
      } else {
        document.documentElement.classList.toggle('dark', false);
        document.documentElement.classList.toggle('light', true);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
    setAccentColorState(p.accentColor);
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
    setLabel(l.slice(0, 40));
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

  const handleSetAccentColor = (color: string) => {
    if (!/^#[\da-f]{6}$/i.test(color)) return;
    setAccentColorState(color);
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
        accentColor,
        setAccentColor: handleSetAccentColor,
        activePreset,
        applyPreset,
        theme,
        toggleTheme,
        setTheme,
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
