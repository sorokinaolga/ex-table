import { useCallback, useEffect, useState } from 'react';

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [stored, setStored] = useState<T>(() => {
    if (!isBrowser()) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser()) return;
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      try {
        setStored(e.newValue === null ? initialValue : JSON.parse(e.newValue));
      } catch {
        console.error('ignore');
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        if (isBrowser()) {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            console.error('приватный режим — игнорируем');
          }
        }
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    if (isBrowser()) window.localStorage.removeItem(key);
    setStored(initialValue);
  }, [key, initialValue]);

  return [stored, setValue, remove];
}
