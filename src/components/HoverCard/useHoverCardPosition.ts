import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

export type HoverCardPosition = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export interface HoverCardCoords {
  top: number;
  left: number;
}

export function useHoverCardPosition(
  targetRef: RefObject<HTMLElement | null>,
  cardRef: RefObject<HTMLDivElement | null>,
  position: HoverCardPosition,
  offset: number,
  opened: boolean
): HoverCardCoords | null {
  const [coords, setCoords] = useState<HoverCardCoords | null>(null);
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
    const card = cardRef.current;
    if (!target || !card) return;

    const targetRect = target.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const [base, align] = position.split('-') as ['top' | 'bottom' | 'left' | 'right', 'start' | 'end' | undefined];

    switch (base) {
      case 'top':
        top = targetRect.top - cardRect.height - offset;
        left = targetRect.left + targetRect.width / 2 - cardRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2 - cardRect.width / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - cardRect.height / 2;
        left = targetRect.left - cardRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - cardRect.height / 2;
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
        left = targetRect.right - cardRect.width;
      } else {
        top = targetRect.bottom - cardRect.height;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (left < 4) left = 4;
    if (left + cardRect.width > vw - 4) {
      left = vw - cardRect.width - 4;
    }
    if (top < 4) top = 4;
    if (top + cardRect.height > vh - 4) {
      top = vh - cardRect.height - 4;
    }

    setCoords({ top, left });
  }, [opened, position, offset, targetRef, cardRef]);

  return coords;
}
