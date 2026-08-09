import { useCallback, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { TabsContext, type TabsOrientation, type TabsSize, type TabsVariant } from './Tabs.context';
import { TabsList } from './TabsList';
import { TabsTab } from './TabsTab';
import { TabsPanel } from './TabsPanel';
import './Tabs.css';

export interface TabsProps {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;

  size?: TabsSize;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  children?: ReactNode;

  className?: string;
  'aria-label'?: string;
}

function TabsRoot({ value, defaultValue = null, onChange, size = 'md', variant = 'default', orientation = 'horizontal', children, className, 'aria-label': ariaLabel }: TabsProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const ctxValue = useMemo(
    () => ({
      value: currentValue,
      setValue,
      size,
      variant,
      orientation,
      baseId,
    }),
    [currentValue, setValue, size, variant, orientation, baseId]
  );

  const classes = ['tabs', `tabs--size-${size}`, `tabs--variant-${variant}`, `tabs--orientation-${orientation}`, className].filter(Boolean).join(' ');

  return (
    <TabsContext.Provider value={ctxValue}>
      <div className={classes} aria-label={ariaLabel}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Составной компонент: Tabs.List, Tabs.Tab, Tabs.Panel.
 * Пример:
 *   <Tabs defaultValue="1">
 *     <Tabs.List>
 *       <Tabs.Tab value="1">Первый</Tabs.Tab>
 *       <Tabs.Tab value="2">Второй</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="1">Контент 1</Tabs.Panel>
 *     <Tabs.Panel value="2">Контент 2</Tabs.Panel>
 *   </Tabs>
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
