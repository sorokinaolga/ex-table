import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Divider.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerSize = 'xs' | 'sm' | 'md';
export type DividerLabelPosition = 'left' | 'center' | 'right';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  size?: DividerSize;
  variant?: DividerVariant;
  label?: ReactNode;
  labelPosition?: DividerLabelPosition;
  margin?: number | string;
  color?: 'default' | 'subtle' | 'accent' | 'error';
  fullWidth?: boolean;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', size = 'sm', variant = 'solid', label, labelPosition = 'center', margin, color = 'subtle', fullWidth = true, className, style, ...rest },
  ref
) {
  const hasLabel = label != null && label !== '';

  const classes = [
    'divider',
    `divider--orientation-${orientation}`,
    `divider--size-${size}`,
    `divider--variant-${variant}`,
    `divider--color-${color}`,
    hasLabel && 'divider--with-label',
    hasLabel && `divider--label-${labelPosition}`,
    fullWidth && orientation === 'horizontal' && 'divider--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle: React.CSSProperties = {
    ...(margin !== undefined ? (orientation === 'horizontal' ? { marginTop: margin, marginBottom: margin } : { marginLeft: margin, marginRight: margin }) : null),
    ...style,
  };

  if (!hasLabel) {
    return <div ref={ref} className={classes} style={mergedStyle} role="separator" aria-orientation={orientation} {...rest} />;
  }

  return (
    <div ref={ref} className={classes} style={mergedStyle} role="separator" aria-orientation={orientation} {...rest}>
      <span className="divider__label">{label}</span>
    </div>
  );
});
