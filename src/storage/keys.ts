/**
 * префиксы хранилища ключей localStorage
 */
export const STORAGE_PREFIX = 'ex-table';

export const STORAGE_KEYS = {
  theme: `${STORAGE_PREFIX}:theme`,
  spreadsheets: `${STORAGE_PREFIX}:spreadsheets`,
  sheetData: (spreadsheetId: string, sheetId: string) => `${STORAGE_PREFIX}:sheet:${spreadsheetId}:${sheetId}:data`,
  sheetDimensions: (spreadsheetId: string, sheetId: string) => `${STORAGE_PREFIX}:sheet:${spreadsheetId}:${sheetId}:dimensions`,
  sheetActive: (id: string) => `${STORAGE_PREFIX}:sheet:${id}:active`,
} as const;
