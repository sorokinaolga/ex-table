import { useId } from 'react';
import type { ReactNode } from 'react';
import { useTabsContext } from './Tabs.context';

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
  keepMounted?: boolean;
  className?: string;
}

export function TabsPanel({ value, children, keepMounted = false, className }: TabsPanelProps) {
  const ctx = useTabsContext('Panel');
  const autoId = useId();

  const active = ctx.value === value;
  const panelId = `panel-${ctx.baseId}-${value}`;
  const tabId = `tab-${ctx.baseId}-${autoId}`;

  if (!active && !keepMounted) return null;

  return (
    <div role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={!active} className={['tabs__panel', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
