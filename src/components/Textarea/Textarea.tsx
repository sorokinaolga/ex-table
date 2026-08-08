import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import type { ReactNode, TextareaHTMLAttributes } from 'react';
import './Textarea.css';

export type TextareaSize = 'xs' | 'sm' | 'md';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: TextareaSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  withAsterisk?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  fullWidth?: boolean;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
  resize?: TextareaResize;
  clearable?: boolean;
  onClear?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    label,
    description,
    error,
    withAsterisk,
    leftSection,
    rightSection,
    fullWidth = false,
    autosize = false,
    minRows = 2,
    maxRows,
    showCount = false,
    resize = 'vertical',
    clearable = false,
    onClear,
    disabled,
    required,
    id,
    className,
    value,
    defaultValue,
    maxLength,
    onChange,
    onInput,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const textareaId = id ?? `textarea-${autoId}`;
  const descId = `${textareaId}-desc`;
  const errorId = `${textareaId}-error`;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const isControlled = value !== undefined;

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    },
    [ref]
  );

  const resizeToFit = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autosize) return;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [autosize]);

  useLayoutEffect(() => {
    resizeToFit();
  }, [resizeToFit, value]);

  useEffect(() => {
    resizeToFit();
  }, [resizeToFit]);

  const handleInput = (e: React.InputEvent<HTMLTextAreaElement>) => {
    resizeToFit();
    onInput?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const el = innerRef.current;
    if (!el) return;

    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    setter?.call(el, '');

    el.dispatchEvent(new Event('input', { bubbles: true }));

    onClear?.();
    el.focus();
  };

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const currentLength = isControlled ? String(value ?? '').length : (innerRef.current?.value.length ?? 0);
  const isOverLimit = typeof maxLength === 'number' && currentLength > maxLength;

  const showCounter = showCount && typeof maxLength === 'number';

  const rootClasses = [
    'textarea',
    `textarea--size-${size}`,
    `textarea--resize-${resize}`,
    fullWidth && 'textarea--full-width',
    disabled && 'textarea--disabled',
    showError && 'textarea--error',
    autosize && 'textarea--autosize',
    leftSection && 'textarea--with-left-section',
    (rightSection || (clearable && currentLength > 0)) && 'textarea--with-right-section',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  return (
    <div className={rootClasses}>
      {label && (
        <label className="textarea__label" htmlFor={textareaId}>
          {label}
          {(withAsterisk || required) && (
            <span className="textarea__required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}

      <div className="textarea__wrapper">
        {leftSection && <span className="textarea__section textarea__section--left">{leftSection}</span>}

        <textarea
          ref={setRefs}
          id={textareaId}
          className="textarea__field"
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          rows={autosize ? minRows : rest.rows}
          style={autosize && maxRows ? { maxHeight: `calc(${maxRows} * 1.4em + 20px)` } : undefined}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          onInput={handleInput}
          {...rest}
        />

        {(rightSection || (clearable && currentLength > 0)) && (
          <span className="textarea__section textarea__section--right">
            {clearable && currentLength > 0 && !disabled && (
              <button type="button" className="textarea__clear" aria-label="Очистить" onClick={handleClear} tabIndex={-1}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {rightSection}
          </span>
        )}
      </div>

      {(showDescription || showError || showCounter) && (
        <div className="textarea__footer">
          <div className="textarea__footer-text">
            {showError && (
              <div id={errorId} className="textarea__error" role="alert">
                {error}
              </div>
            )}
            {showDescription && (
              <div id={descId} className="textarea__description">
                {description}
              </div>
            )}
          </div>

          {showCounter && (
            <div className={'textarea__counter' + (isOverLimit ? ' textarea__counter--over' : '')} aria-live="polite">
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
