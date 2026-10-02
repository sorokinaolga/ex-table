import { forwardRef, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import './Rating.css';

export type RatingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RatingColor = 'accent' | 'warning' | 'error' | 'default';

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;

  count?: number;
  size?: RatingSize;
  color?: RatingColor;
  emptyColor?: string;
  fractions?: number;

  readOnly?: boolean;
  disabled?: boolean;
  highlightSelectedOnly?: boolean;

  icon?: ReactNode;
  emptyIcon?: ReactNode;

  'aria-label'?: string;
  className?: string;
}

const SIZE_MAP: Record<RatingSize, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
};

const COLOR_VAR: Record<RatingColor, string> = {
  accent: 'var(--theme-accent)',
  warning: 'var(--theme-warning)',
  error: 'var(--theme-error)',
  default: 'var(--theme-fg-subtle)',
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = 0,
    onChange,
    onHover,
    count = 5,
    size = 'md',
    color = 'accent',
    emptyColor,
    fractions = 1,
    readOnly = false,
    disabled = false,
    highlightSelectedOnly = false,
    icon,
    emptyIcon,
    'aria-label': ariaLabel = 'Рейтинг',
    className,
  },
  ref
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;
  const interactive = !readOnly && !disabled;

  const commit = useCallback(
    (next: number) => {
      if (readOnly || disabled) return;
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [readOnly, disabled, isControlled, onChange]
  );

  const iconPx = SIZE_MAP[size];
  const colorValue = COLOR_VAR[color];
  const emptyColorValue = emptyColor ?? 'var(--theme-surface-active)';

  const finalIcon = icon ?? DEFAULT_ICON;
  const finalEmptyIcon = emptyIcon ?? icon ?? DEFAULT_ICON;

  const handleStarEnter = (starIndex: number) => {
    if (!interactive) return;

    setHovered(starIndex + 1);
    onHover?.(starIndex + 1);
  };

  const handleStarLeave = () => {
    if (!interactive) return;
    setHovered(null);
    onHover?.(0);
  };

  const handleClick = (starIndex: number) => {
    if (!interactive) return;
    commit(starIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      commit(Math.min(value + 1, count));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      commit(Math.max(value - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      commit(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      commit(count);
    } else if (/^[0-9]$/.test(e.key)) {
      const num = parseInt(e.key, 10);
      if (num >= 0 && num <= count) {
        e.preventDefault();
        commit(num);
      }
    }
  };

  const rootClasses = ['rating', `rating--size-${size}`, `rating--color-${color}`, readOnly && 'rating--read-only', disabled && 'rating--disabled', interactive && 'rating--interactive', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={rootClasses}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      tabIndex={interactive ? 0 : undefined}
      onMouseLeave={handleStarLeave}
      onKeyDown={handleKeyDown}
      style={
        {
          '--rating-icon-size': `${iconPx}px`,
          '--rating-color': colorValue,
          '--rating-empty-color': emptyColorValue,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: count }, (_, i) => {
        const starValue = i + 1;
        const isFilled = displayValue >= starValue;
        const isPartiallyFilled = fractions > 1 && !isFilled && displayValue > i;
        const fillPercent = isFilled ? 100 : isPartiallyFilled ? Math.min(100, Math.round((displayValue - i) * 100)) : 0;

        const showFilled = highlightSelectedOnly ? displayValue === starValue : isFilled || isPartiallyFilled;

        return (
          <button
            key={i}
            type="button"
            className={['rating__star', showFilled && 'rating__star--filled', fractions > 1 && 'rating__star--with-fractions'].filter(Boolean).join(' ')}
            tabIndex={-1}
            disabled={!interactive}
            aria-label={`${starValue} из ${count}`}
            aria-checked={value === starValue}
            role="radio"
            onMouseEnter={() => handleStarEnter(i)}
            onFocus={() => handleStarEnter(i)}
            onBlur={handleStarLeave}
            onClick={() => handleClick(i)}
          >
            <span className="rating__star-empty" aria-hidden="true">
              {finalEmptyIcon}
            </span>
            <span className="rating__star-filled" aria-hidden="true" style={{ width: `${fillPercent}%` }}>
              {finalIcon}
            </span>
          </button>
        );
      })}
    </div>
  );
});
