import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

export type InputSize = 'xs' | 'sm' | 'md';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  withAsterisk?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', label, description, error, leftSection, rightSection, withAsterisk, fullWidth = false, disabled, required, id, className, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = ['input', `input--size-${size}`, fullWidth && 'input--full-width', disabled && 'input--disabled', showError && 'input--error', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {label && (
        <label className="input__label" htmlFor={inputId}>
          {label}
          {(withAsterisk || required) && (
            <span className="input__required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}

      <div className="input__wrapper">
        {leftSection && <span className="input__section input__section--left">{leftSection}</span>}

        <input
          ref={ref}
          id={inputId}
          className="input__field"
          disabled={disabled}
          required={required}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? `${inputId}-error` : showDescription ? `${inputId}-desc` : undefined}
          {...rest}
        />

        {rightSection && <span className="input__section input__section--right">{rightSection}</span>}
      </div>

      {showError && (
        <div id={`${inputId}-error`} className="input__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={`${inputId}-desc`} className="input__description">
          {description}
        </div>
      )}
    </div>
  );
});
