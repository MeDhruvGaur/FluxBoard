import { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return LocalStorageService.getItem(key, initialValue);
  });

  useEffect(() => {
    LocalStorageService.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
