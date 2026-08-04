import { useCallback, useMemo, useState } from 'react';
import type { SelectData, SelectOption } from './types';
import { isGroup } from './types';

export function useSelectState(data: SelectData, searchable: boolean, selectedValue: string | null) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const flatOptions = useMemo<SelectOption[]>(() => {
    const result: SelectOption[] = [];
    for (const item of data) {
      if (isGroup(item)) {
        for (const opt of item.items) result.push(opt);
      } else {
        result.push(item);
      }
    }
    return result;
  }, [data]);

  const filteredData = useMemo<SelectData>(() => {
    if (!searchable || query.trim() === '') return data;
    const q = query.toLowerCase().trim();

    const match = (opt: SelectOption) => opt.label.toLowerCase().includes(q);

    const result: SelectData = [];
    for (const item of data) {
      if (isGroup(item)) {
        const items = item.items.filter(match);
        if (items.length > 0) result.push({ group: item.group, items });
      } else if (match(item)) {
        result.push(item);
      }
    }
    return result;
  }, [data, query, searchable]);

  const visibleOptions = useMemo<SelectOption[]>(() => {
    const result: SelectOption[] = [];
    for (const item of filteredData) {
      if (isGroup(item)) result.push(...item.items);
      else result.push(item);
    }
    return result;
  }, [filteredData]);

  const reset = useCallback(() => {
    setQuery('');
    const idx = visibleOptions.findIndex((o) => o.value === selectedValue);
    setHighlightedIndex(idx >= 0 ? idx : -1);
  }, [visibleOptions, selectedValue]);

  return {
    query,
    setQuery,
    filteredData,
    visibleOptions,
    flatOptions,
    highlightedIndex,
    setHighlightedIndex,
    reset,
  };
}
