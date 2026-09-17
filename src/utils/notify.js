// src/utils/notify.js
// Bildirishnomalar localStorage'da saqlanadi va har bir foydalanuvchi
// faqat o'ziga yuborilganlarini ko'radi.

const KEY = 'crm_notifications_v2';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // Boshqa tablarga ham xabar berish uchun event
  window.dispatchEvent(new CustomEvent('crm:notifications-changed'));
}

/**
 * Yangi bildirishnoma yuborish
 * @param {Object} n
 * @param {string} n.toUserId    - qabul qiluvchi foydalanuvchi ID
 * @param {string} n.fromUserId  - yuboruvchi ID (ixtiyoriy)
 * @param {string} n.fromName    - yuboruvchi ismi
 * @param {string} n.type        - 'info'|'success'|'warning'|'error'|'returned'|'approved'|'submitted'
 * @param {string} n.title       - sarlavha
 * @param {string} n.text        - matn (sabab, izoh)
 * @param {string} n.relatedFileId - bog'liq fayl ID (ixtiyoriy)
 */
export function pushNotification(n) {
  const list = readAll();
  const item = {
    id: 'n' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    toUserId: n.toUserId,
    fromUserId: n.fromUserId || null,
    fromName: n.fromName || 'Tizim',
    type: n.type || 'info',
    title: n.title || 'Bildirishnoma',
    text: n.text || '',
    relatedFileId: n.relatedFileId || null,
    date: new Date().toISOString(),
    read: false,
  };
  list.unshift(item);
  writeAll(list);
  return item;
}

export function getNotifications(userId) {
  return readAll()
    .filter((n) => n.toUserId === userId)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export function markRead(id) {
  const list = readAll().map((n) => (n.id === id ? { ...n, read: true } : n));
  writeAll(list);
}

export function markAllRead(userId) {
  const list = readAll().map((n) =>
    n.toUserId === userId ? { ...n, read: true } : n
  );
  writeAll(list);
}

export function deleteNotification(id) {
  writeAll(readAll().filter((n) => n.id !== id));
}

export function unreadCount(userId) {
  return readAll().filter((n) => n.toUserId === userId && !n.read).length;
}