import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './ButtonIcon.css';

export type ButtonIconSize = 'xs' | 'sm' | 'md';
export type ButtonIconVariant = 'default' | 'accent' | 'warning' | 'subtle';
export type ButtonIconShape = 'square' | 'rounded' | 'circle';

export interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonIconSize;
  variant?: ButtonIconVariant;
  shape?: ButtonIconShape;
  children: ReactNode;
  'aria-label'?: string;
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  { size = 'md', variant = 'default', shape = 'rounded', className, children, type = 'button', ...rest },
  ref
) {
  const classes = ['icon-btn', `icon-btn--size-${size}`, `icon-btn--variant-${variant}`, `icon-btn--shape-${shape}`, className].filter(Boolean).join(' ');

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      <span className="icon-btn__icon" aria-hidden="true">
        {children}
      </span>
    </button>
  );
});
