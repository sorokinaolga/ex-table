import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { InputProps } from '../Input/Input';
import './TagsInput.css';

export interface TagsInputProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'leftSection' | 'rightSection' | 'placeholder'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;

  data?: string[];

  maxTags?: number;
  allowDuplicates?: boolean;
  splitChars?: string[];
  clearable?: boolean;
  placeholder?: string;
  addTagPlaceholder?: string;
  nothingFoundMessage?: ReactNode;
  leftSection?: ReactNode;
}

const DEFAULT_SPLIT_CHARS = [','];

export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(function TagsInput(
  {
    value: valueProp,
    defaultValue = [],
    onChange,
    data = [],
    maxTags,
    allowDuplicates = false,
    splitChars = DEFAULT_SPLIT_CHARS,
    clearable = false,
    placeholder,
    addTagPlaceholder,
    nothingFoundMessage = 'Ничего не найдено',
    leftSection,
    disabled,
    size = 'md',
    fullWidth = false,
    label,
    description,
    error,
    className,
    onKeyDown: onKeyDownProp,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    ...inputProps
  },
  ref
) {
  const autoId = useId();
  const inputId = inputProps.id ?? `tags-${autoId}`;
  const listboxId = `${inputId}-listbox`;

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const tags = isControlled ? valueProp : internalValue;

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

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    return data
      .filter((option) => {
        if (!allowDuplicates && tags.includes(option)) return false;
        return option.toLowerCase().includes(q);
      })
      .slice(0, 10);
  }, [data, query, tags, allowDuplicates]);

  const showDropdown = opened && suggestions.length > 0;

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

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return false;
      if (!allowDuplicates && tags.includes(trimmed)) return false;
      if (maxTags != null && tags.length >= maxTags) return false;

      commit([...tags, trimmed]);
      return true;
    },
    [tags, allowDuplicates, maxTags, commit]
  );

  const removeTag = useCallback(
    (index: number) => {
      const next = tags.filter((_, i) => i !== index);
      commit(next);
      inputRef.current?.focus();
    },
    [tags, commit]
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
    let next = e.target.value;

    for (const ch of splitChars) {
      if (next.includes(ch)) {
        const parts = next.split(ch);
        for (let i = 0; i < parts.length - 1; i++) {
          addTag(parts[i]);
        }
        next = parts[parts.length - 1];
        break;
      }
    }

    setQuery(next);
    setOpened(true);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    onKeyDownProp?.(e);

    if (e.defaultPrevented) return;

    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        if (highlighted >= 0 && suggestions[highlighted]) {
          addTag(suggestions[highlighted]);
        } else if (query.trim()) {
          addTag(query);
        }
        setQuery('');
        setOpened(false);
        setHighlighted(-1);
        break;
      }
      case 'Backspace': {
        if (query === '' && tags.length > 0) {
          e.preventDefault();
          removeTag(tags.length - 1);
        }
        break;
      }
      case 'Escape': {
        if (opened) {
          e.preventDefault();
          setOpened(false);
          setHighlighted(-1);
        }
        break;
      }
      case 'ArrowDown': {
        if (suggestions.length > 0) {
          e.preventDefault();
          setOpened(true);
          setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
        }
        break;
      }
      case 'ArrowUp': {
        if (suggestions.length > 0) {
          e.preventDefault();
          setHighlighted((h) => Math.max(h - 1, 0));
        }
        break;
      }
      case 'Tab': {
        if (query.trim() && !opened) {
          e.preventDefault();
          addTag(query);
          setQuery('');
        }
        break;
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocusProp?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlurProp?.(e);

    if (query.trim()) {
      addTag(query);
      setQuery('');
    }
    setOpened(false);
    setHighlighted(-1);
  };

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;
  const showClear = clearable && tags.length > 0 && !disabled;
  const isMaxReached = maxTags != null && tags.length >= maxTags;

  const describedBy = showError ? `${inputId}-error` : showDescription ? `${inputId}-desc` : undefined;

  const rootClasses = ['tags-input', `tags-input--size-${size}`, fullWidth && 'tags-input--full-width', disabled && 'tags-input--disabled', showError && 'tags-input--error', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClasses}>
      {label && (
        <label className="tags-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="tags-input__wrapper" onClick={() => inputRef.current?.focus()}>
        {leftSection && <span className="tags-input__section tags-input__section--left">{leftSection}</span>}

        <div className="tags-input__tags">
          {tags.map((tag, i) => (
            <span key={`${tag}-${i}`} className="tags-input__tag">
              <span className="tags-input__tag-label">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  className="tags-input__tag-remove"
                  aria-label={`Удалить ${tag}`}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(i);
                  }}
                >
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </span>
          ))}

          <input
            {...inputProps}
            ref={setInputRef}
            id={inputId}
            type="text"
            className="tags-input__field"
            value={query}
            disabled={disabled || isMaxReached}
            placeholder={tags.length === 0 ? placeholder : addTagPlaceholder}
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
            onBlur={handleBlur}
          />
        </div>

        {showClear && (
          <span className="tags-input__clear" role="button" tabIndex={-1} aria-label="Очистить все" onMouseDown={(e) => e.preventDefault()} onClick={clearAll}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </div>

      {showDropdown && (
        <div ref={listboxRef} id={listboxId} role="listbox" className="tags-input__dropdown">
          {suggestions.length === 0 && query.trim() ? (
            <div className="tags-input__empty">{nothingFoundMessage}</div>
          ) : (
            suggestions.map((option, index) => (
              <div
                key={option}
                id={`${inputId}-option-${index}`}
                data-option-index={index}
                role="option"
                aria-selected={highlighted === index}
                className={['tags-input__option', highlighted === index && 'tags-input__option--highlighted'].filter(Boolean).join(' ')}
                onMouseEnter={() => setHighlighted(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  addTag(option);
                  setQuery('');
                  setOpened(false);
                  inputRef.current?.focus();
                }}
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}

      {showError && (
        <div id={`${inputId}-error`} className="tags-input__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={`${inputId}-desc`} className="tags-input__description">
          {description}
        </div>
      )}
    </div>
  );
});
