import { forwardRef, useCallback, useRef, useState } from 'react';
import type { InputProps } from '../Input/Input';
import './NumberInput.css';

export interface NumberInputProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type' | 'leftSection' | 'rightSection'> {
  value?: number | '';
  defaultValue?: number | '';
  onChange?: (value: number | '') => void;

  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
  allowNegative?: boolean;
  clampBehavior?: 'blur' | 'strict' | 'none';

  prefix?: string;
  suffix?: string;
  hideControls?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

function formatValue(value: number | '', thousandSeparator: string, decimalSeparator: string, precision?: number): string {
  if (value === '') return '';
  const num = precision != null ? value.toFixed(precision) : String(value);
  const [intPart, decPart] = num.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return decPart != null ? `${formattedInt}${decimalSeparator}${decPart}` : formattedInt;
}

function parseValue(raw: string, decimalSeparator: string, allowNegative: boolean): number | '' {
  let cleaned = raw.replace(/[^\d\-.,]/g, '');

  if (decimalSeparator !== '.') {
    cleaned = cleaned.replace(decimalSeparator, '.');
  }

  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
  }

  const negative = allowNegative && cleaned.startsWith('-');
  cleaned = cleaned.replace(/-/g, '');
  if (negative) cleaned = '-' + cleaned;

  if (cleaned === '' || cleaned === '-') return '';

  const num = Number(cleaned);
  return isNaN(num) ? '' : num;
}

function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min != null && result < min) result = min;
  if (max != null && result > max) result = max;
  return result;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    min,
    max,
    step = 1,
    precision,
    thousandSeparator = ' ',
    decimalSeparator = ',',
    allowNegative = false,
    clampBehavior = 'blur',
    prefix,
    suffix,
    hideControls = false,
    disabled,
    size = 'md',
    leftSection,
    rightSection,
    className,
    ...inputProps
  },
  ref
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<number | ''>(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const [displayValue, setDisplayValue] = useState(() => formatValue(value, thousandSeparator, decimalSeparator, precision));
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref]
  );

  const commit = useCallback(
    (next: number | '') => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const updateValue = useCallback(
    (next: number | '') => {
      if (next === '') {
        commit('');
        setDisplayValue('');
        return;
      }

      let clamped = next;
      if (clampBehavior === 'strict') {
        clamped = clamp(next, min, max);
      }
      if (precision != null) {
        clamped = Number(clamped.toFixed(precision));
      }

      commit(clamped);
      setDisplayValue(formatValue(clamped, thousandSeparator, decimalSeparator, precision));
    },
    [commit, clampBehavior, min, max, precision, thousandSeparator, decimalSeparator]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const parsed = parseValue(raw, decimalSeparator, allowNegative);
    // Не коммитим в onChange при каждом нажатии — только при blur/Enter
    // Но показываем валидное число
    if (parsed !== '') {
      const clamped = clampBehavior === 'strict' ? clamp(parsed, min, max) : parsed;
      if (!isControlled) setInternalValue(clamped);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseValue(displayValue, decimalSeparator, allowNegative);
    if (parsed === '') {
      updateValue('');
      return;
    }
    if (clampBehavior === 'blur') {
      updateValue(clamp(parsed, min, max));
    } else {
      updateValue(parsed);
    }
  };

  const handleFocus = () => setFocused(true);

  const handleStep = (direction: 1 | -1) => {
    const current = typeof value === 'number' ? value : 0;
    const next = current + step * direction;
    const clamped = clamp(next, min, max);
    if (precision != null) {
      updateValue(Number(clamped.toFixed(precision)));
    } else {
      updateValue(clamped);
    }
    inputRef.current?.focus();
  };

  const startHold = (direction: 1 | -1) => {
    handleStep(direction);

    holdTimerRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        handleStep(direction);
      }, 80);
    }, 400);
  };

  const stopHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    inputProps.onKeyDown?.(e);
  };

  const shownValue = focused ? displayValue : formatValue(value, thousandSeparator, decimalSeparator, precision);

  const controls = !hideControls && !disabled && (
    <div className="number-input__controls">
      <button
        type="button"
        tabIndex={-1}
        className="number-input__control"
        aria-label="Увеличить"
        onMouseDown={(e) => {
          e.preventDefault();
          startHold(1);
        }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => {
          e.preventDefault();
          startHold(1);
        }}
        onTouchEnd={stopHold}
      >
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="number-input__control"
        aria-label="Уменьшить"
        onMouseDown={(e) => {
          e.preventDefault();
          startHold(-1);
        }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => {
          e.preventDefault();
          startHold(-1);
        }}
        onTouchEnd={stopHold}
      >
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className={['number-input', `number-input--size-${size}`, disabled && 'number-input--disabled', className].filter(Boolean).join(' ')}>
      <div className="number-input__wrapper">
        {prefix && <span className="number-input__affix">{prefix}</span>}
        {leftSection && <span className="number-input__section number-input__section--left">{leftSection}</span>}
        <input
          {...inputProps}
          ref={setInputRef}
          type="text"
          inputMode="decimal"
          className="number-input__field"
          value={shownValue}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text');
            const parsed = parseValue(pasted, decimalSeparator, allowNegative);
            if (parsed !== '') {
              updateValue(clamp(parsed, min, max));
            }
          }}
        />
        {suffix && <span className="number-input__affix">{suffix}</span>}
        {rightSection && <span className="number-input__section number-input__section--right">{rightSection}</span>}
        {controls}
      </div>
    </div>
  );
});
