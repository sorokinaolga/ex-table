import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './FileInput.css';

export type FileInputSize = 'xs' | 'sm' | 'md';

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'placeholder'> {
  size?: FileInputSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  withAsterisk?: boolean;

  placeholder?: ReactNode;
  buttonLabel?: ReactNode;

  multiple?: boolean;
  accept?: string;

  onChange?: (files: File[]) => void;

  showFileList?: boolean;
  renderFile?: (file: File, index: number) => ReactNode;

  icon?: ReactNode;

  fullWidth?: boolean;
}

const DEFAULT_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} ГБ`;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  {
    size = 'md',
    label,
    description,
    error,
    withAsterisk,
    placeholder = 'Перетащите файлы сюда или',
    buttonLabel = 'выберите',
    multiple,
    accept,
    onChange,
    showFileList = true,
    renderFile,
    icon,
    fullWidth = false,
    disabled,
    required,
    id,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id ?? `file-input-${autoId}`;
  const descId = `${inputId}-desc`;
  const errorId = `${inputId}-error`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref]
  );

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) {
        setFiles([]);
        onChange?.([]);
        return;
      }
      const arr = Array.from(list);
      setFiles(arr);
      onChange?.(arr);
    },
    [onChange]
  );

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;

    const dropped = e.dataTransfer.files;
    if (!dropped || dropped.length === 0) return;

    // Синхронизируем с input через DataTransfer
    const input = inputRef.current;
    if (input) {
      try {
        const dt = new DataTransfer();
        const limit = multiple ? dropped.length : 1;
        for (let i = 0; i < limit; i++) {
          dt.items.add(dropped[i]);
        }
        input.files = dt.files;
      } catch {
        // Некоторые браузеры могут запрещать прямую установку files
      }
    }
    handleFiles(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (!dragOver) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Игнорируем перетаскивание между дочерними элементами
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOver(false);
  };

  const handleRemoveFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);

    const input = inputRef.current;
    if (input) {
      try {
        const dt = new DataTransfer();
        for (const f of next) dt.items.add(f);
        input.files = dt.files;
      } catch {
        // ignore
      }
    }
    onChange?.(next);
  };

  const showError = error != null && error !== false && error !== '';
  const showDescription = !showError && description != null;

  const rootClasses = [
    'file-input',
    `file-input--size-${size}`,
    fullWidth && 'file-input--full-width',
    disabled && 'file-input--disabled',
    showError && 'file-input--error',
    dragOver && 'file-input--dragging',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = showError ? errorId : showDescription ? descId : undefined;

  return (
    <div className={rootClasses}>
      {label && (
        <label className="file-input__label" htmlFor={inputId}>
          {label}
          {(withAsterisk || required) && (
            <span className="file-input__required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}

      <div
        className="file-input__dropzone"
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
      >
        <input
          ref={setRefs}
          id={inputId}
          type="file"
          className="file-input__input"
          disabled={disabled}
          required={required}
          multiple={multiple}
          accept={accept}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          onChange={(e) => handleFiles(e.target.files)}
          {...rest}
        />

        <div className="file-input__content">
          <span className="file-input__icon" aria-hidden="true">
            {icon ?? DEFAULT_ICON}
          </span>

          <div className="file-input__text">
            <span className="file-input__placeholder">
              {placeholder} <span className="file-input__button">{buttonLabel}</span>
            </span>
            {accept && <span className="file-input__hint">Поддерживаются: {accept}</span>}
          </div>
        </div>
      </div>

      {showFileList && files.length > 0 && (
        <ul className="file-input__files">
          {files.map((file, index) =>
            renderFile ? (
              <li key={`${file.name}-${index}`}>{renderFile(file, index)}</li>
            ) : (
              <li key={`${file.name}-${index}`} className="file-input__file">
                <span className="file-input__file-name" title={file.name}>
                  {file.name}
                </span>
                <span className="file-input__file-meta">{formatBytes(file.size)}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="file-input__file-remove"
                    aria-label={`Удалить ${file.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </li>
            )
          )}
        </ul>
      )}

      {showError && (
        <div id={errorId} className="file-input__error" role="alert">
          {error}
        </div>
      )}

      {showDescription && (
        <div id={descId} className="file-input__description">
          {description}
        </div>
      )}
    </div>
  );
});
