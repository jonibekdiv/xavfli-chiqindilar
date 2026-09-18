// src/components/PermissionButton.jsx
import { useAuth } from '../context/AuthContext.jsx';
import { hasPermission } from '../utils/permissions.js';

/**
 * <PermissionButton
 *   action="doc.approve"
 *   onClick={...}
 *   variant="primary"
 * >Tasdiqlash</PermissionButton>
 */
export default function PermissionButton({
  action,
  hideIfNoAccess = true,
  disabledIfNoAccess = false,
  children,
  className = 'btn btn-sm',
  variant = 'primary',
  ...rest
}) {
  const { user } = useAuth();
  const allowed = user ? hasPermission(user.role, action) : false;

  if (!allowed && hideIfNoAccess) return null;
  if (!allowed && disabledIfNoAccess) {
    return (
      <button
        className={`${className} btn-${variant}`}
        disabled
        title="Ruxsat yo‘q"
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button className={`${className} btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}