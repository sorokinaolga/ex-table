import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { InputProps } from '../Input/Input';
import './MaskedInput.css';

export interface MaskedInputProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  mask: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  allowPartial?: boolean;
}

const PLACEHOLDER_PATTERN: Record<string, RegExp> = {
  '9': /[0-9]/,
  A: /[a-zA-Zа-яА-Я]/,
  '*': /[a-zA-Zа-яА-Я0-9]/,
};

function extractRaw(input: string, mask: string): string {
  const rawChars: string[] = [];
  let inputIndex = 0;

  for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
    const maskChar = mask[maskIndex];
    const pattern = PLACEHOLDER_PATTERN[maskChar];

    if (!pattern) continue;

    while (inputIndex < input.length) {
      const inputChar = input[inputIndex];
      inputIndex++;
      if (pattern.test(inputChar)) {
        rawChars.push(inputChar);
        break;
      }
    }
  }

  return rawChars.join('');
}

function applyMask(raw: string, mask: string): string {
  let result = '';
  let rawIndex = 0;

  for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
    const maskChar = mask[maskIndex];
    const pattern = PLACEHOLDER_PATTERN[maskChar];

    if (!pattern) {
      result += maskChar;
      continue;
    }

    if (rawIndex < raw.length) {
      result += raw[rawIndex];
      rawIndex++;
    } else {
      break;
    }
  }

  return result;
}

function isMaskComplete(value: string, mask: string): boolean {
  const placeholderCount = mask.split('').filter((c) => PLACEHOLDER_PATTERN[c]).length;
  const raw = extractRaw(value, mask);
  return raw.length === placeholderCount;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  {
    mask,
    value: valueProp,
    defaultValue = '',
    onChange,
    onComplete,
    disabled,
    size = 'md',
    fullWidth = false,
    label,
    description,
    error,
    placeholder,
    className,
    onKeyDown: onKeyDownProp,
    ...inputProps
  },
  ref
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => (defaultValue ? applyMask(extractRaw(defaultValue, mask), mask) : ''));
  const value = isControlled ? applyMask(extractRaw(valueProp ?? '', mask), mask) : internalValue;

  const inputRef = useRef<HTMLInputElement | null>(null);

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
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      if (isMaskComplete(next, mask)) {
        onComplete?.(next);
      }
    },
    [isControlled, onChange, onComplete, mask]
  );

  const applyInput = useCallback(
    (rawInput: string) => {
      const raw = extractRaw(rawInput, mask);
      const masked = applyMask(raw, mask);
      commit(masked);
    },
    [mask, commit]
  );

  const findCaretPosition = (masked: string, rawCount: number): number => {
    if (rawCount <= 0) {
      for (let i = 0; i < mask.length; i++) {
        if (PLACEHOLDER_PATTERN[mask[i]]) return i;
      }
      return 0;
    }
    let count = 0;
    for (let i = 0; i < masked.length; i++) {
      if (PLACEHOLDER_PATTERN[masked[i]]) {
        count++;
        if (count === rawCount) return i + 1;
      }
    }
    return masked.length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const input = e.target;
    const rawInput = input.value;
    const caretPos = input.selectionStart ?? rawInput.length;

    const rawBeforeCaret = extractRaw(rawInput.slice(0, caretPos), mask).length;

    applyInput(rawInput);

    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      const maskedNow = node.value;
      const nextCaret = findCaretPosition(maskedNow, rawBeforeCaret);
      node.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownProp?.(e);
    if (e.defaultPrevented || disabled) return;

    const node = inputRef.current;
    if (!node) return;

    if (e.key === 'Backspace') {
      const caretPos = node.selectionStart ?? 0;
      const caretEnd = node.selectionEnd ?? caretPos;

      if (caretPos === caretEnd && caretPos > 0) {
        const before = node.value[caretPos - 1];
        if (before && !PLACEHOLDER_PATTERN[before]) {
          e.preventDefault();
          const rawCountBefore = extractRaw(node.value.slice(0, caretPos), mask).length;
          if (rawCountBefore === 0) return;

          const newRawCount = rawCountBefore - 1;
          const raw = extractRaw(node.value, mask);
          const nextRaw = raw.slice(0, newRawCount) + raw.slice(rawCountBefore);
          const masked = applyMask(nextRaw, mask);
          commit(masked);

          requestAnimationFrame(() => {
            const caret = findCaretPosition(masked, newRawCount);
            inputRef.current?.setSelectionRange(caret, caret);
          });
        }
      }
      return;
    }

    if (e.key === 'Delete') {
      const caretPos = node.selectionStart ?? 0;
      const after = node.value[caretPos];
      if (after && PLACEHOLDER_PATTERN[after]) {
        e.preventDefault();
        const raw = extractRaw(node.value, mask);
        const rawCountBefore = extractRaw(node.value.slice(0, caretPos), mask).length;
        const nextRaw = raw.slice(0, rawCountBefore) + raw.slice(rawCountBefore + 1);
        const masked = applyMask(nextRaw, mask);
        commit(masked);
        requestAnimationFrame(() => {
          const caret = findCaretPosition(masked, rawCountBefore);
          inputRef.current?.setSelectionRange(caret, caret);
        });
      }
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;
    const pasted = e.clipboardData.getData('text');
    applyInput(pasted);
  };

  const ghost = useMemo(() => mask, [mask]);

  return (
    <div
      className={[
        'masked-input',
        `masked-input--size-${size}`,
        fullWidth && 'masked-input--full-width',
        disabled && 'masked-input--disabled',
        error != null && error !== false && error !== '' && 'masked-input--error',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label className="masked-input__label" htmlFor={inputProps.id}>
          {label}
        </label>
      )}

      <div className="masked-input__wrapper">
        <input
          {...inputProps}
          ref={setInputRef}
          type="text"
          inputMode="numeric"
          className="masked-input__field"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error != null && error !== false && error !== '' ? true : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          autoComplete="off"
        />
        {!value && !placeholder && (
          <span className="masked-input__ghost" aria-hidden="true">
            {ghost}
          </span>
        )}
      </div>

      {description != null && description !== '' && !error && <div className="masked-input__description">{description}</div>}

      {error != null && error !== false && error !== '' && (
        <div className="masked-input__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});
