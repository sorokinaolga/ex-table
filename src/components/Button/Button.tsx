import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'default' | 'accent' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'md', leftSection, rightSection, fullWidth = false, loading = false, disabled, className, children, ...rest },
  ref
) {
  const classes = ['btn', `btn--variant-${variant}`, `btn--size-${size}`, fullWidth && 'btn--full-width', loading && 'btn--loading', className].filter(Boolean).join(' ');

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...rest}>
      {leftSection && <span className="btn__section">{leftSection}</span>}
      <span className="btn__label">{children}</span>
      {rightSection && <span className="btn__section">{rightSection}</span>}
    </button>
  );
});
