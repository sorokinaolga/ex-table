import { useCallback, useState } from 'react';
import { findSpreadsheet, renameSpreadsheet, type SpreadsheetMeta } from '../../storage/spreadsheets';

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

  return { meta, rename };
}
