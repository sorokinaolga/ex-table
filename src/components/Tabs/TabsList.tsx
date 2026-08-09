import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useTabsContext } from './Tabs.context';

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function TabsList({ children, className, withBorder = true }: TabsListProps) {
  const ctx = useTabsContext('List');
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * Клавиатурная навигация.
   * Enter/Space — выбирает таб.
   * ArrowLeft/ArrowRight — переключение по горизонтали.
   * ArrowUp/ArrowDown — переключение по вертикали.
   * Home/End — первый/последний таб.
   * Работает только по не-disabled табам.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('.tabs__tab:not([disabled])'));
    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);

    const focusTab = (index: number) => {
      const t = tabs[(index + tabs.length) % tabs.length];
      t.focus();
    };

    const isHorizontal = ctx.orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        focusTab(currentIndex + 1);
        break;
      case prevKey:
        e.preventDefault();
        focusTab(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusTab(0);
        break;
      case 'End':
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  };

  const classes = ['tabs__list', withBorder && 'tabs__list--with-border', className].filter(Boolean).join(' ');

  return (
    <div ref={listRef} role="tablist" aria-orientation={ctx.orientation} className={classes} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
