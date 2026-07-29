import { STORAGE_KEYS } from './keys';

export interface SpreadsheetMeta {
  id: string;
  title: string;
  createdAt: number;
}

const DEFAULT_TITLE_PREFIX = 'Таблица';

export function generateSpreadsheetId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function isMeta(value: unknown): value is SpreadsheetMeta {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.createdAt === 'number';
}

export function loadSpreadsheets(): SpreadsheetMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.spreadsheets);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMeta);
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

export function clearSpreadsheets(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.spreadsheets);
  } catch {
    // ignore
  }
}

export function createSpreadsheet(title?: string): SpreadsheetMeta {
  const list = loadSpreadsheets();

  let id = generateSpreadsheetId();
  while (list.some((s) => s.id === id)) {
    id = generateSpreadsheetId();
  }

  const nextIndex = list.length + 1;
  const meta: SpreadsheetMeta = {
    id,
    title: title ?? `${DEFAULT_TITLE_PREFIX} ${nextIndex}`,
    createdAt: Date.now(),
  };

  saveSpreadsheets([meta, ...list]);
  return meta;
}

export function deleteSpreadsheet(id: string): void {
  const list = loadSpreadsheets();
  saveSpreadsheets(list.filter((s) => s.id !== id));

  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.sheetData(id));
    window.localStorage.removeItem(STORAGE_KEYS.sheetDimensions(id));
  } catch {
    // ignore
  }
}

export function clearAllSpreadsheets(): void {
  const list = loadSpreadsheets();
  for (const item of list) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.sheetData(item.id));
      window.localStorage.removeItem(STORAGE_KEYS.sheetDimensions(item.id));
    } catch {
      // ignore
    }
  }
  clearSpreadsheets();
}

export function findSpreadsheet(id: string): SpreadsheetMeta | null {
  const list = loadSpreadsheets();
  return list.find((s) => s.id === id) ?? null;
}

export function renameSpreadsheet(id: string, title: string): SpreadsheetMeta | null {
  const list = loadSpreadsheets();
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const trimmed = title.trim();
  const nextTitle = trimmed === '' ? list[index].title : trimmed;

  const next: SpreadsheetMeta = { ...list[index], title: nextTitle };
  const nextList = [...list];
  nextList[index] = next;
  saveSpreadsheets(nextList);
  return next;
}
