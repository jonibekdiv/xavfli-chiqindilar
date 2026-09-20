import { validateFileSize, validateFileType } from './validation.js';

const DB_NAME = 'crm_files_db';
const STORE = 'files';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'text/plain',
  'text/markdown',
];

function openDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(new Error('IndexedDB ochilmadi'));
    } catch (error) {
      reject(new Error(`IndexedDB xatosi: ${error.message}`));
    }
  });
}

export async function saveFile(data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).put(data);
      req.onerror = () => reject(new Error('Fayl saqlanib bo\'lmadi'));
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(new Error('Tranzaksiya xatosi'));
    });
  } catch (error) {
    console.error('Fayl saqlash xatosi:', error);
    throw new Error(`Fayl saqlanib bo'lmadi: ${error.message}`);
  }
}

export async function saveFileWithValidation(file, maxSizeMB = 50) {
  const sizeValidation = validateFileSize(file, maxSizeMB);
  if (!sizeValidation.valid) throw new Error(sizeValidation.error);

  const typeValidation = validateFileType(file, ALLOWED_TYPES);
  if (!typeValidation.valid) throw new Error(typeValidation.error);

  return await saveFile(file);
}

export async function getFile(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(new Error('Fayl olinib bo\'lmadi'));
    });
  } catch (error) {
    console.error('Fayl olish xatosi:', error);
    throw error;
  }
}

export async function deleteFile(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(new Error('Fayl o\'chirilmadi'));
    });
  } catch (error) {
    console.error('Fayl o\'chirish xatosi:', error);
    throw error;
  }
}

export async function listFiles() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(new Error('Fayllar ro\'yxati olinmadi'));
    });
  } catch (error) {
    console.error('Fayllar ro\'yxati xatosi:', error);
    return [];
  }
}

export async function updateFileMeta(id, patch) {
  const f = await getFile(id);
  if (!f) return false;
  await saveFile({ ...f, ...patch });
  return true;
}

export async function appendHistory(id, entry) {
  const f = await getFile(id);
  if (!f) return false;
  const history = Array.isArray(f.history) ? f.history : [];
  history.push({ ...entry, at: entry.at || new Date().toISOString() });
  await saveFile({ ...f, history });
  return true;
}

export async function listIncomingFiles(user) {
  const all = await listFiles();
  if (!user) return [];

  const STATUSES = ['submitted', 'approved', 'returned'];

  if (user.role === 'admin' || user.role === 'directorate') {
    return all.filter(
      (f) => STATUSES.includes(f.status) && f.uploaderId !== user.id
    );
  }

  if (user.role === 'regional') {
    return all.filter(
      (f) =>
        f.region === user.region &&
        STATUSES.includes(f.status) &&
        f.uploaderId !== user.id
    );
  }

  return [];
}