import { palette, radius, spacing, fontSize } from './tokens';

export type ColorScheme = 'light' | 'dark';

export interface SemanticTheme {
  bg: string;
  bgSubtle: string;
  fg: string;
  fgSubtle: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  elevated: string;
  shadowSm: string;
  shadowLg: string;
  border: string;
  borderHover: string;
  borderSubtle: string;

  accent: string;
  accentHover: string;
  accentActive: string;
  accentFg: string;
  accentSubtle: string;

  warning: string;
  warningHover: string;
  warningActive: string;
  warningFg: string;

  error: string;
  errorFg: string;

  disabledBg: string;
  disabledFg: string;
  disabledBorder: string;

  placeholder: string;
  muted: string;

  focusRing: string;
}

export const lightTheme: SemanticTheme = {
  bg: palette.white,
  bgSubtle: palette.gray[0],
  fg: palette.gray[8],
  fgSubtle: palette.gray[7],
  surface: palette.white,
  surfaceHover: palette.gray[1],
  surfaceActive: palette.gray[2],
  border: palette.gray[4],
  elevated: '#fff',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 8px 24px rgba(0, 0, 0, 0.12)',
  borderHover: palette.gray[5],
  borderSubtle: palette.gray[2],

  accent: palette.green[7],
  accentHover: palette.green[8],
  accentActive: palette.green[9],
  accentFg: palette.white,
  accentSubtle: palette.green[0],

  warning: palette.orange[8],
  warningHover: palette.orange[9],
  warningActive: '#b8410a',
  warningFg: palette.white,

  error: palette.red[8],
  errorFg: palette.white,

  disabledBg: palette.gray[1],
  disabledFg: palette.gray[5],
  disabledBorder: palette.gray[3],

  placeholder: palette.gray[6],
  muted: palette.gray[6],

  focusRing: '0 0 0 3px rgba(12, 166, 120, 0.2)',
};

export const darkTheme: SemanticTheme = {
  bg: '#141418',
  bgSubtle: '#141418',
  fg: palette.gray[1],
  fgSubtle: palette.gray[5],
  surface: '#1f1f23',
  surfaceHover: '#2a2a2e',
  surfaceActive: '#3a3a42',
  border: '#3d3d44',
  elevated: '#26262b',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  borderHover: '#4d4d55',
  borderSubtle: '#2a2a2e',

  accent: palette.green[6],
  accentHover: palette.green[5],
  accentActive: palette.green[7],
  accentFg: '#081c15',
  accentSubtle: '#17332a',

  warning: palette.orange[7],
  warningHover: palette.orange[6],
  warningActive: palette.orange[8],
  warningFg: palette.white,

  error: palette.red[5],
  errorFg: palette.white,

  disabledBg: '#2a2a2e',
  disabledFg: palette.gray[6],
  disabledBorder: '#3d3d44',

  placeholder: palette.gray[6],
  muted: '#909296',

  focusRing: '0 0 0 3px rgba(18, 184, 134, 0.25)',
};

export interface Theme {
  colorScheme: ColorScheme;
  light: SemanticTheme;
  dark: SemanticTheme;
  radius: typeof radius;
  spacing: typeof spacing;
  fontSize: typeof fontSize;
}

export const defaultTheme: Theme = {
  colorScheme: 'light',
  light: lightTheme,
  dark: darkTheme,
  radius,
  spacing,
  fontSize,
};

export function createTheme(overrides: Partial<Theme> = {}): Theme {
  return {
    ...defaultTheme,
    ...overrides,
    light: { ...defaultTheme.light, ...overrides.light },
    dark: { ...defaultTheme.dark, ...overrides.dark },
    radius: { ...defaultTheme.radius, ...overrides.radius },
    spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    fontSize: { ...defaultTheme.fontSize, ...overrides.fontSize },
  };
}
