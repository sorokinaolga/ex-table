import { useId } from 'react';
import type { ReactNode } from 'react';
import { Radio } from '../Radio/Radio';
import type { RadioSize } from '../Radio/Radio';
import './RadioGroup.css';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  data?: RadioGroupOption[];
  children?: ReactNode;

  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;

  size?: RadioSize;
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  required?: boolean;

  className?: string;
  'aria-label'?: string;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  data,
  children,
  label,
  description,
  error,
  size = 'md',
  orientation = 'vertical',
  disabled = false,
  required,
  className,
  'aria-label': ariaLabel,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? `radio-group-${autoName}`;

  const groupId = `radio-group-${autoName}`;
  const descId = `${groupId}-desc`;
  const errorId = `${groupId}-error`;

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = ['radio-group', `radio-group--${orientation}`, showError && 'radio-group--error', disabled && 'radio-group--disabled', className].filter(Boolean).join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  const isControlled = value !== undefined;

  return (
    <div className={rootClasses} role="radiogroup" aria-label={ariaLabel} aria-describedby={describedBy}>
      {label && (
        <div className="radio-group__label">
          {label}
          {required && (
            <span className="radio-group__required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </div>
      )}

      {showDescription && (
        <div id={descId} className="radio-group__description">
          {description}
        </div>
      )}

      <div className="radio-group__items">
        {data
          ? data.map((opt) => (
              <Radio
                key={opt.value}
                name={groupName}
                value={opt.value}
                label={opt.label}
                description={opt.description}
                size={size}
                disabled={disabled || opt.disabled}
                required={required}
                {...(isControlled ? { checked: value === opt.value } : { defaultChecked: defaultValue === opt.value })}
                onChange={() => handleChange(opt.value)}
              />
            ))
          : children}
      </div>

      {showError && (
        <div id={errorId} className="radio-group__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
