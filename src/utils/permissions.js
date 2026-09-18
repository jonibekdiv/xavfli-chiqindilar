// src/utils/permissions.js
// Role-based Access Control (RBAC)
// Har bir rol uchun ruxsat etilgan amallar ro'yxati

export const PERMISSIONS = {
  admin: [
    // Foydalanuvchilar
    'user.create',
    'user.edit',
    'user.delete',
    'user.view',
    // Tizim
    'system.configure',
    'system.audit',
    'system.backup',
    // Ma'lumotlar
    'data.view_all',
    'data.export_all',
    // Hujjatlar
    'doc.create',
    'doc.view',
    'doc.view_all',
    'doc.approve',
    'doc.return',
    'doc.reject',
    // Fayllar
    'file.upload',
    'file.view',
    'file.view_all',
    'file.approve',
    'file.return',
    'file.delete',
    // Hisobotlar
    'report.view',
    'report.submit',
    'report.approve',
    'report.return',
    // Analitika
    'analytics.view_all',
  ],

  directorate: [
    // Foydalanuvchilar
    'user.view',
    // Ma'lumotlar
    'data.view_all',
    'data.export_all',
    // Hujjatlar
    'doc.create',
    'doc.view',
    'doc.view_all',
    'doc.approve',
    'doc.return',
    'doc.reject',
    // Fayllar
    'file.upload',
    'file.view',
    'file.view_all',
    'file.approve',
    'file.return',
    // Hisobotlar
    'report.view',
    'report.approve',
    'report.return',
    // Analitika
    'analytics.view_all',
    'analytics.view_region',
  ],

  regional: [
    // Hujjatlar
    'doc.create',
    'doc.view',
    'doc.view_region',   // faqat o'z hududi
    'doc.approve',        // kichik hujjatlarni tasdiqlay oladi
    'doc.return',
    // Fayllar
    'file.upload',
    'file.view',
    'file.view_region',
    'file.approve',
    'file.return',
    // Hisobotlar
    'report.view_region',
    // Analitika
    'analytics.view_region',
    // Eksport
    'data.export_region',
  ],

  company: [
    // Hujjatlar
    'doc.create',
    'doc.view',
    'doc.view_own',      // faqat o'zi yaratganlar
    // Fayllar
    'file.upload',
    'file.view_own',
    // Hisobotlar
    'report.view_own',
    'report.submit',
    'report.edit_draft',
    // Chiqindilar
    'waste.manage',
    // Profil
    'profile.view_own',
  ],
};

/**
 * Rolning ma'lum amalni bajarishga ruxsati bor-yo'qligini tekshirish
 * @param {string} role - user.role
 * @param {string} action - 'doc.approve' kabi
 * @returns {boolean}
 */
export function hasPermission(role, action) {
  if (!role || !action) return false;
  const perms = PERMISSIONS[role];
  if (!perms) return false;

  // To'liq mos kelishi
  if (perms.includes(action)) return true;

  // Wildcard: 'doc.*' — barcha doc amallari
  const [scope] = action.split('.');
  if (perms.includes(`${scope}.*`)) return true;

  return false;
}

/**
 * Bir nechta amalni tekshirish — hammasi bo'lishi shart
 */
export function hasAllPermissions(role, actions = []) {
  return actions.every((a) => hasPermission(role, a));
}

/**
 * Bir nechta amaldan kamida bittasi bo'lishi kerak
 */
export function hasAnyPermission(role, actions = []) {
  return actions.some((a) => hasPermission(role, a));
}

/**
 * Foydalanuvchi obyektidan foydalanish uchun qulay wrapper
 */
export function can(user, action) {
  if (!user) return false;
  return hasPermission(user.role, action);
}

export function canAll(user, actions = []) {
  if (!user) return false;
  return hasAllPermissions(user.role, actions);
}

export function canAny(user, actions = []) {
  if (!user) return false;
  return hasAnyPermission(user.role, actions);
}