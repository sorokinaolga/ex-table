import { createContext, useContext } from 'react';

export type TabsSize = 'xs' | 'sm' | 'md';
export type TabsVariant = 'default' | 'pills' | 'outline';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsContextValue {
  value: string | null;
  setValue: (value: string) => void;
  size: TabsSize;
  variant: TabsVariant;
  orientation: TabsOrientation;
  baseId: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<Tabs.${component}> must be used within <Tabs>`);
  }
  return ctx;
}
