import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Container.css';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  size?: ContainerSize;
  fluid?: boolean;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none' | number | string;
  centered?: boolean;
  children?: ReactNode;
}

const PADDING_TO_VAR: Record<Exclude<ContainerProps['padding'], number | string | undefined>, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

function resolvePadding(padding: ContainerProps['padding']): string | undefined {
  if (padding === undefined) return undefined;
  if (typeof padding === 'number') return `${padding}px`;
  if (padding in PADDING_TO_VAR) {
    return PADDING_TO_VAR[padding as keyof typeof PADDING_TO_VAR];
  }
  return padding as string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { as: Component = 'div', size = 'md', fluid = false, padding = 'lg', centered = true, className, style, children, ...rest },
  ref
) {
  const classes = ['container', `container--size-${size}`, fluid && 'container--fluid', centered && 'container--centered', className].filter(Boolean).join(' ');

  const paddingValue = resolvePadding(padding);

  const mergedStyle: React.CSSProperties = {
    ...(paddingValue !== undefined
      ? {
          paddingLeft: paddingValue,
          paddingRight: paddingValue,
        }
      : null),
    ...style,
  };

  return (
    <Component ref={ref as never} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});
