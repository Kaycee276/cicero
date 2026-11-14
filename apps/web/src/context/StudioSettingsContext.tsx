'use client';

import React, { createContext, useContext, useState } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface StudioSettingsContextType {
  variant: ButtonVariant;
  setVariant: (v: ButtonVariant) => void;
  size: ButtonSize;
  setSize: (s: ButtonSize) => void;
  showBalance: boolean;
  setShowBalance: (b: boolean) => void;
  showNetwork: boolean;
  setShowNetwork: (n: boolean) => void;
}

const StudioSettingsContext = createContext<StudioSettingsContextType | null>(null);

export const StudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('sm');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showNetwork, setShowNetwork] = useState<boolean>(true);

  return (
    <StudioSettingsContext.Provider
      value={{
        variant,
        setVariant,
        size,
        setSize,
        showBalance,
        setShowBalance,
        showNetwork,
        setShowNetwork,
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
