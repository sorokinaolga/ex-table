import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeVariant =
  | 'default'
  | 'accent'
  | 'warning'
  | 'error'
  | 'outline';
export type BadgeShape = 'square' | 'rounded' | 'pill';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: BadgeSize;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  dot?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    size = 'md',
    variant = 'default',
    shape = 'pill',
    leftSection,
    rightSection,
    dot = false,
    fullWidth = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    'badge',
    `badge--size-${size}`,
    `badge--variant-${variant}`,
    `badge--shape-${shape}`,
    dot && 'badge--dot',
    fullWidth && 'badge--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {leftSection && (
        <span className="badge__section" aria-hidden="true">
          {leftSection}
        </span>
      )}
      {!dot && <span className="badge__label">{children}</span>}
      {rightSection && (
        <span className="badge__section" aria-hidden="true">
          {rightSection}
        </span>
      )}
    </span>
  );
});