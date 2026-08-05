import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Toggle.css';

export type ToggleSize = 'xs' | 'sm' | 'md';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: ToggleSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  offLabel?: ReactNode;
  onLabel?: ReactNode;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ size = 'md', label, description, error, offLabel, onLabel, disabled, id, className, checked, ...rest }, ref) {
  const autoId = useId();
  const inputId = id ?? `toggle-${autoId}`;
  const descId = `${inputId}-desc`;
  const errorId = `${inputId}-error`;

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = ['toggle', `toggle--size-${size}`, disabled && 'toggle--disabled', showError && 'toggle--error', className].filter(Boolean).join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  return (
    <div className={rootClasses}>
      <label className="toggle__label" htmlFor={inputId}>
        <span className="toggle__track">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="toggle__input"
            disabled={disabled}
            checked={checked}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          <span className="toggle__thumb" aria-hidden="true" />
          {(offLabel || onLabel) && (
            <span className="toggle__track-labels" aria-hidden="true">
              <span className="toggle__track-label toggle__track-label--off">{offLabel}</span>
              <span className="toggle__track-label toggle__track-label--on">{onLabel}</span>
            </span>
          )}
        </span>

        {(label || description) && (
          <span className="toggle__text">
            {label && <span className="toggle__label-text">{label}</span>}
            {showDescription && (
              <span id={descId} className="toggle__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {showError && (
        <div id={errorId} className="toggle__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});
