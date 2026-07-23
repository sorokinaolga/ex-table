import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import './SpreadsheetPage.css';
import { ButtonIcon } from '../../components/ButtonIcon';
import { ArrowLeftIcon, MenuIcon, MoreHorizontalIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '../../components/icons';
import { Button } from '../../components/Button';

const COLS = 15;
const ROWS = 30;
const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type CellPos = { row: number; col: number };

export function SpreadsheetPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<Record<string, string>>({});
  const [active, setActive] = useState<CellPos>({ row: 0, col: 0 });
  const [editing, setEditing] = useState<CellPos | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const cellKey = (r: number, c: number) => `${r}:${c}`;

  const startEdit = useCallback(
    (pos: CellPos, initial?: string) => {
      setEditing(pos);
      setDraft(initial ?? data[cellKey(pos.row, pos.col)] ?? '');
    },
    [data]
  );

  const commitEdit = useCallback(() => {
    if (!editing) return;
    setData((d) => {
      const key = cellKey(editing.row, editing.col);
      if (draft === '') {
        const next = { ...d };
        delete next[key];
        return next;
      }
      return { ...d, [key]: draft };
    });
    setEditing(null);
  }, [editing, draft]);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    setDraft('');
  }, []);

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
        setActive({ row: Math.max(0, row - 1), col });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive({ row: Math.min(ROWS - 1, row + 1), col });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActive({ row, col: Math.max(0, col - 1) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        setActive({ row, col: Math.min(COLS - 1, col + 1) });
        break;
      case 'Tab':
        e.preventDefault();
        setActive({ row, col: Math.min(COLS - 1, col + (e.shiftKey ? -1 : 1)) });
        break;
      case 'Enter':
      case 'F2':
        e.preventDefault();
        startEdit(active);
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        setData((d) => {
          const next = { ...d };
          delete next[cellKey(row, col)];
          return next;
        });
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          startEdit(active, e.key);
        }
    }
  };

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `var(--sheet-row-header-width) repeat(${COLS}, var(--sheet-col-width))`,
      gridTemplateRows: `var(--sheet-row-height) repeat(${ROWS}, var(--sheet-row-height))`,
    }),
    []
  );

  return (
    <div className="sheet">
      <div className="sheet__toolbar">
        <Link to="/" aria-label="Назад">
          <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Назад">
            <ArrowLeftIcon />
          </ButtonIcon>
        </Link>

        <div className="sheet__doc-title">Таблица #{id}</div>

        <div className="sheet__toolbar-spacer" />

        <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Ещё">
          <MoreHorizontalIcon />
        </ButtonIcon>
      </div>

      <div className="sheet__grid" style={gridStyle} tabIndex={0} onKeyDown={handleKeyDown}>
        <div className="sheet__corner" />

        {Array.from({ length: COLS }, (_, c) => (
          <div key={`h-${c}`} className={'sheet__col-header' + (active.col === c ? ' is-active' : '')} onClick={() => setActive({ row: active.row, col: c })}>
            {COL_LETTERS[c]}
          </div>
        ))}

        {Array.from({ length: ROWS }, (_, r) => (
          <Row
            key={`r-${r}`}
            rowIndex={r}
            active={active}
            editing={editing}
            data={data}
            draft={draft}
            inputRef={inputRef}
            onSelect={setActive}
            onStartEdit={startEdit}
            onChangeDraft={setDraft}
            onCommit={commitEdit}
            onCancel={cancelEdit}
            cols={COLS}
          />
        ))}
      </div>

      <div className="sheet__tabbar">
        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="Добавить лист">
          <PlusIcon />
        </ButtonIcon>

        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="Все листы">
          <MenuIcon />
        </ButtonIcon>

        <button type="button" className="sheet__tab sheet__tab--active">
          Лист1 <ChevronDownIcon />
        </button>

        <div className="sheet__tabbar-spacer" />

        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="В начало">
          <ChevronLeftIcon />
        </ButtonIcon>

        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="В конец">
          <ChevronRightIcon />
        </ButtonIcon>
      </div>
    </div>
  );
}

interface RowProps {
  rowIndex: number;
  cols: number;
  active: CellPos;
  editing: CellPos | null;
  data: Record<string, string>;
  draft: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (pos: CellPos) => void;
  onStartEdit: (pos: CellPos) => void;
  onChangeDraft: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}

function Row({ rowIndex, cols, active, editing, data, draft, inputRef, onSelect, onStartEdit, onChangeDraft, onCommit, onCancel }: RowProps) {
  const rowActive = active.row === rowIndex;
  return (
    <>
      <div className={'sheet__row-header' + (rowActive ? ' is-active' : '')}>{rowIndex + 1}</div>

      {Array.from({ length: cols }, (_, c) => {
        const key = `${rowIndex}:${c}`;
        const value = data[key] ?? '';
        const isActive = active.row === rowIndex && active.col === c;
        const isEditing = editing?.row === rowIndex && editing?.col === c;

        return (
          <div
            key={key}
            className={'sheet__cell' + (isActive ? ' is-active' : '') + (isEditing ? ' is-editing' : '')}
            onClick={() => onSelect({ row: rowIndex, col: c })}
            onDoubleClick={() => onStartEdit({ row: rowIndex, col: c })}
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
