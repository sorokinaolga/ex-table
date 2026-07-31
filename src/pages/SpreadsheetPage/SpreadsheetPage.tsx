import { useCallback, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { ButtonIcon } from '../../components/ButtonIcon';
import { ArrowLeftIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MenuIcon, MoreHorizontalIcon, PlusIcon } from '../../components/icons';
import { useSheetData } from './useSheetData';
import { useSheetDimensions } from './useSheetDimensions';
import { useSpreadsheetMeta } from './useSpreadsheetMeta';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { EditableTitle } from './EditableTitle';
import { useBeforeUnloadWarning } from '../../hooks/useBeforeUnloadWarning';
import './SpreadsheetPage.css';

const COLS = 15;
const ROWS = 30;

export function SpreadsheetPage() {
  const { id } = useParams<{ id: string }>();
  const spreadsheetId = id ?? 'default';

  const { meta, rename, addSheet, setActiveSheet } = useSpreadsheetMeta(id);

  const activeSheetId = meta?.activeSheetId ?? '';
  const activeSheet = meta?.sheets.find((s) => s.id === activeSheetId) ?? null;

  const { data, setCell, dirty } = useSheetData(spreadsheetId, activeSheetId);
  const { colWidths, rowHeights, resizing, startResize, autoFitCol, autoFitRow, resetDimensions } = useSheetDimensions(spreadsheetId, activeSheetId, COLS, ROWS);

  const [active, setActive] = useState({ row: 0, col: 0 });
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const [draft, setDraft] = useState('');

  const hasUnsavedChanges = dirty || (editing !== null && draft !== '');

  useBeforeUnloadWarning(hasUnsavedChanges);

  const startEdit = useCallback(
    (row: number, col: number) => {
      setEditing({ row, col });
      setDraft(data[`${row}:${col}`] ?? '');
    },
    [data]
  );

  const commitEdit = useCallback(() => {
    if (!editing) return;
    setCell(editing.row, editing.col, draft);
    setEditing(null);
    setDraft('');
  }, [editing, draft, setCell]);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    setDraft('');
  }, []);

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `var(--sheet-row-header-width) ` + colWidths.map((w) => `${w}px`).join(' '),
      gridTemplateRows: `var(--sheet-cell-size) ` + rowHeights.map((h) => `${h}px`).join(' '),
    }),
    [colWidths, rowHeights]
  );

  if (id && !meta) {
    return <Navigate to="/spreadsheets" replace />;
  }

  return (
    <div className="sheet">
      <div className="sheet__toolbar">
        <Link to="/spreadsheets" aria-label="Назад">
          <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Назад">
            <ArrowLeftIcon />
          </ButtonIcon>
        </Link>

        <EditableTitle key={spreadsheetId} value={meta?.title ?? ''} onChange={rename} placeholder="Без названия" />

        <div className="sheet__toolbar-spacer" />

        <ButtonIcon variant="subtle" shape="circle" size="sm" aria-label="Ещё">
          <MoreHorizontalIcon />
        </ButtonIcon>
      </div>

      {activeSheet ? (
        <SpreadsheetGrid
          key={activeSheet.id}
          rows={ROWS}
          cols={COLS}
          data={data}
          colWidths={colWidths}
          rowHeights={rowHeights}
          active={active}
          editing={editing}
          draft={draft}
          gridStyle={gridStyle}
          onSelect={setActive}
          onStartEdit={startEdit}
          onChangeDraft={setDraft}
          onCommit={commitEdit}
          onCancel={cancelEdit}
          onStartResize={startResize}
          onAutoFitCol={(col) => autoFitCol(col, (r) => data[`${r}:${col}`] ?? '')}
          onAutoFitRow={(row) => autoFitRow(row, (c) => data[`${row}:${c}`] ?? '', colWidths)}
          onResetDimensions={resetDimensions}
          isResizing={resizing !== null}
        />
      ) : (
        <div className="sheet__empty">Нет активного листа</div>
      )}

      <div className="sheet__tabbar">
        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="Добавить лист" onClick={addSheet}>
          <PlusIcon />
        </ButtonIcon>

        <ButtonIcon variant="subtle" shape="rounded" size="sm" aria-label="Все листы">
          <MenuIcon />
        </ButtonIcon>

        {meta?.sheets.map((sheet) => (
          <button key={sheet.id} type="button" className={'sheet__tab' + (sheet.id === activeSheetId ? ' sheet__tab--active' : '')} onClick={() => setActiveSheet(sheet.id)}>
            {sheet.title} {sheet.id === activeSheetId && <ChevronDownIcon />}
          </button>
        ))}

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
