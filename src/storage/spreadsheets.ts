import { STORAGE_KEYS, STORAGE_PREFIX } from './keys';

export interface Sheet {
  id: string;
  title: string;
  createdAt: number;
}

export interface SpreadsheetMeta {
  id: string;
  title: string;
  createdAt: number;
  sheets: Sheet[];
  activeSheetId: string;
}

function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

export function createSheet(title?: string): Sheet {
  return {
    id: generateId(6),
    title: title ?? 'Лист',
    createdAt: Date.now(),
  };
}

function isSheet(value: unknown): value is Sheet {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.createdAt === 'number';
}

function isMeta(value: unknown): value is SpreadsheetMeta {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.createdAt === 'number';
}

function migrateMeta(raw: unknown): SpreadsheetMeta | null {
  if (!isMeta(raw)) return null;

  const obj = raw as unknown as Record<string, unknown>;

  if (Array.isArray(obj.sheets) && obj.sheets.length > 0 && obj.sheets.every(isSheet)) {
    const sheets = obj.sheets as Sheet[];
    const activeSheetId = typeof obj.activeSheetId === 'string' && sheets.some((s) => s.id === obj.activeSheetId) ? (obj.activeSheetId as string) : sheets[0].id;

    return {
      id: raw.id,
      title: raw.title,
      createdAt: raw.createdAt,
      sheets,
      activeSheetId,
    };
  }

  const sheet = createSheet('Лист1');
  if (typeof window !== 'undefined') {
    try {
      const oldKey = `${STORAGE_PREFIX}:sheet:${raw.id}:data`;
      const oldData = window.localStorage.getItem(oldKey);
      if (oldData) {
        const newKey = STORAGE_KEYS.sheetData(raw.id, sheet.id);
        window.localStorage.setItem(newKey, oldData);
        window.localStorage.removeItem(oldKey);
      }
      const oldDimKey = `${STORAGE_PREFIX}:sheet:${raw.id}:dimensions`;
      const oldDim = window.localStorage.getItem(oldDimKey);
      if (oldDim) {
        const newKey = STORAGE_KEYS.sheetDimensions(raw.id, sheet.id);
        window.localStorage.setItem(newKey, oldDim);
        window.localStorage.removeItem(oldDimKey);
      }
    } catch {
      // ignore
    }
  }

  return {
    id: raw.id,
    title: raw.title,
    createdAt: raw.createdAt,
    sheets: [sheet],
    activeSheetId: sheet.id,
  };
}

export function loadSpreadsheets(): SpreadsheetMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.spreadsheets);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(migrateMeta).filter((m): m is SpreadsheetMeta => m !== null);
  } catch {
    return [];
  }
}

export function saveSpreadsheets(list: SpreadsheetMeta[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.spreadsheets, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function createSpreadsheet(title?: string): SpreadsheetMeta {
  const list = loadSpreadsheets();

  let id = generateId(8);
  while (list.some((s) => s.id === id)) id = generateId(8);

  const sheet = createSheet('Лист1');

  const meta: SpreadsheetMeta = {
    id,
    title: title ?? `Таблица ${list.length + 1}`,
    createdAt: Date.now(),
    sheets: [sheet],
    activeSheetId: sheet.id,
  };

  saveSpreadsheets([meta, ...list]);
  return meta;
}

export function findSpreadsheet(id: string): SpreadsheetMeta | null {
  return loadSpreadsheets().find((s) => s.id === id) ?? null;
}

export function renameSpreadsheet(id: string, title: string): SpreadsheetMeta | null {
  const list = loadSpreadsheets();
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return null;
  const trimmed = title.trim();
  if (trimmed === '') return list[index];
  const next = { ...list[index], title: trimmed };
  const nextList = [...list];
  nextList[index] = next;
  saveSpreadsheets(nextList);
  return next;
}

export function addSheet(spreadsheetId: string): SpreadsheetMeta | null {
  const list = loadSpreadsheets();
  const index = list.findIndex((s) => s.id === spreadsheetId);
  if (index === -1) return null;

  const meta = list[index];
  const sheet = createSheet(`Лист${meta.sheets.length + 1}`);
  const next: SpreadsheetMeta = {
    ...meta,
    sheets: [...meta.sheets, sheet],
    activeSheetId: sheet.id,
  };
  const nextList = [...list];
  nextList[index] = next;
  saveSpreadsheets(nextList);
  return next;
}

export function setActiveSheet(spreadsheetId: string, sheetId: string): SpreadsheetMeta | null {
  const list = loadSpreadsheets();
  const index = list.findIndex((s) => s.id === spreadsheetId);
  if (index === -1) return null;
  const meta = list[index];
  if (!meta.sheets.some((s) => s.id === sheetId)) return meta;
  const next: SpreadsheetMeta = { ...meta, activeSheetId: sheetId };
  const nextList = [...list];
  nextList[index] = next;
  saveSpreadsheets(nextList);
  return next;
}

export function deleteSpreadsheet(id: string): void {
  const list = loadSpreadsheets();
  const target = list.find((s) => s.id === id);
  saveSpreadsheets(list.filter((s) => s.id !== id));

  if (typeof window === 'undefined' || !target) return;
  try {
    for (const sheet of target.sheets) {
      window.localStorage.removeItem(STORAGE_KEYS.sheetData(id, sheet.id));
      window.localStorage.removeItem(STORAGE_KEYS.sheetDimensions(id, sheet.id));
    }
  } catch {
    // ignore
  }
}

export function clearAllSpreadsheets(): void {
  const list = loadSpreadsheets();
  for (const meta of list) {
    for (const sheet of meta.sheets) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.sheetData(meta.id, sheet.id));
        window.localStorage.removeItem(STORAGE_KEYS.sheetDimensions(meta.id, sheet.id));
      } catch {
        // ignore
      }
    }
  }
  try {
    window.localStorage.removeItem(STORAGE_KEYS.spreadsheets);
  } catch {
    // ignore
  }
}
