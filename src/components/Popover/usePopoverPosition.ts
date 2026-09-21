import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

export type PopoverPosition = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export interface PopoverCoords {
  top: number;
  left: number;
  targetCenterX: number;
  targetCenterY: number;
}

export function usePopoverPosition(
  targetRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLDivElement | null>,
  position: PopoverPosition,
  offset: number,
  opened: boolean,
  withArrow: boolean
): PopoverCoords | null {
  const [coords, setCoords] = useState<PopoverCoords | null>(null);
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
    const popover = popoverRef.current;
    if (!target || !popover) return;

    const targetRect = target.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    const arrowSize = withArrow ? 8 : 0;
    const totalOffset = offset + arrowSize;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    let top = 0;
    let left = 0;

    const [base, align] = position.split('-') as ['top' | 'bottom' | 'left' | 'right', 'start' | 'end' | undefined];

    switch (base) {
      case 'top':
        top = targetRect.top - popoverRect.height - totalOffset;
        left = targetCenterX - popoverRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + totalOffset;
        left = targetCenterX - popoverRect.width / 2;
        break;
      case 'left':
        top = targetCenterY - popoverRect.height / 2;
        left = targetRect.left - popoverRect.width - totalOffset;
        break;
      case 'right':
        top = targetCenterY - popoverRect.height / 2;
        left = targetRect.right + totalOffset;
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
        left = targetRect.right - popoverRect.width;
      } else {
        top = targetRect.bottom - popoverRect.height;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (left < 4) left = 4;
    if (left + popoverRect.width > vw - 4) {
      left = vw - popoverRect.width - 4;
    }
    if (top < 4) top = 4;
    if (top + popoverRect.height > vh - 4) {
      top = vh - popoverRect.height - 4;
    }

    setCoords({ top, left, targetCenterX, targetCenterY });
  }, [opened, position, offset, targetRef, popoverRef, withArrow]);

  return coords;
}
