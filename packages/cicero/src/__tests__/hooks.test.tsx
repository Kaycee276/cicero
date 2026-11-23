import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentTheme } from '../hooks/useDocumentTheme';
import { useZcashPrice } from '../hooks/useZcashPrice';

describe('useDocumentTheme', () => {
  beforeEach(() => {
    document.documentElement.className = '';
  });

  it('defaults to dark mode if light class is absent', () => {
    const { result } = renderHook(() => useDocumentTheme());
    expect(result.current).toBe('dark');
  });

  it('detects light mode when class list contains light', () => {
    document.documentElement.className = 'light theme';
    const { result } = renderHook(() => useDocumentTheme());
    expect(result.current).toBe('light');
  });
});

describe('useZcashPrice', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('handles price fetching gracefully with simulated response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        zcash: { usd: 34.5 },
      }),
    } as any);

    const { result } = renderHook(() => useZcashPrice(true));

    // Initially loading or price cached
    expect(result.current).toHaveProperty('usdPrice');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
  });

  it('does not fetch when enabled is false', () => {
    const mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    const { result } = renderHook(() => useZcashPrice(false));
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
