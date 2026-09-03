import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import './Paper.css';

export type PaperRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type PaperShadow = 'xs' | 'sm' | 'md' | 'lg' | 'none';
export type PaperPadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  radius?: PaperRadius;
  shadow?: PaperShadow;
  padding?: PaperPadding;
  withBorder?: boolean;
  variant?: 'surface' | 'elevated' | 'transparent';
  p?: number | string;
  children?: ReactNode;
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { as: Component = 'div', radius = 'md', shadow = 'none', padding = 'md', withBorder = false, variant = 'surface', p, className, style, children, ...rest },
  ref
) {
  const classes = ['paper', `paper--radius-${radius}`, `paper--shadow-${shadow}`, `paper--padding-${padding}`, `paper--variant-${variant}`, withBorder && 'paper--with-border', className]
    .filter(Boolean)
    .join(' ');

  const mergedStyle: CSSProperties = {
    ...(p !== undefined ? { padding: p } : null),
    ...style,
  };

  return (
    <Component ref={ref as never} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});
