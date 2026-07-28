/**
 * префиксы хранилища ключей localStorage
 */
export const STORAGE_PREFIX = 'ex-table';

export const STORAGE_KEYS = {
  theme: `${STORAGE_PREFIX}:theme`,
  spreadsheets: `${STORAGE_PREFIX}:spreadsheets`,
  sheetDimensions: (id: string) => `${STORAGE_PREFIX}:sheet:${id}:dimensions`,
  sheetData: (id: string) => `${STORAGE_PREFIX}:sheet:${id}:data`,
  sheetActive: (id: string) => `${STORAGE_PREFIX}:sheet:${id}:active`,
} as const;
