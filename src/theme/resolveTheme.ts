import type { SemanticTheme, Theme } from './theme';

const VAR_MAP: Record<keyof SemanticTheme, string> = {
  bg: '--theme-bg',
  bgSubtle: '--theme-bg-subtle',
  fg: '--theme-fg',
  fgSubtle: '--theme-fg-subtle',
  surface: '--theme-surface',
  surfaceHover: '--theme-surface-hover',
  surfaceActive: '--theme-surface-active',
  elevated: '--theme-elevated',

  border: '--theme-border',
  borderHover: '--theme-border-hover',
  borderSubtle: '--theme-border-subtle',

  accent: '--theme-accent',
  accentHover: '--theme-accent-hover',
  accentActive: '--theme-accent-active',
  accentFg: '--theme-accent-fg',
  accentSubtle: '--theme-accent-subtle',

  warning: '--theme-warning',
  warningHover: '--theme-warning-hover',
  warningActive: '--theme-warning-active',
  warningFg: '--theme-warning-fg',

  error: '--theme-error',
  errorFg: '--theme-error-fg',

  disabledBg: '--theme-disabled-bg',
  disabledFg: '--theme-disabled-fg',
  disabledBorder: '--theme-disabled-border',

  placeholder: '--theme-placeholder',
  muted: '--theme-muted',

  shadowSm: '--theme-shadow-sm',
  shadowLg: '--theme-shadow-lg',
  focusRing: '--theme-focus-ring',
};

function semanticToCss(t: SemanticTheme): string {
  return (Object.keys(VAR_MAP) as Array<keyof SemanticTheme>).map((key) => `  ${VAR_MAP[key]}: ${t[key]};`).join('\n');
}

function scaleToCss(prefix: string, obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `  --${prefix}-${k}: ${v};`)
    .join('\n');
}

export function resolveTheme(theme: Theme): string {
  const { light, dark, radius, spacing, fontSize, lineHeight, fontWeight } = theme;

  return `
/* Автогенерируется ThemeProvider. Не редактируйте вручную. */

:root {
${scaleToCss('radius', radius)}
${scaleToCss('spacing', spacing)}
${scaleToCss('font-size', fontSize)}
${scaleToCss('line-height', lineHeight)}
${scaleToCss('font-weight', fontWeight)}
}

:root[data-theme='light'] {
${semanticToCss(light)}
}

:root[data-theme='dark'] {
${semanticToCss(dark)}
}
`.trim();
}
