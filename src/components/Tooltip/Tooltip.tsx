import { cloneElement, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipPosition } from './useTooltipPosition';
import type { TooltipPosition } from './useTooltipPosition';
import './Tooltip.css';

export type { TooltipPosition };

export interface TooltipProps {
  label: ReactNode;
  children?: ReactElement;
  position?: TooltipPosition;
  withArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;
  offset?: number;
  multiline?: boolean;
  maw?: number;
  disabled?: boolean;
  opened?: boolean;
  defaultOpened?: boolean;
  onChange?: (opened: boolean) => void;
  withinPortal?: boolean;
  events?: ('hover' | 'focus' | 'click')[];
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    label,
    children,
    position = 'top',
    withArrow = false,
    openDelay = 0,
    closeDelay = 100,
    offset = 8,
    multiline = false,
    maw = 240,
    disabled = false,
    opened: openedProp,
    defaultOpened = false,
    onChange,
    withinPortal = true,
    events = ['hover', 'focus'],
  },
  ref
) {
  const tooltipId = useId();
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isControlled = openedProp !== undefined;
  const opened = isControlled ? openedProp : internalOpened;

  const targetRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const coords = useTooltipPosition(targetRef, tooltipRef, position, offset, opened && !disabled);

  const setOpened = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpened(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    clearTimers();
    openTimerRef.current = window.setTimeout(() => {
      setOpened(true);
    }, openDelay);
  }, [disabled, clearTimers, openDelay, setOpened]);

  const close = useCallback(() => {
    clearTimers();
    closeTimerRef.current = window.setTimeout(() => {
      setOpened(false);
    }, closeDelay);
  }, [clearTimers, closeDelay, setOpened]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpened(!opened);
  }, [disabled, opened, setOpened]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpened(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [opened, setOpened]);

  const child = children as ReactElement<Record<string, unknown>>;

  const triggerProps: Record<string, unknown> = {};

  if (events.includes('hover')) {
    triggerProps.onMouseEnter = (e: React.MouseEvent) => {
      const original = child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined;
      original?.(e);
      open();
    };
    triggerProps.onMouseLeave = (e: React.MouseEvent) => {
      const original = child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined;
      original?.(e);
      close();
    };
  }

  if (events.includes('focus')) {
    triggerProps.onFocus = (e: React.FocusEvent) => {
      const original = child.props.onFocus as ((e: React.FocusEvent) => void) | undefined;
      original?.(e);
      open();
    };
    triggerProps.onBlur = (e: React.FocusEvent) => {
      const original = child.props.onBlur as ((e: React.FocusEvent) => void) | undefined;
      original?.(e);
      close();
    };
  }

  if (events.includes('click')) {
    triggerProps.onClick = (e: React.MouseEvent) => {
      const original = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;
      original?.(e);
      toggle();
    };
  }

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
    'aria-describedby': opened ? tooltipId : undefined,
    ...triggerProps,
  });

  const tooltipContent = (
    <div
      ref={(node) => {
        tooltipRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      id={tooltipId}
      role="tooltip"
      className={['tooltip', `tooltip--position-${position}`, withArrow && 'tooltip--with-arrow'].filter(Boolean).join(' ')}
      style={{
        top: coords?.top ?? -9999,
        left: coords?.left ?? -9999,
        maxWidth: multiline ? maw : undefined,
      }}
    >
      {label}
      {withArrow && coords && (
        <span
          className="tooltip__arrow"
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
      {opened && coords && !disabled && (withinPortal && typeof document !== 'undefined' ? createPortal(tooltipContent, document.body) : tooltipContent)}
    </>
  );
});
