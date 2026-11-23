import { useEffect, useState } from 'react';

export type CiceroColorScheme = 'light' | 'dark';

/** Tracks the host page theme so portalled dialogs match the surrounding app. */
export function useDocumentTheme(): CiceroColorScheme {
  const [theme, setTheme] = useState<CiceroColorScheme>('dark');

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
