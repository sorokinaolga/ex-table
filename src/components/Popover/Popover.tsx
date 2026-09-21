import { cloneElement, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverPosition } from './usePopoverPosition';
import type { PopoverPosition } from './usePopoverPosition';
import './Popover.css';

export type { PopoverPosition };

export interface PopoverProps {
  children?: ReactElement;
  content: ReactNode;
  position?: PopoverPosition;
  withArrow?: boolean;
  offset?: number;
  opened?: boolean;
  defaultOpened?: boolean;
  onChange?: (opened: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnClickInside?: boolean;
  trapFocus?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  width?: number | string;
  disabled?: boolean;
  withinPortal?: boolean;
  'aria-label'?: string;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    children,
    content,
    position = 'bottom',
    withArrow = false,
    offset = 8,
    opened: openedProp,
    defaultOpened = false,
    onChange,
    closeOnClickOutside = true,
    closeOnEscape = true,
    closeOnClickInside = false,
    trapFocus = false,
    shadow = 'md',
    radius = 'lg',
    width,
    disabled = false,
    withinPortal = true,
    'aria-label': ariaLabel,
  },
  ref
) {
  const popoverId = useId();
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isControlled = openedProp !== undefined;
  const opened = isControlled ? openedProp : internalOpened;

  const targetRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const coords = usePopoverPosition(targetRef, popoverRef, position, offset, opened && !disabled, withArrow);

  const setOpened = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpened(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpened(!opened);
  }, [disabled, opened, setOpened]);

  useEffect(() => {
    if (!opened || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpened(false);
        targetRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [opened, closeOnEscape, setOpened]);

  useEffect(() => {
    if (!opened || !closeOnClickOutside) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target) || targetRef.current?.contains(target)) {
        return;
      }
      setOpened(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [opened, closeOnClickOutside, setOpened]);

  useEffect(() => {
    if (!opened || !trapFocus) return;

    const popover = popoverRef.current;
    if (!popover) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = popover.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
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

  const onPopoverClick = useCallback(() => {
    if (closeOnClickInside) {
      setOpened(false);
    }
  }, [closeOnClickInside, setOpened]);

  const child = children as ReactElement<Record<string, unknown>>;

  const childWithRef = cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      targetRef.current = node;
      const childRef = (child as unknown as { ref?: unknown }).ref;
      if (typeof childRef === 'function') {
        (childRef as (n: HTMLElement | null) => void)(node);
      } else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onClick: (e: React.MouseEvent) => {
      const orig = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;
      orig?.(e);
      toggle();
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': opened,
    'aria-controls': opened ? popoverId : undefined,
  });

  const popoverContent = (
    <div
      ref={(node) => {
        popoverRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      id={popoverId}
      role="dialog"
      aria-label={ariaLabel}
      className={['popover', `popover--shadow-${shadow}`, `popover--radius-${radius}`, withArrow && 'popover--with-arrow', `popover--position-${position}`].filter(Boolean).join(' ')}
      style={{
        top: coords?.top ?? -9999,
        left: coords?.left ?? -9999,
        width,
      }}
      onClick={onPopoverClick}
    >
      {content}
      {withArrow && coords && (
        <span
          className="popover__arrow"
          style={
            {
              '--arrow-x': `${coords.targetCenterX - (coords.left ?? 0)}px`,
              '--arrow-y': `${coords.targetCenterY - (coords.top ?? 0)}px`,
            } as React.CSSProperties
          }
        />
      )}
    </div>
  );

  return (
    <>
      {childWithRef}
      {opened && coords && !disabled && (withinPortal && typeof document !== 'undefined' ? createPortal(popoverContent, document.body) : popoverContent)}
    </>
  );
});
