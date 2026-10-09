import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Pagination.css';

export type PaginationSize = 'xs' | 'sm' | 'md' | 'lg';
export type PaginationColor = 'accent' | 'warning' | 'error' | 'default';

export interface PaginationProps {
  total: number;
  value?: number;
  defaultValue?: number;
  onChange?: (page: number) => void;

  siblings?: number;
  boundaries?: number;
  withEdges?: boolean;
  withControls?: boolean;

  size?: PaginationSize;
  color?: PaginationColor;
  disabled?: boolean;

  dotsIcon?: ReactNode;
  getItemAriaLabel?: (page: number) => string;
  renderItem?: (page: number, active: boolean) => ReactNode;

  'aria-label'?: string;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildRange(total: number, current: number, siblings: number, boundaries: number): Array<number | 'dots'> {
  if (total <= 0) return [];

  const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

  if (totalPageNumbers >= total) {
    return range(1, total);
  }

  const leftSiblingIndex = Math.max(current - siblings, boundaries + 1);
  const rightSiblingIndex = Math.min(current + siblings, total - boundaries);

  const shouldShowLeftDots = leftSiblingIndex > boundaries + 1;
  const shouldShowRightDots = rightSiblingIndex < total - boundaries;

  const firstBoundaries = boundaries > 0 ? range(1, boundaries) : [];
  const lastBoundaries = boundaries > 0 ? range(total - boundaries + 1, total) : [];

  const middle: Array<number | 'dots'> = [];
  if (shouldShowLeftDots) middle.push('dots');
  middle.push(...range(leftSiblingIndex, rightSiblingIndex));
  if (shouldShowRightDots) middle.push('dots');

  const all: Array<number | 'dots'> = [...firstBoundaries, ...middle, ...lastBoundaries];

  const seen = new Set<number>();
  const result: Array<number | 'dots'> = [];
  for (const item of all) {
    if (item === 'dots') {
      result.push('dots');
    } else if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

const DEFAULT_DOTS = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const PREV_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const NEXT_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    value: valueProp,
    defaultValue = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    withControls = true,
    size = 'md',
    color = 'accent',
    disabled = false,
    dotsIcon,
    getItemAriaLabel,
    renderItem,
    'aria-label': ariaLabel = 'Пагинация',
    className,
  },
  ref
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = isControlled ? valueProp! : internalValue;

  const commit = (page: number) => {
    if (disabled) return;
    const clamped = Math.max(1, Math.min(total, page));
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const items = buildRange(total, current, siblings, boundaries);

  const defaultLabel = (page: number) => (getItemAriaLabel ? getItemAriaLabel(page) : `Страница ${page}`);

  const rootClasses = ['pagination', `pagination--size-${size}`, `pagination--color-${color}`, disabled && 'pagination--disabled', className].filter(Boolean).join(' ');

  return (
    <nav ref={ref} aria-label={ariaLabel} className={rootClasses}>
      <ul className="pagination__list">
        {withControls && (
          <li className="pagination__item">
            <button type="button" className="pagination__button pagination__button--control" aria-label="Предыдущая страница" disabled={disabled || current <= 1} onClick={() => commit(current - 1)}>
              {PREV_ICON}
            </button>
          </li>
        )}

        {items.map((item, i) => {
          if (item === 'dots') {
            return (
              <li key={`dots-${i}`} className="pagination__item">
                <span className="pagination__dots" aria-hidden="true">
                  {dotsIcon ?? DEFAULT_DOTS}
                </span>
              </li>
            );
          }

          const active = item === current;
          const label = defaultLabel(item);

          if (renderItem) {
            return (
              <li key={item} className="pagination__item">
                {renderItem(item, active)}
              </li>
            );
          }

          return (
            <li key={item} className="pagination__item">
              <button
                type="button"
                className={['pagination__button', active && 'pagination__button--active'].filter(Boolean).join(' ')}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                disabled={disabled}
                onClick={() => commit(item)}
              >
                {item}
              </button>
            </li>
          );
        })}

        {withControls && (
          <li className="pagination__item">
            <button
              type="button"
              className="pagination__button pagination__button--control"
              aria-label="Следующая страница"
              disabled={disabled || current >= total}
              onClick={() => commit(current + 1)}
            >
              {NEXT_ICON}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});
