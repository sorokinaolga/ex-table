import { forwardRef, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Collapse.css';

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  in: boolean;
  animateOpacity?: boolean;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  onTransitionEnd?: () => void;
  keepMounted?: boolean;
  children?: ReactNode;
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  { in: opened, animateOpacity = true, transitionDuration = 200, transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)', onTransitionEnd, keepMounted = false, className, children, ...rest },
  ref
) {
  const [shouldRender, setShouldRender] = useState(opened);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onTransitionEndRef = useRef(onTransitionEnd);
  useEffect(() => {
    onTransitionEndRef.current = onTransitionEnd;
  }, [onTransitionEnd]);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (opened) {
      setShouldRender(true);

      const raf = requestAnimationFrame(() => {
        setIsAnimating(true);
      });

      timeoutRef.current = window.setTimeout(() => {
        onTransitionEndRef.current?.();
      }, transitionDuration);

      return () => {
        cancelAnimationFrame(raf);
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }

    setShouldRender((prev) => {
      if (!prev) return prev;

      setIsAnimating(false);

      timeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
        onTransitionEndRef.current?.();
      }, transitionDuration);

      return prev;
    });
  }, [opened, transitionDuration]);

  if (!shouldRender && !keepMounted) return null;

  const wrapperStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: isAnimating ? '1fr' : '0fr',
    transition: `grid-template-rows ${transitionDuration}ms ${transitionTimingFunction}`,
  };

  const innerStyle: React.CSSProperties = {
    overflow: 'hidden',
    minHeight: 0,
    opacity: animateOpacity ? (isAnimating ? 1 : 0) : 1,
    transition: animateOpacity ? `opacity ${transitionDuration}ms ${transitionTimingFunction}` : undefined,
  };

  const classes = ['collapse', isAnimating && 'collapse--opened', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={wrapperStyle} aria-hidden={!isAnimating || undefined} {...rest}>
      <div style={innerStyle}>
        <div className="collapse__content">{children}</div>
      </div>
    </div>
  );
});
