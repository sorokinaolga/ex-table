import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './theme-context.ts';
import type { ColorScheme } from './theme-context.ts';
import './theme.css';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  const toggle = () => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ colorScheme, toggle, setColorScheme }}>{children}</ThemeContext.Provider>;
}
