import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { StudioSettingsProvider, useStudioSettings } from '../context/StudioSettingsContext';

describe('StudioSettingsContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StudioSettingsProvider>{children}</StudioSettingsProvider>
  );

  it('throws error when useStudioSettings is called outside provider', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useStudioSettings())).toThrow(
      'useStudioSettings must be used within a StudioSettingsProvider'
    );

    console.error = originalError;
  });

  it('initializes with default supabase preset and supports switching presets', () => {
    const { result } = renderHook(() => useStudioSettings(), { wrapper });

    expect(result.current.activePreset).toBe('supabase');
    expect(result.current.variant).toBe('primary');
    expect(result.current.accentColor).toBe('#3ecf8e');

    // Switch to midnight preset
    act(() => {
      result.current.applyPreset('midnight');
    });

    expect(result.current.activePreset).toBe('midnight');
    expect(result.current.variant).toBe('dark');
  });

  it('allows updating custom settings and toggling theme', () => {
    const { result } = renderHook(() => useStudioSettings(), { wrapper });

    act(() => {
      result.current.setLabel('Pay with Shielded ZEC');
      result.current.setShowBalance(false);
    });

    expect(result.current.label).toBe('Pay with Shielded ZEC');
    expect(result.current.showBalance).toBe(false);

    // Toggle theme
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
