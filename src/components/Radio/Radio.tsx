import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Radio.css';

export type RadioSize = 'xs' | 'sm' | 'md';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: RadioSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ size = 'md', label, description, error, disabled, id, className, ...rest }, ref) {
  const autoId = useId();
  const inputId = id ?? `radio-${autoId}`;
  const descId = `${inputId}-desc`;
  const errorId = `${inputId}-error`;

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = ['radio', `radio--size-${size}`, disabled && 'radio--disabled', showError && 'radio--error', className].filter(Boolean).join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  return (
    <div className={rootClasses}>
      <label className="radio__label" htmlFor={inputId}>
        <span className="radio__circle">
          <input ref={ref} id={inputId} type="radio" className="radio__input" disabled={disabled} aria-invalid={showError || undefined} aria-describedby={describedBy} {...rest} />
          <span className="radio__dot" aria-hidden="true" />
        </span>

        {(label || description) && (
          <span className="radio__text">
            {label && <span className="radio__label-text">{label}</span>}
            {showDescription && (
              <span id={descId} className="radio__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {showError && (
        <div id={errorId} className="radio__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});
