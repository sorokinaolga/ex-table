import { createContext } from 'react';

export type ColorScheme = 'light' | 'dark';

export interface ThemeContextValue {
  colorScheme: ColorScheme;
  toggle: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
