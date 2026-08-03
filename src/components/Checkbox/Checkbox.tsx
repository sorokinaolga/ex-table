import { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Checkbox.css';

export type CheckboxSize = 'xs' | 'sm' | 'md';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: CheckboxSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', label, description, error, indeterminate = false, disabled, id, className, checked, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? `checkbox-${autoId}`;
  const descId = `${inputId}-desc`;
  const errorId = `${inputId}-error`;

  const innerRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  };

  // indeterminate — не HTML-атрибут, ставится через DOM-свойство
  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = ['checkbox', `checkbox--size-${size}`, disabled && 'checkbox--disabled', showError && 'checkbox--error', indeterminate && 'checkbox--indeterminate', className]
    .filter(Boolean)
    .join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  return (
    <div className={rootClasses}>
      <label className="checkbox__label" htmlFor={inputId}>
        <span className="checkbox__box">
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            className="checkbox__input"
            disabled={disabled}
            checked={indeterminate ? undefined : checked}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          <span className="checkbox__indicator" aria-hidden="true">
            <svg className="checkbox__icon checkbox__icon--check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 8 7 12 13 4" />
            </svg>
            <svg className="checkbox__icon checkbox__icon--indeterminate" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          </span>
        </span>

        {(label || description) && (
          <span className="checkbox__text">
            {label && <span className="checkbox__label-text">{label}</span>}
            {showDescription && (
              <span id={descId} className="checkbox__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {showError && (
        <div id={errorId} className="checkbox__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});
