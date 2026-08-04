import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { SelectData, SelectSize } from './types';
import { isGroup } from './types';
import { useSelectState } from './useSelectState';
import './Select.css';

export interface SelectProps {
  data: SelectData;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;

  size?: SelectSize;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;

  nothingFoundMessage?: string;

  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    data,
    value,
    defaultValue = null,
    onChange,
    size = 'md',
    label,
    placeholder = 'Выберите...',
    description,
    error,
    disabled,
    searchable = false,
    clearable = false,
    fullWidth = false,
    nothingFoundMessage = 'Ничего не найдено',
    name,
    id,
    className,
    'aria-label': ariaLabel,
  },
  ref
) {
  const autoId = useId();
  const selectId = id ?? `select-${autoId}`;
  const descId = `${selectId}-desc`;
  const errorId = `${selectId}-error`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  const [opened, setOpened] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, filteredData, visibleOptions, highlightedIndex, setHighlightedIndex, reset } = useSelectState(data, searchable, currentValue);

  const selectedLabel = useMemo(() => {
    for (const item of data) {
      if (isGroup(item)) {
        const found = item.items.find((o) => o.value === currentValue);
        if (found) return found.label;
      } else if (item.value === currentValue) {
        return item.label;
      }
    }
    return null;
  }, [data, currentValue]);

  const commitValue = useCallback(
    (next: string | null) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const open = useCallback(() => {
    if (disabled) return;
    setOpened(true);
    reset();
  }, [disabled, reset]);

  const close = useCallback(() => {
    setOpened(false);
    setQuery('');
  }, [setQuery]);

  const selectOption = useCallback(
    (opt: { value: string; disabled?: boolean }) => {
      if (opt.disabled) return;
      commitValue(opt.value);
      close();
      triggerRef.current?.focus();
    },
    [commitValue, close]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      commitValue(null);
      triggerRef.current?.focus();
    },
    [commitValue]
  );

  useEffect(() => {
    if (!opened) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [opened, close]);

  useEffect(() => {
    if (opened && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [opened, searchable]);

  useEffect(() => {
    if (!opened) return;
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-option-index="${highlightedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, opened]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!opened) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        const next = Math.min(highlightedIndex + 1, visibleOptions.length - 1);
        setHighlightedIndex(next);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = Math.max(highlightedIndex - 1, 0);
        setHighlightedIndex(prev);
        break;
      }
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(visibleOptions.length - 1);
        break;
      case 'Enter': {
        e.preventDefault();
        const opt = visibleOptions[highlightedIndex];
        if (opt) selectOption(opt);
        break;
      }
      case 'Tab':
        close();
        break;
    }
  };

  const showError = Boolean(error);
  const showDescription = !showError && Boolean(description);

  const rootClasses = ['select', `select--size-${size}`, fullWidth && 'select--full-width', disabled && 'select--disabled', opened && 'select--opened', showError && 'select--error', className]
    .filter(Boolean)
    .join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  const renderDropdown = () => {
    let optionIndex = -1;
    const rows: React.ReactNode[] = [];

    for (const item of filteredData) {
      if (isGroup(item)) {
        rows.push(
          <div key={`group-${item.group}`} className="select__group-label" role="presentation">
            {item.group}
          </div>
        );
        for (const opt of item.items) {
          optionIndex += 1;
          rows.push(renderOption(opt, optionIndex));
        }
      } else {
        optionIndex += 1;
        rows.push(renderOption(item, optionIndex));
      }
    }

    if (rows.length === 0) {
      return <div className="select__empty">{nothingFoundMessage}</div>;
    }

    return rows;
  };

  const renderOption = (opt: { value: string; label: string; disabled?: boolean }, index: number) => {
    const isSelected = opt.value === currentValue;
    const isHighlighted = index === highlightedIndex;
    return (
      <div
        key={opt.value}
        data-option-index={index}
        role="option"
        aria-selected={isSelected}
        aria-disabled={opt.disabled || undefined}
        className={'select__option' + (isSelected ? ' select__option--selected' : '') + (isHighlighted ? ' select__option--highlighted' : '') + (opt.disabled ? ' select__option--disabled' : '')}
        onMouseEnter={() => setHighlightedIndex(index)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => selectOption(opt)}
      >
        {opt.label}
      </div>
    );
  };

  return (
    <div ref={rootRef} className={rootClasses}>
      {label && (
        <label className="select__label" htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className="select__wrapper">
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) {
              (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            }
          }}
          id={selectId}
          type="button"
          className="select__trigger"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={opened}
          aria-controls={`${selectId}-listbox`}
          aria-label={!label ? ariaLabel : undefined}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          onClick={() => (opened ? close() : open())}
          onKeyDown={handleKeyDown}
        >
          <span className={'select__value' + (selectedLabel === null ? ' select__value--placeholder' : '')}>{selectedLabel ?? placeholder}</span>

          <span className="select__actions">
            {clearable && currentValue !== null && !disabled && (
              <span className="select__clear" role="button" aria-label="Очистить" onClick={handleClear} onMouseDown={(e) => e.preventDefault()}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
            )}

            <span className="select__arrow" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </span>
        </button>

        {opened && (
          <div className="select__dropdown" role="presentation">
            {searchable && (
              <div className="select__search">
                <input
                  ref={searchInputRef}
                  className="select__search-input"
                  value={query}
                  placeholder="Поиск..."
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            <div id={`${selectId}-listbox`} className="select__listbox" role="listbox" aria-label={label ?? ariaLabel}>
              {renderDropdown()}
            </div>
          </div>
        )}
      </div>

      {name && <input type="hidden" name={name} value={currentValue ?? ''} />}

      {showError && (
        <div id={errorId} className="select__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={descId} className="select__description">
          {description}
        </div>
      )}
    </div>
  );
});
