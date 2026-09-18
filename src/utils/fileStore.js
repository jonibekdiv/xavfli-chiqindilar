// src/utils/fileStore.js
const DB_NAME = 'crm_files_db';
const STORE = 'files';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFile(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(data);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function listFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
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

/**
 * Foydalanuvchiga KELGAN fayllar
 *  - admin/directorate  → barcha yuborilgan fayllar
 *  - regional           → faqat o'z hududidagi fayllar
 *  - company            → bo'sh (o'z fayli "kelgan" emas)
 */
export async function listIncomingFiles(user) {
  const all = await listFiles();
  if (!user) return [];

  const STATUSES = ['submitted', 'approved', 'returned'];

  if (user.role === 'admin' || user.role === 'directorate') {
    // ✅ Direksiya BARCHA yuborilgan fayllarni ko'radi
    return all.filter(
      (f) =>
        STATUSES.includes(f.status) &&
        f.uploaderId !== user.id
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

  // company — o'zi yuborganlarini "kelgan" sifatida ko'rmaydi
  return [];
}