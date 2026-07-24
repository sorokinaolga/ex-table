import { useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../storage/useLocalStorage';
import { STORAGE_KEYS } from '../storage/keys';
import { ThemeContext } from './theme-context';
import type { ColorScheme } from './theme-context';
import './theme.css';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(STORAGE_KEYS.theme, 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  const toggle = useCallback(() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light')), [setColorScheme]);

  const value = useMemo(() => ({ colorScheme, toggle, setColorScheme }), [colorScheme, toggle, setColorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
