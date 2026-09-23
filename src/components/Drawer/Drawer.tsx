import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import './Drawer.css';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DrawerRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps {
  opened: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  size?: DrawerSize;
  radius?: DrawerRadius;

  withCloseButton?: boolean;
  withOverlay?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  lockScroll?: boolean;
  overlayOpacity?: number;
  overlayBlur?: number;

  id?: string;
  'aria-label'?: string;
}

const SIZE_MAP: Record<DrawerSize, number> = {
  xs: 240,
  sm: 320,
  md: 400,
  lg: 560,
  xl: 800,
  full: 0, // 100%
};

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    opened,
    onClose,
    position = 'right',
    title,
    children,
    footer,
    size = 'md',
    radius = 'md',
    withCloseButton = true,
    withOverlay = true,
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
  const drawerId = id ?? `drawer-${autoId}`;
  const titleId = `${drawerId}-title`;
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
    backgroundColor: withOverlay ? `rgba(0, 0, 0, ${overlayOpacity})` : undefined,
    backdropFilter: withOverlay && overlayBlur > 0 ? `blur(${overlayBlur}px)` : undefined,
  };

  const isHorizontal = position === 'left' || position === 'right';
  const px = SIZE_MAP[size];
  const drawerSize = size === 'full' ? '100%' : `${px}px`;

  const drawerStyle: CSSProperties = isHorizontal ? { width: drawerSize, maxWidth: '100vw' } : { height: drawerSize, maxHeight: '100vh' };

  const drawerContent = (
    <div className="drawer-root" role="presentation" aria-hidden={!opened}>
      {withOverlay && <div className="drawer-overlay" style={overlayStyle} onClick={onOverlayClick} />}

      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        className={['drawer', `drawer--position-${position}`, `drawer--radius-${radius}`, size === 'full' && 'drawer--full'].filter(Boolean).join(' ')}
        style={drawerStyle}
      >
        {(title || withCloseButton) && (
          <header className="drawer__header">
            {title && (
              <h2 id={titleId} className="drawer__title">
                {title}
              </h2>
            )}
            {withCloseButton && (
              <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Закрыть" onClick={onClose} className="drawer__close">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ButtonIcon>
            )}
          </header>
        )}

        <div className="drawer__body">{children}</div>

        {footer && <footer className="drawer__footer">{footer}</footer>}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
});
