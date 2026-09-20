import { useState } from 'react';
import { safeGetFromStorage, safeSetToStorage } from '../utils/storage.js';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() =>
    safeGetFromStorage(key, initialValue)
  );

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      safeSetToStorage(key, valueToStore);
    } catch (error) {
      console.error(`Storage yozish xatosi [${key}]:`, error);
    }
  };

  return [storedValue, setValue];
}