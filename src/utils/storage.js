/**
 * Xavfsiz localStorage wrapper
 */
export function safeGetFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Storage o'qish xatosi [${key}]:`, error);
    return defaultValue;
  }
}

export function safeSetToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Storage yozish xatosi [${key}]:`, error);
    return false;
  }
}

export function safeClearStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Storage o'chirish xatosi [${key}]:`, error);
    return false;
  }
}