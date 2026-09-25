import { forwardRef, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { Input } from '../Input/Input';
import type { InputProps } from '../Input/Input';
import './PasswordInput.css';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightSection'> {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;

  visibleIcon?: ReactNode;
  hiddenIcon?: ReactNode;
  toggleAriaLabel?: string;
}

const EYE_OPEN = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_CLOSED = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { visible: visibleProp, defaultVisible = false, onVisibleChange, visibleIcon, hiddenIcon, toggleAriaLabel, disabled, ...inputProps },
  ref
) {
  const isControlled = visibleProp !== undefined;
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const visible = isControlled ? visibleProp : internalVisible;

  const toggle = useCallback(() => {
    const next = !visible;
    if (!isControlled) setInternalVisible(next);
    onVisibleChange?.(next);
  }, [visible, isControlled, onVisibleChange]);

  const showIcon = visible ? (hiddenIcon ?? EYE_CLOSED) : (visibleIcon ?? EYE_OPEN);

  const label = toggleAriaLabel ?? (visible ? 'Скрыть пароль' : 'Показать пароль');

  return (
    <Input
      {...inputProps}
      ref={ref}
      type={visible ? 'text' : 'password'}
      disabled={disabled}
      rightSection={
        <button type="button" className="password-input__toggle" aria-label={label} aria-pressed={visible} tabIndex={disabled ? -1 : 0} disabled={disabled} onClick={toggle}>
          {showIcon}
        </button>
      }
    />
  );
});
