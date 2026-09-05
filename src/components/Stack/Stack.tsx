import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Stack.css';

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
export type StackJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  gap?: StackGap | number | string;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const GAP_TO_VAR: Record<StackGap, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

function resolveGap(gap: StackGap | number | string): string {
  if (typeof gap === 'number') return `${gap}px`;
  if (gap in GAP_TO_VAR) return GAP_TO_VAR[gap as StackGap];
  return gap;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { as: Component = 'div', gap = 'md', align = 'stretch', justify = 'flex-start', wrap = false, fullWidth = false, className, style, children, ...rest },
  ref
) {
  const classes = ['stack', fullWidth && 'stack--full-width', wrap && 'stack--wrap', className].filter(Boolean).join(' ');

  const mergedStyle: React.CSSProperties = {
    '--stack-gap': resolveGap(gap),
    '--stack-align': align,
    '--stack-justify': justify,
    ...style,
  } as React.CSSProperties;

  return (
    <Component ref={ref as never} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});
