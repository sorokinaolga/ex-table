import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './PinInput.css';

export type PinInputSize = 'xs' | 'sm' | 'md' | 'lg';
export type PinInputType = 'number' | 'alphanumeric' | 'text';

export interface PinInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: PinInputType;
  size?: PinInputSize;
  mask?: boolean;
  oneTimeCode?: boolean;

  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  withAsterisk?: boolean;
  disabled?: boolean;

  inputAriaLabel?: string;

  className?: string;
  id?: string;
  autoFocus?: boolean;
}

const TYPE_PATTERN: Record<PinInputType, RegExp> = {
  number: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
  text: /^.$/,
};

const INPUT_MODE: Record<PinInputType, 'numeric' | 'text'> = {
  number: 'numeric',
  alphanumeric: 'text',
  text: 'text',
};

const AUTO_COMPLETE: Record<PinInputType, string> = {
  number: 'one-time-code',
  alphanumeric: 'one-time-code',
  text: 'off',
};

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 4,
    value: valueProp,
    defaultValue = '',
    onChange,
    onComplete,
    type = 'number',
    size = 'md',
    mask = false,
    oneTimeCode = false,
    label,
    description,
    error,
    withAsterisk,
    disabled,
    inputAriaLabel = 'Символ кода',
    className,
    id,
    autoFocus = false,
  },
  ref
) {
  const autoId = useId();
  const groupId = id ?? `pin-${autoId}`;
  const descId = `${groupId}-desc`;
  const errorId = `${groupId}-error`;

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const prevLengthRef = useRef(value.length);

  const setInputRef = useCallback((index: number, node: HTMLInputElement | null) => {
    inputRefs.current[index] = node;
  }, []);

  const commit = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      if (next.length === length && next !== value) {
        onComplete?.(next);
      }
    },
    [isControlled, onChange, onComplete, length, value]
  );

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputRefs.current[clamped]?.focus();
    inputRefs.current[clamped]?.select();
  };

  const didAutoFocusRef = useRef(false);

  useEffect(() => {
    if (didAutoFocusRef.current) return;
    if (!autoFocus) return;
    didAutoFocusRef.current = true;

    const firstEmpty = chars.findIndex((c) => c === '');
    const targetIndex = firstEmpty === -1 ? length - 1 : firstEmpty;
    const node = inputRefs.current[targetIndex];
    node?.focus();
    node?.select();
  }, [autoFocus, chars, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const raw = e.target.value;
    const char = raw.slice(-1);

    if (char === '') {
      const next = chars.slice();
      next[index] = '';
      commit(next.join('').replace(/ /g, ''));
      return;
    }

    if (!TYPE_PATTERN[type].test(char)) return;

    const next = chars.slice();
    next[index] = char;
    const nextValue = next.join('');
    commit(nextValue);

    if (index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = chars.slice();
      if (next[index]) {
        next[index] = '';
        commit(next.join(''));
      } else if (index > 0) {
        next[index - 1] = '';
        commit(next.join(''));
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === 'Delete') {
      e.preventDefault();
      const next = chars.slice();
      next[index] = '';
      commit(next.join(''));
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusIndex(index - 1);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusIndex(index + 1);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      focusIndex(0);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      focusIndex(length - 1);
      return;
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pasted = e.clipboardData.getData('text');
    const pattern = TYPE_PATTERN[type];

    const validChars: string[] = [];
    for (const ch of pasted) {
      if (pattern.test(ch)) validChars.push(ch);
      if (validChars.length === length - index) break;
    }

    if (validChars.length === 0) return;

    const next = chars.slice();
    for (let i = 0; i < validChars.length; i++) {
      next[index + i] = validChars[i];
    }
    commit(next.join(''));

    const nextEmpty = index + validChars.length;
    if (nextEmpty < length) focusIndex(nextEmpty);
    else focusIndex(length - 1);
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  useEffect(() => {
    if (value.length < prevLengthRef.current) {
      // ничего не делаем
    }
    prevLengthRef.current = value.length;
  }, [value]);

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  const rootClasses = ['pin-input', `pin-input--size-${size}`, disabled && 'pin-input--disabled', showError && 'pin-input--error', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses} ref={ref}>
      {label && (
        <label className="pin-input__label" htmlFor={`${groupId}-0`}>
          {label}
          {withAsterisk && (
            <span className="pin-input__required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}

      <div className="pin-input__group" role="group">
        {chars.map((char, i) => (
          <input
            key={i}
            ref={(node) => setInputRef(i, node)}
            id={`${groupId}-${i}`}
            type={mask ? 'password' : 'text'}
            inputMode={INPUT_MODE[type]}
            autoComplete={oneTimeCode ? AUTO_COMPLETE[type] : 'off'}
            className="pin-input__cell"
            value={char}
            disabled={disabled}
            aria-label={`${inputAriaLabel} ${i + 1}`}
            aria-invalid={showError || undefined}
            aria-describedby={i === 0 ? describedBy : undefined}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={() => handleFocus(i)}
            maxLength={1}
          />
        ))}
      </div>

      {showError && (
        <div id={errorId} className="pin-input__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={descId} className="pin-input__description">
          {description}
        </div>
      )}
    </div>
  );
});
