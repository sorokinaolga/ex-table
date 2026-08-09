import { useId } from 'react';
import type { ReactNode } from 'react';
import { useTabsContext } from './Tabs.context';

export interface TabsTabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
}

export function TabsTab({ value, children, disabled, leftSection, rightSection, className }: TabsTabProps) {
  const ctx = useTabsContext('Tab');
  const autoId = useId();

  const selected = ctx.value === value;
  const tabId = `tab-${ctx.baseId}-${autoId}`;
  const panelId = `panel-${ctx.baseId}-${value}`;

  const handleClick = () => {
    if (disabled) return;
    ctx.setValue(value);
  };

  const classes = ['tabs__tab', selected && 'tabs__tab--active', disabled && 'tabs__tab--disabled', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={selected}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={classes}
      onClick={handleClick}
    >
      {leftSection && (
        <span className="tabs__tab-section" aria-hidden="true">
          {leftSection}
        </span>
      )}
      <span className="tabs__tab-label">{children}</span>
      {rightSection && (
        <span className="tabs__tab-section" aria-hidden="true">
          {rightSection}
        </span>
      )}
    </button>
  );
}
