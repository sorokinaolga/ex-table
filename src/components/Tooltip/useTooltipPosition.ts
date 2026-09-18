import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

export type TooltipPosition = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export interface TooltipCoords {
  top: number;
  left: number;
  targetCenterX: number;
  targetCenterY: number;
}

/**
 * Рассчитывает позицию тултипа относительно целевого элемента.
 */
export function useTooltipPosition(
  targetRef: RefObject<HTMLElement | null>,
  tooltipRef: RefObject<HTMLDivElement | null>,
  position: TooltipPosition,
  offset: number,
  opened: boolean
): TooltipCoords | null {
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const [prevOpened, setPrevOpened] = useState(opened);

  if (opened !== prevOpened) {
    setPrevOpened(opened);
    if (!opened && coords !== null) {
      setCoords(null);
    }
  }

  useLayoutEffect(() => {
    if (!opened) return;

    const target = targetRef.current;
    const tooltip = tooltipRef.current;
    if (!target || !tooltip) return;

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    let top = 0;
    let left = 0;

    const [base, align] = position.split('-') as ['top' | 'bottom' | 'left' | 'right', 'start' | 'end' | undefined];

    switch (base) {
      case 'top':
        top = targetRect.top - tooltipRect.height - offset;
        left = targetCenterX - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetCenterX - tooltipRect.width / 2;
        break;
      case 'left':
        top = targetCenterY - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = targetCenterY - tooltipRect.height / 2;
        left = targetRect.right + offset;
        break;
    }

    if (align === 'start') {
      if (base === 'top' || base === 'bottom') {
        left = targetRect.left;
      } else {
        top = targetRect.top;
      }
    } else if (align === 'end') {
      if (base === 'top' || base === 'bottom') {
        left = targetRect.right - tooltipRect.width;
      } else {
        top = targetRect.bottom - tooltipRect.height;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (left < 4) left = 4;
    if (left + tooltipRect.width > vw - 4) {
      left = vw - tooltipRect.width - 4;
    }
    if (top < 4) top = 4;
    if (top + tooltipRect.height > vh - 4) {
      top = vh - tooltipRect.height - 4;
    }

    setCoords({ top, left, targetCenterX, targetCenterY });
  }, [opened, position, offset, targetRef, tooltipRef]);

  return coords;
}
