import { useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createTheme, type Theme } from './theme';
import type { ColorScheme } from './theme';
import { resolveTheme } from './resolveTheme';
import { useLocalStorage } from '../storage/useLocalStorage';
import { STORAGE_KEYS } from '../storage/keys';
import { ThemeContext } from './theme-context';

const STYLE_ELEMENT_ID = 'theme-variables';

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
  initialColorScheme?: ColorScheme;
  target?: HTMLElement | null;
}

export function ThemeProvider({ children, theme: themeProp, initialColorScheme = 'light', target }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(STORAGE_KEYS.theme, initialColorScheme);

  const theme = useMemo(() => themeProp ?? createTheme({ colorScheme }), [themeProp, colorScheme]);

  const cssVariables = useMemo(() => resolveTheme(theme), [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let style = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ELEMENT_ID;
      document.head.appendChild(style);
    }

    style.textContent = cssVariables;
  }, [cssVariables]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = target ?? document.documentElement;
    el.setAttribute('data-theme', colorScheme);
  }, [colorScheme, target]);

  const toggle = useCallback(() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light')), [setColorScheme]);

  const value = useMemo(() => ({ colorScheme, toggle, setColorScheme, theme }), [colorScheme, toggle, setColorScheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
