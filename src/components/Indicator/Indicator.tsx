import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Indicator.css';

export type IndicatorPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type IndicatorColor = 'accent' | 'default' | 'warning' | 'error';
export type IndicatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IndicatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  label?: ReactNode;
  position?: IndicatorPosition;
  color?: IndicatorColor;
  size?: IndicatorSize;
  withBorder?: boolean;
  offset?: number;
  disabled?: boolean;
  processing?: boolean;
  inline?: boolean;
}

export const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(function Indicator(
  { children, label, position = 'top-end', color = 'accent', size = 'md', withBorder = false, offset, disabled = false, processing = false, inline = false, className, style, ...rest },
  ref
) {
  const classes = ['indicator', inline && 'indicator--inline', !disabled && 'indicator--visible', className].filter(Boolean).join(' ');

  const dotClasses = [
    'indicator__dot',
    `indicator__dot--position-${position}`,
    `indicator__dot--color-${color}`,
    `indicator__dot--size-${size}`,
    label == null && 'indicator__dot--empty',
    withBorder && 'indicator__dot--with-border',
    processing && 'indicator__dot--processing',
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle: React.CSSProperties = {
    ...(offset !== undefined
      ? ({
          '--indicator-offset': `${offset}px`,
        } as React.CSSProperties)
      : null),
    ...style,
  };

  return (
    <div ref={ref} className={classes} style={mergedStyle} {...rest}>
      {children}
      {!disabled && (
        <span className={dotClasses} aria-hidden="true">
          {label != null && <span className="indicator__label">{label}</span>}
        </span>
      )}
    </div>
  );
});
