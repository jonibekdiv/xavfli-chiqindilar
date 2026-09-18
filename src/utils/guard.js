// src/utils/guard.js
import { hasPermission } from './permissions.js';

// Route → talab qilinadigan ruxsat
export const ROUTE_PERMISSIONS = {
  '/profile': 'profile.view_own',
  '/wastes': 'waste.manage',
  '/quarterly': 'report.view_own',
  '/annual': 'report.view_own',
  '/documents': 'doc.view',
  '/documents/new': 'doc.create',
  '/regional/reports': 'report.view_region',
  '/regional/files': 'file.view_region',
  '/directorate/companies': 'data.view_all',
  '/directorate/files': 'file.view_all',
  '/directorate/analytics': 'analytics.view_all',
  '/admin': 'system.configure',
};

export function canAccessRoute(role, path) {
  const action = ROUTE_PERMISSIONS[path];
  if (!action) return true; // aniqlanmagan — ochiq
  return hasPermission(role, action);
}