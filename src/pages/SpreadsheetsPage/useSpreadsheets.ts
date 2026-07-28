import { useCallback, useState } from 'react';
import { clearAllSpreadsheets, createSpreadsheet, deleteSpreadsheet as deleteMeta, loadSpreadsheets, type SpreadsheetMeta } from '../../storage/spreadsheets';

export function useSpreadsheets() {
  const [items, setItems] = useState<SpreadsheetMeta[]>(() => loadSpreadsheets());

  const create = useCallback((title?: string) => {
    const meta = createSpreadsheet(title);
    setItems((prev) => [meta, ...prev]);
    return meta;
  }, []);

  const remove = useCallback((id: string) => {
    deleteMeta(id);
    setItems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clear = useCallback(() => {
    clearAllSpreadsheets();
    setItems([]);
  }, []);

  const refresh = useCallback(() => {
    setItems(loadSpreadsheets());
  }, []);

  return { items, create, remove, clear, refresh };
}
