import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { STORAGE_KEYS } from '../../storage/keys';

export interface SheetDimensions {
  colWidths: number[];
  rowHeights: number[];
}

export interface ResizeState {
  axis: 'col' | 'row';
  index: number;
  startPos: number;
  startSize: number;
}

export const MIN_COL_WIDTH = 40;
export const MIN_ROW_HEIGHT = 18;

interface State {
  dimensions: SheetDimensions;
  resizing: ResizeState | null;
}

type Action =
  | { type: 'START_RESIZE'; axis: 'col' | 'row'; index: number; pos: number }
  | { type: 'UPDATE_RESIZE'; pos: number }
  | { type: 'END_RESIZE' }
  | { type: 'SET_COL_WIDTHS'; updater: (prev: number[]) => number[] }
  | { type: 'SET_ROW_HEIGHTS'; updater: (prev: number[]) => number[] }
  | {
      type: 'RESET';
      cols: number;
      rows: number;
      defaults: { col: number; row: number };
    }
  | { type: 'HYDRATE'; dimensions: SheetDimensions };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, dimensions: action.dimensions };

    case 'START_RESIZE': {
      const { axis, index, pos } = action;
      const startSize = axis === 'col' ? (state.dimensions.colWidths[index] ?? MIN_COL_WIDTH) : (state.dimensions.rowHeights[index] ?? MIN_ROW_HEIGHT);
      return {
        ...state,
        resizing: { axis, index, startPos: pos, startSize },
      };
    }

    case 'UPDATE_RESIZE': {
      const r = state.resizing;
      if (!r) return state;

      const delta = action.pos - r.startPos;
      const min = r.axis === 'col' ? MIN_COL_WIDTH : MIN_ROW_HEIGHT;
      const next = Math.max(min, Math.round(r.startSize + delta));

      console.log('UPDATE_RESIZE', r.axis, r.index, 'delta', delta, 'next', next);

      if (r.axis === 'col') {
        if (state.dimensions.colWidths[r.index] === next) return state;
        const colWidths = [...state.dimensions.colWidths];
        colWidths[r.index] = next;
        return {
          ...state,
          dimensions: { ...state.dimensions, colWidths },
        };
      }

      if (state.dimensions.rowHeights[r.index] === next) return state;
      const rowHeights = [...state.dimensions.rowHeights];
      rowHeights[r.index] = next;
      return {
        ...state,
        dimensions: { ...state.dimensions, rowHeights },
      };
    }

    case 'END_RESIZE':
      if (!state.resizing) return state;
      return { ...state, resizing: null };

    case 'SET_COL_WIDTHS': {
      const next = action.updater(state.dimensions.colWidths);
      if (next === state.dimensions.colWidths) return state;
      return {
        ...state,
        dimensions: { ...state.dimensions, colWidths: next },
      };
    }

    case 'SET_ROW_HEIGHTS': {
      const next = action.updater(state.dimensions.rowHeights);
      if (next === state.dimensions.rowHeights) return state;
      return {
        ...state,
        dimensions: { ...state.dimensions, rowHeights: next },
      };
    }

    case 'RESET':
      return {
        ...state,
        dimensions: {
          colWidths: Array(action.cols).fill(action.defaults.col),
          rowHeights: Array(action.rows).fill(action.defaults.row),
        },
        resizing: null,
      };

    default:
      return state;
  }
}

function loadDimensions(key: string, cols: number, rows: number, defaults: { col: number; row: number }): SheetDimensions {
  const fallback: SheetDimensions = {
    colWidths: Array(cols).fill(defaults.col),
    rowHeights: Array(rows).fill(defaults.row),
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<SheetDimensions>;

    const colWidths = Array.isArray(parsed.colWidths) && parsed.colWidths.length === cols ? parsed.colWidths : fallback.colWidths;

    const rowHeights = Array.isArray(parsed.rowHeights) && parsed.rowHeights.length === rows ? parsed.rowHeights : fallback.rowHeights;

    return { colWidths, rowHeights };
  } catch {
    return fallback;
  }
}

export function useSheetDimensions(sheetId: string, cols: number, rows: number, defaults: { col: number; row: number } = { col: 100, row: 24 }) {
  const storageKey = STORAGE_KEYS.sheetDimensions(sheetId);
  const { col: defaultCol, row: defaultRow } = defaults;

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    dimensions: loadDimensions(storageKey, cols, rows, {
      col: defaultCol,
      row: defaultRow,
    }),
    resizing: null,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state.dimensions));
    } catch {
      // quota exceeded / private mode — silently ignore
    }
  }, [state.dimensions, storageKey]);

  useEffect(() => {
    if (!state.resizing) return;

    const axis = state.resizing.axis;
    const bodyClass = axis === 'col' ? 'resizing-col' : 'resizing-row';
    document.body.classList.add(bodyClass);

    const onMove = (e: MouseEvent) => {
      dispatch({
        type: 'UPDATE_RESIZE',
        pos: axis === 'col' ? e.clientX : e.clientY,
      });
    };
    const onUp = () => {
      dispatch({ type: 'END_RESIZE' });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.classList.remove(bodyClass);
    };
  }, [state.resizing]);

  const startResize = useCallback((axis: 'col' | 'row', index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'START_RESIZE',
      axis,
      index,
      pos: axis === 'col' ? e.clientX : e.clientY,
    });
  }, []);

  const setColWidths = useCallback((updater: number[] | ((prev: number[]) => number[])) => {
    dispatch({
      type: 'SET_COL_WIDTHS',
      updater: typeof updater === 'function' ? (updater as (prev: number[]) => number[]) : () => updater,
    });
  }, []);

  const setRowHeights = useCallback((updater: number[] | ((prev: number[]) => number[])) => {
    dispatch({
      type: 'SET_ROW_HEIGHTS',
      updater: typeof updater === 'function' ? (updater as (prev: number[]) => number[]) : () => updater,
    });
  }, []);

  const autoFitCol = useCallback(
    (col: number, getValue: (row: number) => string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.font = '12px sans-serif';

      let max = MIN_COL_WIDTH;
      for (let r = 0; r < rows; r++) {
        const w = ctx.measureText(getValue(r) || '').width + 20;
        if (w > max) max = w;
      }
      const target = Math.round(max);

      setColWidths((prev) => {
        if (prev[col] === target) return prev;
        const copy = [...prev];
        copy[col] = target;
        return copy;
      });
    },
    [rows, setColWidths]
  );

  const autoFitRow = useCallback(
    (row: number, getValue: (col: number) => string, colWidths: number[]) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.font = '12px sans-serif';

      let maxLines = 1;
      for (let c = 0; c < cols; c++) {
        const colWidth = (colWidths[c] ?? defaultCol) - 16;
        if (colWidth <= 0) continue;

        const text = getValue(c) || '';
        const words = text.split(/\s+/);
        let line = '';
        let lines = 1;

        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > colWidth && line) {
            lines++;
            line = w;
          } else {
            line = test;
          }
        }
        if (lines > maxLines) maxLines = lines;
      }

      const target = Math.max(MIN_ROW_HEIGHT, maxLines * 18 + 6);

      setRowHeights((prev) => {
        if (prev[row] === target) return prev;
        const copy = [...prev];
        copy[row] = target;
        return copy;
      });
    },
    [cols, defaultCol, setRowHeights]
  );

  const resetDimensions = useCallback(() => {
    dispatch({
      type: 'RESET',
      cols,
      rows,
      defaults: { col: defaultCol, row: defaultRow },
    });
  }, [cols, rows, defaultCol, defaultRow]);

  return useMemo(
    () => ({
      colWidths: state.dimensions.colWidths,
      rowHeights: state.dimensions.rowHeights,
      resizing: state.resizing,
      startResize,
      setColWidths,
      setRowHeights,
      autoFitCol,
      autoFitRow,
      resetDimensions,
    }),
    [state.dimensions.colWidths, state.dimensions.rowHeights, state.resizing, startResize, setColWidths, setRowHeights, autoFitCol, autoFitRow, resetDimensions]
  );
}
