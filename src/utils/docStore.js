// src/utils/docStore.js
import { ORG_UNITS } from '../data/orgUnits.js';

const KEY = 'crm_ijro_docs';

export function listDocs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveDoc(doc) {
  const list = listDocs();
  list.unshift(doc);
  localStorage.setItem(KEY, JSON.stringify(list));
  return doc;
}

export function updateDoc(id, patch) {
  const list = listDocs().map((d) => (d.id === id ? { ...d, ...patch } : d));
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getDoc(id) {
  return listDocs().find((d) => d.id === id) || null;
}

export function deleteDoc(id) {
  const list = listDocs().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function genDocNumber(type) {
  const prefix =
    {
      kiruvchi: 'KIR',
      chiquvchi: 'CHIQ',
      murojaat: 'MUR',
      ichki: 'ICH',
    }[type] || 'DOC';
  const year = new Date().getFullYear();
  const list = listDocs().filter((d) => d.type === type);
  const num = String(list.length + 1).padStart(4, '0');
  return `${prefix}-${year}-${num}`;
}

// ==================== Foydalanuvchiga tegishli ====================

/** Foydalanuvchi YARATGAN hujjatlar */
export function listMyDocs(user) {
  return listDocs().filter((d) => d.createdBy === user.id);
}

/** Foydalanuvchi QABUL QILUVCHI bo‘lgan hujjatlar */
export function listIncomingDocs(user) {
  if (!user) return [];
  if (user.role === 'admin') {
    return listDocs().filter((d) => d.status === 'sent');
  }

  // Foydalanuvchi hududini ORG_UNITS da topamiz
  const unit = ORG_UNITS.find(
    (u) => u.name === user.region || u.name === user.organization
  );

  if (!unit) {
    // Topilmasa — barcha yuborilganlarni ko‘rsatamiz (fallback)
    return listDocs().filter(
      (d) => d.status === 'sent' && d.createdBy !== user.id
    );
  }

  const unitIds = unit.children.map((c) => c.id);
  return listDocs().filter(
    (d) =>
      ['sent', 'approved', 'returned', 'rejected'].includes(d.status) &&
      Array.isArray(d.recipients) &&
      d.recipients.some((r) => unitIds.includes(r)) &&
      d.createdBy !== user.id
  );
}

/** Qabul qilingan, ko‘rilmagan hujjatlar soni */
export function countUnreadIncoming(user) {
  const incoming = listIncomingDocs(user);
  return incoming.filter(
    (d) => !Array.isArray(d.readBy) || !d.readBy.some((r) => r.userId === user.id)
  ).length;
}

// ==================== WORKFLOW ====================

/** Hujjatni o‘qilgan deb belgilash */
export function markDocRead(id, user) {
  const doc = getDoc(id);
  if (!doc) return;
  const readBy = Array.isArray(doc.readBy) ? doc.readBy : [];
  if (readBy.some((r) => r.userId === user.id)) return;
  readBy.push({
    userId: user.id,
    userName: user.name,
    at: new Date().toISOString(),
  });
  updateDoc(id, { readBy });
}

/** Tasdiqlash (Qabul qilish) */
export function approveDoc(id, user, comment = '') {
  const doc = getDoc(id);
  if (!doc) return;
  const now = new Date().toISOString();
  const reviews = Array.isArray(doc.reviews) ? doc.reviews : [];
  reviews.push({
    userId: user.id,
    userName: user.name,
    action: 'approved',
    reason: comment,
    at: now,
  });
  updateDoc(id, {
    status: 'approved',
    approvedAt: now,
    approvedBy: user.id,
    approvedByName: user.name,
    approvedComment: comment,
    reviews,
  });
}

/** Qaytarish (xato bor) */
export function returnDoc(id, user, reason) {
  const doc = getDoc(id);
  if (!doc) return;
  const now = new Date().toISOString();
  const reviews = Array.isArray(doc.reviews) ? doc.reviews : [];
  reviews.push({
    userId: user.id,
    userName: user.name,
    action: 'returned',
    reason,
    at: now,
  });
  updateDoc(id, {
    status: 'returned',
    returnedAt: now,
    returnedBy: user.id,
    returnedByName: user.name,
    returnReason: reason,
    reviews,
  });
}

/** Bekor qilish (rad etish) */
export function rejectDoc(id, user, reason) {
  const doc = getDoc(id);
  if (!doc) return;
  const now = new Date().toISOString();
  const reviews = Array.isArray(doc.reviews) ? doc.reviews : [];
  reviews.push({
    userId: user.id,
    userName: user.name,
    action: 'rejected',
    reason,
    at: now,
  });
  updateDoc(id, {
    status: 'rejected',
    rejectedAt: now,
    rejectedBy: user.id,
    rejectedByName: user.name,
    rejectReason: reason,
    reviews,
  });
}