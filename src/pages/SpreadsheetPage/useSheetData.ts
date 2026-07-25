import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { STORAGE_KEYS } from '../../storage/keys';

export type CellKey = `${number}:${number}`;

export type SheetData = Record<string, string>;

interface State {
  data: SheetData;
  dirty: boolean;
}

type Action =
  | { type: 'SET_CELL'; key: CellKey; value: string }
  | { type: 'CLEAR_CELL'; key: CellKey }
  | { type: 'CLEAR_RANGE'; keys: CellKey[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'HYDRATE'; data: SheetData }
  | { type: 'MARK_CLEAN' };

export const cellKey = (row: number, col: number): CellKey => `${row}:${col}`;

function loadData(key: string): SheetData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as SheetData) : {};
  } catch {
    return {};
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { data: action.data, dirty: false };

    case 'SET_CELL': {
      const { key, value } = action;
      const prev = state.data[key] ?? '';
      if (prev === value) return state;

      const next = { ...state.data };
      if (value === '') {
        if (!(key in next)) return state;
        delete next[key];
      } else {
        next[key] = value;
      }
      return { data: next, dirty: true };
    }

    case 'CLEAR_CELL': {
      if (!(action.key in state.data)) return state;
      const next = { ...state.data };
      delete next[action.key];
      return { data: next, dirty: true };
    }

    case 'CLEAR_RANGE': {
      if (action.keys.length === 0) return state;
      let changed = false;
      const next = { ...state.data };
      for (const key of action.keys) {
        if (key in next) {
          delete next[key];
          changed = true;
        }
      }
      if (!changed) return state;
      return { data: next, dirty: true };
    }

    case 'CLEAR_ALL':
      if (Object.keys(state.data).length === 0) return state;
      return { data: {}, dirty: true };

    case 'MARK_CLEAN':
      if (!state.dirty) return state;
      return { ...state, dirty: false };

    default:
      return state;
  }
}

const DEBOUNCE_MS = 400;

export function useSheetData(sheetId: string) {
  const storageKey = STORAGE_KEYS.sheetData(sheetId);

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    data: loadData(storageKey),
    dirty: false,
  }));

  useEffect(() => {
    if (!state.dirty) return;
    if (typeof window === 'undefined') return;

    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state.data));
        dispatch({ type: 'MARK_CLEAN' });
      } catch {
        // quota exceeded / private mode — игнорируем
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [state.data, state.dirty, storageKey]);

  useEffect(() => {
    const flush = () => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state.data));
      } catch {
        // ignore
      }
    };

    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [storageKey, state.data]);

  const setCell = useCallback((row: number, col: number, value: string) => {
    dispatch({ type: 'SET_CELL', key: cellKey(row, col), value });
  }, []);

  const clearCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'CLEAR_CELL', key: cellKey(row, col) });
  }, []);

  const clearRange = useCallback((keys: CellKey[]) => {
    dispatch({ type: 'CLEAR_RANGE', keys });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const getCell = useCallback((row: number, col: number) => state.data[cellKey(row, col)] ?? '', [state.data]);

  return useMemo(
    () => ({
      data: state.data,
      dirty: state.dirty,
      setCell,
      clearCell,
      clearRange,
      clearAll,
      getCell,
    }),
    [state.data, state.dirty, setCell, clearCell, clearRange, clearAll, getCell]
  );
}
