import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Chip.css';

export type ChipSize = 'xs' | 'sm' | 'md';
export type ChipVariant = 'default' | 'accent' | 'warning' | 'subtle';
export type ChipShape = 'square' | 'rounded' | 'pill';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  size?: ChipSize;
  variant?: ChipVariant;
  shape?: ChipShape;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onRemove?: () => void;
  removeAriaLabel?: string;
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    size = 'md',
    variant = 'default',
    shape = 'pill',
    leftSection,
    rightSection,
    onRemove,
    removeAriaLabel = 'Удалить',
    selected = false,
    onClick,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const interactive = Boolean(onClick) && !disabled;

  const classes = [
    'chip',
    `chip--size-${size}`,
    `chip--variant-${variant}`,
    `chip--shape-${shape}`,
    interactive && 'chip--interactive',
    selected && 'chip--selected',
    onRemove && 'chip--with-remove',
    disabled && 'chip--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!interactive) return;
    onClick?.();
  };

  const handleRemove = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onRemove?.();
  };

  return (
    <button ref={ref} type={type} className={classes} onClick={handleClick} disabled={disabled} aria-pressed={interactive ? selected : undefined} {...rest}>
      {leftSection && (
        <span className="chip__section chip__section--left" aria-hidden="true">
          {leftSection}
        </span>
      )}

      <span className="chip__label">{children}</span>

      {rightSection && (
        <span className="chip__section chip__section--right" aria-hidden="true">
          {rightSection}
        </span>
      )}

      {onRemove && (
        <span
          className="chip__remove"
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={removeAriaLabel}
          onClick={handleRemove}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRemove(e as unknown as React.MouseEvent<HTMLSpanElement>);
            }
          }}
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
    </button>
  );
});
