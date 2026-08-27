export const palette = {
  gray: {
    0: '#f8f9fa',
    1: '#f1f3f5',
    2: '#e9ecef',
    3: '#dee2e6',
    4: '#ced4da',
    5: '#adb5bd',
    6: '#868e96',
    7: '#495057',
    8: '#212529',
    9: '#141418',
  },
  green: {
    0: '#e6fcf5',
    1: '#c3fae8',
    2: '#96f2d7',
    3: '#63e6be',
    4: '#38d9a9',
    5: '#20c997',
    6: '#12b886',
    7: '#0ca678',
    8: '#099268',
    9: '#087f5b',
  },
  orange: {
    0: '#fff4e6',
    1: '#ffe8cc',
    2: '#ffd8a8',
    3: '#ffc078',
    4: '#ffa94d',
    5: '#ff922b',
    6: '#fd7e14',
    7: '#f76707',
    8: '#e8590c',
    9: '#d9480f',
  },
  red: {
    0: '#fff5f5',
    1: '#ffe3e3',
    2: '#ffc9c9',
    3: '#ffa8a8',
    4: '#ff8787',
    5: '#ff6b6b',
    6: '#fa5252',
    7: '#f03e3e',
    8: '#e03131',
    9: '#c92a2a',
  },
  blue: {
    0: '#e7f5ff',
    1: '#d0ebff',
    2: '#a5d8ff',
    3: '#74c0fc',
    4: '#4dabf7',
    5: '#339af0',
    6: '#228be6',
    7: '#1c7ed6',
    8: '#1971c2',
    9: '#1864ab',
  },
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
} as const;

export const radius = {
  xs: '3px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  pill: '999px',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '13px',
  md: '14px',
  lg: '16px',
  xl: '20px',
} as const;

export const lineHeight = {
  xs: '1.4',
  sm: '1.45',
  md: '1.5',
  lg: '1.5',
  xl: '1.35',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type Palette = typeof palette;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
export type FontWeight = typeof fontWeight;
