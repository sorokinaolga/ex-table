import { cloneElement, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useHoverCardPosition } from './useHoverCardPosition';
import type { HoverCardPosition } from './useHoverCardPosition';
import './HoverCard.css';

export type { HoverCardPosition };

export interface HoverCardProps {
  children?: ReactElement;
  content: ReactNode;
  position?: HoverCardPosition;
  openDelay?: number;
  closeDelay?: number;
  offset?: number;
  maw?: number;
  disabled?: boolean;
  opened?: boolean;
  defaultOpened?: boolean;
  onChange?: (opened: boolean) => void;
  withinPortal?: boolean;
}

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { children, content, position = 'bottom', openDelay = 300, closeDelay = 150, offset = 8, maw = 320, disabled = false, opened: openedProp, defaultOpened = false, onChange, withinPortal = true },
  ref
) {
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isControlled = openedProp !== undefined;
  const opened = isControlled ? openedProp : internalOpened;

  const targetRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const coords = useHoverCardPosition(targetRef, cardRef, position, offset, opened && !disabled);

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

  const triggerProps: Record<string, unknown> = {
    onMouseEnter: (e: React.MouseEvent) => {
      const orig = child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined;
      orig?.(e);
      open();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      const orig = child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined;
      orig?.(e);
      close();
    },
    onFocus: (e: React.FocusEvent) => {
      const orig = child.props.onFocus as ((e: React.FocusEvent) => void) | undefined;
      orig?.(e);
      open();
    },
    onBlur: (e: React.FocusEvent) => {
      const orig = child.props.onBlur as ((e: React.FocusEvent) => void) | undefined;
      orig?.(e);
      close();
    },
  };

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
    ...triggerProps,
  });

  const cardContent = (
    <div
      ref={(node) => {
        cardRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className="hover-card"
      style={{
        top: coords?.top ?? -9999,
        left: coords?.left ?? -9999,
        maxWidth: maw,
      }}
      onMouseEnter={clearTimers as unknown as React.MouseEventHandler}
      onMouseLeave={close}
    >
      {content}
    </div>
  );

  return (
    <>
      {childWithRef}
      {opened && coords && !disabled && (withinPortal && typeof document !== 'undefined' ? createPortal(cardContent, document.body) : cardContent)}
    </>
  );
});
