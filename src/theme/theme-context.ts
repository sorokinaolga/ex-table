import { createContext } from 'react';
import type { ColorScheme, Theme } from './theme';

export type { ColorScheme, Theme };

export interface ThemeContextValue {
  colorScheme: ColorScheme;
  theme: Theme;
  toggle: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
