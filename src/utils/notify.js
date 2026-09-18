// src/utils/notify.js
const KEY = 'crm_notifications_v2';
let channel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('crm_notifications');
  }
} catch {
  channel = null;
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // Hamma tablarga xabar berish
  window.dispatchEvent(new CustomEvent('crm:notifications-changed'));
  if (channel) {
    try {
      channel.postMessage({ type: 'changed' });
    } catch {}
  }
}

// Boshqa tabdan kelgan xabarni qabul qilish
if (channel) {
  channel.onmessage = () => {
    window.dispatchEvent(new CustomEvent('crm:notifications-changed'));
  };
}

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