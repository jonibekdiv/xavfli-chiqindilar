// src/components/PermissionGate.jsx
import { useAuth } from '../context/AuthContext.jsx';
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../utils/permissions.js';

/**
 * <PermissionGate action="doc.approve">...</PermissionGate>
 * <PermissionGate all={['doc.approve', 'doc.view_all']}>...</PermissionGate>
 * <PermissionGate any={['doc.approve', 'doc.return']}>...</PermissionGate>
 * <PermissionGate action="x" fallback={<div>Ruxsat yo'q</div>}>...</PermissionGate>
 */
export default function PermissionGate({
  action,
  all,
  any,
  fallback = null,
  children,
}) {
  const { user } = useAuth();
  if (!user) return fallback;

  let allowed = true;

  if (action) allowed = allowed && hasPermission(user.role, action);
  if (all && all.length) allowed = allowed && hasAllPermissions(user.role, all);
  if (any && any.length) allowed = allowed && hasAnyPermission(user.role, any);

  return allowed ? children : fallback;
}