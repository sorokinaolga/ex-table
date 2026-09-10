import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Loader.css';

export type LoaderVariant = 'oval' | 'dots' | 'bars';
export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderColor = 'accent' | 'default' | 'warning' | 'error' | 'inherit';

export interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  fullWidth?: boolean;
  'aria-label'?: string;
}

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(function Loader(
  { variant = 'oval', size = 'md', color = 'accent', fullWidth = false, className, 'aria-label': ariaLabel = 'Загрузка', ...rest },
  ref
) {
  const classes = ['loader', `loader--variant-${variant}`, `loader--size-${size}`, `loader--color-${color}`, fullWidth && 'loader--full-width', className].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} role="status" aria-label={ariaLabel} {...rest}>
      {variant === 'dots' && (
        <>
          <span className="loader__dot" />
          <span className="loader__dot" />
          <span className="loader__dot" />
        </>
      )}
      {variant === 'bars' && (
        <>
          <span className="loader__bar" />
          <span className="loader__bar" />
          <span className="loader__bar" />
        </>
      )}
      {variant === 'oval' && <span className="loader__oval" />}
    </span>
  );
});
