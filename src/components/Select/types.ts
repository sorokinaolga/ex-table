import type { ReactNode } from 'react';

export type SelectSize = 'xs' | 'sm' | 'md';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  leftSection?: ReactNode;
}

export interface SelectOptionGroup {
  group: string;
  items: SelectOption[];
}

export type SelectData = Array<SelectOption | SelectOptionGroup>;

export function isGroup(item: SelectOption | SelectOptionGroup): item is SelectOptionGroup {
  return 'group' in item && Array.isArray((item as SelectOptionGroup).items);
}
