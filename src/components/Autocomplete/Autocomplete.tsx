import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { InputProps } from '../Input/Input';
import './Autocomplete.css';

export type AutocompleteOption = string | { value: string; label: string };

export interface AutocompleteProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'leftSection' | 'rightSection'> {
  data: AutocompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onOptionSubmit?: (value: string) => void;

  limit?: number;
  filter?: (query: string, option: AutocompleteOption) => boolean;
  nothingFoundMessage?: ReactNode;
  showOnEmpty?: boolean;

  clearable?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

function getOptionValue(option: AutocompleteOption): string {
  return typeof option === 'string' ? option : option.value;
}

function getOptionLabel(option: AutocompleteOption): string {
  return typeof option === 'string' ? option : option.label;
}

const DEFAULT_FILTER = (query: string, option: AutocompleteOption) => {
  if (!query) return true;
  const label = getOptionLabel(option).toLowerCase();
  return label.includes(query.toLowerCase().trim());
};

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  {
    data,
    value: valueProp,
    defaultValue = '',
    onChange,
    onOptionSubmit,
    limit = 10,
    filter = DEFAULT_FILTER,
    nothingFoundMessage = 'Ничего не найдено',
    showOnEmpty = false,
    clearable = false,
    leftSection,
    rightSection,
    disabled,
    size = 'md',
    fullWidth = false,
    label,
    description,
    error,
    placeholder,
    className,
    ...inputProps
  },
  ref
) {
  const autoId = useId();
  const inputId = inputProps.id ?? `autocomplete-${autoId}`;
  const listboxId = `${inputId}-listbox`;

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const [opened, setOpened] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

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

  const filtered = useMemo(() => {
    const result = data.filter((opt) => filter(value, opt));
    return limit > 0 ? result.slice(0, limit) : result;
  }, [data, value, filter, limit]);

  const showDropdown = opened && (filtered.length > 0 || showOnEmpty || value !== '');

  useEffect(() => {
    if (!opened) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpened(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [opened]);

  useEffect(() => {
    if (!opened || highlighted < 0) return;
    const el = listboxRef.current?.querySelector<HTMLElement>(`[data-option-index="${highlighted}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlighted, opened]);

  const selectOption = useCallback(
    (option: AutocompleteOption) => {
      const optionValue = getOptionValue(option);
      if (!isControlled) setInternalValue(optionValue);
      onChange?.(optionValue);
      onOptionSubmit?.(optionValue);
      setOpened(false);
      setHighlighted(-1);
      inputRef.current?.focus();
    },
    [isControlled, onChange, onOptionSubmit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    setOpened(true);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        e.preventDefault();
        setOpened(true);
        setHighlighted(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => (filtered.length === 0 ? -1 : Math.min(h + 1, filtered.length - 1)));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setHighlighted(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlighted(filtered.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) {
          selectOption(filtered[highlighted]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpened(false);
        setHighlighted(-1);
        break;
      case 'Tab':
        setOpened(false);
        setHighlighted(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (showOnEmpty || value !== '') setOpened(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue('');
    onChange?.('');
    setOpened(false);
    inputRef.current?.focus();
  };

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;
  const showClear = clearable && value !== '' && !disabled;

  const describedBy = showError ? `${inputId}-error` : showDescription ? `${inputId}-desc` : undefined;

  const rootClasses = ['autocomplete', `autocomplete--size-${size}`, fullWidth && 'autocomplete--full-width', disabled && 'autocomplete--disabled', showError && 'autocomplete--error', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClasses}>
      {label && (
        <label className="autocomplete__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="autocomplete__wrapper">
        {leftSection && <span className="autocomplete__section autocomplete__section--left">{leftSection}</span>}

        <input
          {...inputProps}
          ref={setInputRef}
          id={inputId}
          type="text"
          className="autocomplete__field"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-activedescendant={highlighted >= 0 ? `${inputId}-option-${highlighted}` : undefined}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />

        {showClear && (
          <span className="autocomplete__clear" role="button" tabIndex={-1} aria-label="Очистить" onMouseDown={(e) => e.preventDefault()} onClick={handleClear}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}

        {rightSection && <span className="autocomplete__section autocomplete__section--right">{rightSection}</span>}
      </div>

      {showDropdown && (
        <div ref={listboxRef} id={listboxId} role="listbox" className="autocomplete__dropdown">
          {filtered.length === 0 ? (
            <div className="autocomplete__empty">{nothingFoundMessage}</div>
          ) : (
            filtered.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              const selected = optionValue === value;
              const isHighlighted = index === highlighted;

              return (
                <div
                  key={optionValue}
                  id={`${inputId}-option-${index}`}
                  data-option-index={index}
                  role="option"
                  aria-selected={selected}
                  className={['autocomplete__option', selected && 'autocomplete__option--selected', isHighlighted && 'autocomplete__option--highlighted'].filter(Boolean).join(' ')}
                  onMouseEnter={() => setHighlighted(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  {optionLabel}
                </div>
              );
            })
          )}
        </div>
      )}

      {showError && (
        <div id={`${inputId}-error`} className="autocomplete__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={`${inputId}-desc`} className="autocomplete__description">
          {description}
        </div>
      )}
    </div>
  );
});
