import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Text.css';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'default' | 'dimmed' | 'muted' | 'accent' | 'error' | 'warning' | 'inherit';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  as?: ElementType;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  truncate?: boolean;
  lineClamp?: number;
  italic?: boolean;
  underline?: boolean;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Component = 'p', size = 'md', weight = 'regular', color = 'default', truncate = false, lineClamp, italic = false, underline = false, className, children, ...rest },
  ref
) {
  const classes = [
    'text',
    `text--size-${size}`,
    `text--weight-${weight}`,
    `text--color-${color}`,
    italic && 'text--italic',
    underline && 'text--underline',
    truncate && 'text--truncate',
    lineClamp != null && 'text--line-clamp',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = lineClamp != null ? ({ '--text-line-clamp': lineClamp } as React.CSSProperties) : undefined;

  return (
    <Component ref={ref as never} className={classes} style={style} {...rest}>
      {children}
    </Component>
  );
});
