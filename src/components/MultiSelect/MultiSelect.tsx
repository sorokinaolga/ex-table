import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { InputProps } from '../Input/Input';
import './MultiSelect.css';

export type MultiSelectOption = string | { value: string; label: string; disabled?: boolean };

export interface MultiSelectProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'leftSection' | 'rightSection' | 'placeholder'> {
  data: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;

  searchable?: boolean;
  maxValues?: number;
  limit?: number;
  nothingFoundMessage?: ReactNode;
  showOnEmpty?: boolean;

  clearable?: boolean;
  placeholder?: string;
  addValuePlaceholder?: string;

  renderTag?: (option: MultiSelectOption, onRemove: () => void) => ReactNode;
  renderOption?: (option: MultiSelectOption, selected: boolean) => ReactNode;

  'aria-label'?: string;
}

function getOptionValue(option: MultiSelectOption): string {
  return typeof option === 'string' ? option : option.value;
}

function getOptionLabel(option: MultiSelectOption): string {
  return typeof option === 'string' ? option : option.label;
}

function isOptionDisabled(option: MultiSelectOption): boolean {
  return typeof option === 'object' && option.disabled === true;
}

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  {
    data,
    value: valueProp,
    defaultValue = [],
    onChange,
    searchable = true,
    maxValues,
    limit = 50,
    nothingFoundMessage = 'Ничего не найдено',
    showOnEmpty = false,
    clearable = false,
    placeholder,
    addValuePlaceholder,
    renderTag,
    renderOption,
    disabled,
    size = 'md',
    fullWidth = false,
    label,
    description,
    error,
    className,
    onKeyDown: onKeyDownProp,
    onBlur: onBlurProp,
    ...inputProps
  },
  ref
) {
  const autoId = useId();
  const inputId = inputProps.id ?? `multiselect-${autoId}`;
  const listboxId = `${inputId}-listbox`;

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selected = isControlled ? valueProp : internalValue;

  const [query, setQuery] = useState('');
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
    const q = query.toLowerCase().trim();
    const result = data.filter((opt) => {
      if (!q) return true;
      return getOptionLabel(opt).toLowerCase().includes(q);
    });
    return limit > 0 ? result.slice(0, limit) : result;
  }, [data, query, limit]);

  const showDropdown = opened && (filtered.length > 0 || query !== '' || showOnEmpty);

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

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const selectOption = useCallback(
    (option: MultiSelectOption) => {
      if (isOptionDisabled(option)) return;
      const value = getOptionValue(option);
      if (selected.includes(value)) return;
      if (maxValues != null && selected.length >= maxValues) return;

      commit([...selected, value]);
      setQuery('');
      inputRef.current?.focus();
    },
    [selected, commit, maxValues]
  );

  const deselect = useCallback(
    (value: string) => {
      commit(selected.filter((v) => v !== value));
      inputRef.current?.focus();
    },
    [selected, commit]
  );

  const clearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      commit([]);
      inputRef.current?.focus();
    },
    [commit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setQuery(e.target.value);
    setOpened(true);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownProp?.(e);
    if (e.defaultPrevented || disabled) return;

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
      case 'Backspace':
        if (query === '' && selected.length > 0) {
          e.preventDefault();
          deselect(selected[selected.length - 1]);
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlurProp?.(e);
    setOpened(false);
    setHighlighted(-1);
  };

  const selectedOptions: MultiSelectOption[] = selected.map((v) => data.find((opt) => getOptionValue(opt) === v) ?? v);

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;
  const showClear = clearable && selected.length > 0 && !disabled;
  const isMaxReached = maxValues != null && selected.length >= maxValues;

  const describedBy = showError ? `${inputId}-error` : showDescription ? `${inputId}-desc` : undefined;

  const rootClasses = ['multi-select', `multi-select--size-${size}`, fullWidth && 'multi-select--full-width', disabled && 'multi-select--disabled', showError && 'multi-select--error', className]
    .filter(Boolean)
    .join(' ');

  const currentPlaceholder = selected.length === 0 ? placeholder : addValuePlaceholder;

  return (
    <div ref={rootRef} className={rootClasses}>
      {label && (
        <label className="multi-select__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="multi-select__wrapper" onClick={() => inputRef.current?.focus()}>
        <div className="multi-select__tags">
          {selectedOptions.map((opt) => {
            const value = getOptionValue(opt);
            const label = getOptionLabel(opt);
            const handleRemove = () => deselect(value);

            if (renderTag) {
              return (
                <span key={value} className="multi-select__tag-custom">
                  {renderTag(opt, handleRemove)}
                </span>
              );
            }

            return (
              <span key={value} className="multi-select__tag">
                <span className="multi-select__tag-label">{label}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="multi-select__tag-remove"
                    aria-label={`Удалить ${label}`}
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </span>
            );
          })}

          <input
            {...inputProps}
            ref={setInputRef}
            id={inputId}
            type="text"
            className="multi-select__field"
            value={query}
            disabled={disabled || (isMaxReached && query === '')}
            placeholder={selected.length === 0 ? currentPlaceholder : undefined}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? listboxId : undefined}
            aria-activedescendant={highlighted >= 0 ? `${inputId}-option-${highlighted}` : undefined}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            readOnly={!searchable}
            autoComplete="off"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpened(true)}
            onBlur={handleBlur}
          />
        </div>

        {showClear && (
          <span className="multi-select__clear" role="button" tabIndex={-1} aria-label="Очистить все" onMouseDown={(e) => e.preventDefault()} onClick={clearAll}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </div>

      {showDropdown && (
        <div ref={listboxRef} id={listboxId} role="listbox" aria-multiselectable="true" className="multi-select__dropdown">
          {filtered.length === 0 ? (
            <div className="multi-select__empty">{nothingFoundMessage}</div>
          ) : (
            filtered.map((opt, index) => {
              const value = getOptionValue(opt);
              const optionLabel = getOptionLabel(opt);
              const isSelected = selected.includes(value);
              const isDisabled = isOptionDisabled(opt);
              const isHighlighted = index === highlighted;

              if (renderOption) {
                return (
                  <div key={value} data-option-index={index} onMouseEnter={() => setHighlighted(index)} onMouseDown={(e) => e.preventDefault()} onClick={() => selectOption(opt)}>
                    {renderOption(opt, isSelected)}
                  </div>
                );
              }

              return (
                <div
                  key={value}
                  id={`${inputId}-option-${index}`}
                  data-option-index={index}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || undefined}
                  className={[
                    'multi-select__option',
                    isSelected && 'multi-select__option--selected',
                    isHighlighted && 'multi-select__option--highlighted',
                    isDisabled && 'multi-select__option--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => setHighlighted(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(opt)}
                >
                  <span className="multi-select__checkbox" aria-hidden="true">
                    {isSelected && (
                      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="multi-select__option-label">{optionLabel}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {showError && (
        <div id={`${inputId}-error`} className="multi-select__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={`${inputId}-desc`} className="multi-select__description">
          {description}
        </div>
      )}
    </div>
  );
});
