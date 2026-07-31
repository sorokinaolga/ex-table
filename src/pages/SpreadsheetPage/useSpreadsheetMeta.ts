import { useCallback, useState } from 'react';
import { addSheet as addSheetToStorage, findSpreadsheet, renameSpreadsheet, setActiveSheet as setActiveSheetInStorage, type SpreadsheetMeta } from '../../storage/spreadsheets';

export function useSpreadsheetMeta(id: string | undefined) {
  const [meta, setMeta] = useState<SpreadsheetMeta | null>(() => (id ? findSpreadsheet(id) : null));

  const rename = useCallback(
    (title: string) => {
      if (!id) return;
      const next = renameSpreadsheet(id, title);
      if (next) setMeta(next);
    },
    [id]
  );

  const addSheet = useCallback(() => {
    if (!id) return null;
    const next = addSheetToStorage(id);
    if (next) setMeta(next);
    return next;
  }, [id]);

  const setActiveSheet = useCallback(
    (sheetId: string) => {
      if (!id) return;
      const next = setActiveSheetInStorage(id, sheetId);
      if (next) setMeta(next);
    },
    [id]
  );

  return { meta, rename, addSheet, setActiveSheet };
}
