import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import './Modal.css';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ModalShadow = 'sm' | 'md' | 'lg';

export interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  size?: ModalSize;
  radius?: ModalRadius;
  shadow?: ModalShadow;

  centered?: boolean;
  fullScreen?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  lockScroll?: boolean;
  overlayOpacity?: number;
  overlayBlur?: number;
  id?: string;
  'aria-label'?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    opened,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    radius = 'lg',
    shadow = 'lg',
    centered = false,
    fullScreen = false,
    withCloseButton = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    trapFocus = true,
    lockScroll = true,
    overlayOpacity = 0.6,
    overlayBlur = 2,
    id,
    'aria-label': ariaLabel,
  },
  ref
) {
  const autoId = useId();
  const modalId = id ?? `modal-${autoId}`;
  const titleId = `${modalId}-title`;
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!opened || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [opened, closeOnEscape, onClose]);

  const onOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnClickOutside) return;
      if (e.target === e.currentTarget) onClose();
    },
    [closeOnClickOutside, onClose]
  );

  useEffect(() => {
    if (!opened || !lockScroll) return;

    const original = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = original;
      document.body.style.paddingRight = '';
    };
  }, [opened, lockScroll]);

  useEffect(() => {
    if (!opened || !trapFocus) return;

    const content = contentRef.current;
    if (!content) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = content.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [opened, trapFocus]);

  if (!opened) return null;
  if (typeof document === 'undefined') return null;

  const overlayStyle: CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    backdropFilter: overlayBlur > 0 ? `blur(${overlayBlur}px)` : undefined,
  };

  const modalContent = (
    <div className="modal-root" role="presentation" aria-hidden={!opened}>
      <div className="modal-overlay" style={overlayStyle} onClick={onOverlayClick} />

      <div className={['modal-positioner', centered && 'modal-positioner--centered', fullScreen && 'modal-positioner--full'].filter(Boolean).join(' ')} onClick={onOverlayClick}>
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          id={modalId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={!title ? ariaLabel : undefined}
          className={['modal-content', `modal-content--size-${size}`, `modal-content--radius-${radius}`, `modal-content--shadow-${shadow}`, fullScreen && 'modal-content--full']
            .filter(Boolean)
            .join(' ')}
        >
          {title && (
            <header className="modal-content__header">
              <h2 id={titleId} className="modal-content__title">
                {title}
              </h2>
              {withCloseButton && (
                <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Закрыть" onClick={onClose}>
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </ButtonIcon>
              )}
            </header>
          )}

          <div className="modal-content__body">{children}</div>

          {footer && <footer className="modal-content__footer">{footer}</footer>}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});
