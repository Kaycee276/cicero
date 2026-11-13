import { useState, useEffect } from 'react';

interface ZcashPriceState {
  usdPrice: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// In-memory cache to share across component instances
let cachedPrice: number | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60000; // 1 minute

export function useZcashPrice(enabled = true) {
  const [state, setState] = useState<ZcashPriceState>({
    usdPrice: cachedPrice,
    loading: !cachedPrice && enabled,
    error: null,
    lastUpdated: lastFetchTime || null,
  });

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    const now = Date.now();

    // Use cached value if fresh
    if (cachedPrice && now - lastFetchTime < CACHE_DURATION_MS) {
      setState({
        usdPrice: cachedPrice,
        loading: false,
        error: null,
        lastUpdated: lastFetchTime,
      });
      return;
    }

    async function fetchPrice() {
      try {
        // Primary: CoinGecko public API
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd',
          { signal: AbortSignal.timeout(4000) }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const price = data?.zcash?.usd;

        if (typeof price === 'number') {
          cachedPrice = price;
          lastFetchTime = Date.now();
          if (isMounted) {
            setState({
              usdPrice: price,
              loading: false,
              error: null,
              lastUpdated: lastFetchTime,
            });
          }
          return;
        }
        throw new Error('Invalid price payload');
      } catch (err: unknown) {
        // Fallback: Binance public ticker
        try {
          const binanceRes = await fetch(
            'https://api.binance.com/api/v3/ticker/price?symbol=ZECUSDT',
            { signal: AbortSignal.timeout(3000) }
          );
          if (binanceRes.ok) {
            const bData = await binanceRes.json();
            const bPrice = parseFloat(bData.price);
            if (!isNaN(bPrice) && bPrice > 0) {
              cachedPrice = bPrice;
              lastFetchTime = Date.now();
              if (isMounted) {
                setState({
                  usdPrice: bPrice,
                  loading: false,
                  error: null,
                  lastUpdated: lastFetchTime,
                });
              }
              return;
            }
          }
        } catch {
          // Both failed, use fallback baseline or keep existing
        }

        if (isMounted) {
          const fallback = cachedPrice ?? 38.5; // sensible baseline fallback
          setState({
            usdPrice: fallback,
            loading: false,
            error: err instanceof Error ? err.message : 'Price fetch error',
            lastUpdated: Date.now(),
          });
        }
      }
    }

    fetchPrice();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  const convertZecToUsd = (zecAmount: number | string): string | null => {
    const num = typeof zecAmount === 'number' ? zecAmount : parseFloat(zecAmount);
    if (isNaN(num) || state.usdPrice === null) return null;
    return (num * state.usdPrice).toFixed(2);
  };

  return {
    ...state,
    convertZecToUsd,
  };
}
