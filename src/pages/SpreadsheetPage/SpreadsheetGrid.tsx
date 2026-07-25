import { useEffect, useRef } from 'react';
import type { CellKey, SheetData } from './useSheetData';
import './SpreadsheetGrid.css';

const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface CellPos {
  row: number;
  col: number;
}

interface SpreadsheetGridProps {
  rows: number;
  cols: number;
  data: SheetData;
  colWidths: number[];
  rowHeights: number[];
  active: CellPos;
  editing: CellPos | null;
  draft: string;
  gridStyle: React.CSSProperties;
  isResizing: boolean;
  onSelect: (pos: CellPos) => void;
  onStartEdit: (row: number, col: number) => void;
  onChangeDraft: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  onStartResize: (axis: 'col' | 'row', index: number, e: React.MouseEvent) => void;
  onAutoFitCol: (col: number) => void;
  onAutoFitRow: (row: number) => void;
  onResetDimensions: () => void;
}

export function SpreadsheetGrid({
  rows,
  cols,
  data,
  active,
  editing,
  draft,
  gridStyle,
  onSelect,
  onStartEdit,
  onChangeDraft,
  onCommit,
  onCancel,
  onStartResize,
  onAutoFitCol,
  onAutoFitRow,
}: SpreadsheetGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return;

    const { row, col } = active;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onSelect({ row: Math.max(0, row - 1), col });
        break;
      case 'ArrowDown':
        e.preventDefault();
        onSelect({ row: Math.min(rows - 1, row + 1), col });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onSelect({ row, col: Math.max(0, col - 1) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        onSelect({ row, col: Math.min(cols - 1, col + 1) });
        break;
      case 'Tab':
        e.preventDefault();
        onSelect({
          row,
          col: Math.min(cols - 1, col + (e.shiftKey ? -1 : 1)),
        });
        break;
      case 'Enter':
      case 'F2':
        e.preventDefault();
        onStartEdit(row, col);
        break;
    }
  };

  return (
    <div ref={gridRef} className="sheet__grid" style={gridStyle} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="sheet__corner" />

      {Array.from({ length: cols }, (_, c) => (
        <div key={`h-${c}`} className={'sheet__col-header' + (active.col === c ? ' is-active' : '')} onClick={() => onSelect({ row: active.row, col: c })} onDoubleClick={() => onAutoFitCol(c)}>
          {COL_LETTERS[c]}
          <div
            className="sheet__resizer sheet__resizer--col"
            onMouseDown={(e) => onStartResize('col', c, e)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onAutoFitCol(c);
            }}
          />
        </div>
      ))}

      {Array.from({ length: rows }, (_, r) => (
        <GridRow
          key={`r-${r}`}
          rowIndex={r}
          cols={cols}
          data={data}
          active={active}
          editing={editing}
          draft={draft}
          inputRef={inputRef}
          onSelect={onSelect}
          onStartEdit={onStartEdit}
          onChangeDraft={onChangeDraft}
          onCommit={onCommit}
          onCancel={onCancel}
          onStartResize={onStartResize}
          onAutoFitRow={onAutoFitRow}
        />
      ))}
    </div>
  );
}

interface GridRowProps {
  rowIndex: number;
  cols: number;
  data: SheetData;
  active: CellPos;
  editing: CellPos | null;
  draft: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (pos: CellPos) => void;
  onStartEdit: (row: number, col: number) => void;
  onChangeDraft: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  onStartResize: (axis: 'col' | 'row', index: number, e: React.MouseEvent) => void;
  onAutoFitRow: (row: number) => void;
}

function GridRow({ rowIndex, cols, data, active, editing, draft, inputRef, onSelect, onStartEdit, onChangeDraft, onCommit, onCancel, onStartResize, onAutoFitRow }: GridRowProps) {
  const rowActive = active.row === rowIndex;

  return (
    <>
      <div className={'sheet__row-header' + (rowActive ? ' is-active' : '')} onClick={() => onSelect({ row: rowIndex, col: active.col })} onDoubleClick={() => onAutoFitRow(rowIndex)}>
        {rowIndex + 1}
        <div
          className="sheet__resizer sheet__resizer--row"
          onMouseDown={(e) => onStartResize('row', rowIndex, e)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onAutoFitRow(rowIndex);
          }}
        />
      </div>

      {Array.from({ length: cols }, (_, c) => {
        const key: CellKey = `${rowIndex}:${c}`;
        const value = data[key] ?? '';
        const isActive = active.row === rowIndex && active.col === c;
        const isEditing = editing?.row === rowIndex && editing?.col === c;

        return (
          <div
            key={key}
            className={'sheet__cell' + (isActive ? ' is-active' : '') + (isEditing ? ' is-editing' : '')}
            onClick={() => onSelect({ row: rowIndex, col: c })}
            onDoubleClick={() => onStartEdit(rowIndex, c)}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                className="sheet__cell-input"
                value={draft}
                onChange={(e) => onChangeDraft(e.target.value)}
                onBlur={onCommit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onCommit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    onCancel();
                  }
                }}
              />
            ) : (
              <span className="sheet__cell-text">{value}</span>
            )}
          </div>
        );
      })}
    </>
  );
}
