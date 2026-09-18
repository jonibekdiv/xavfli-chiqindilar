// src/components/ActionButtons.jsx
import PermissionGate from './PermissionGate.jsx';
import PermissionButton from './PermissionButton.jsx';
import { CheckCircle2, RotateCcw, XCircle, Trash2 } from 'lucide-react';

/** Tasdiqlash tugmasi — faqat ruxsatli rollarga */
export function ApproveButton({ onClick, ...rest }) {
  return (
    <PermissionGate action="doc.approve">
      <PermissionButton
        action="doc.approve"
        onClick={onClick}
        className="icon-btn"
        variant="secondary"
        style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}
        title="Tasdiqlash"
        {...rest}
      >
        <CheckCircle2 size={16} />
      </PermissionButton>
    </PermissionGate>
  );
}

/** Qaytarish tugmasi */
export function ReturnButton({ onClick, ...rest }) {
  return (
    <PermissionGate action="doc.return">
      <PermissionButton
        action="doc.return"
        onClick={onClick}
        className="icon-btn"
        variant="secondary"
        style={{ background: 'rgba(255,149,0,0.12)', color: '#FF9500' }}
        title="Qaytarish"
        {...rest}
      >
        <RotateCcw size={16} />
      </PermissionButton>
    </PermissionGate>
  );
}

/** Bekor qilish tugmasi */
export function RejectButton({ onClick, ...rest }) {
  return (
    <PermissionGate action="doc.reject">
      <PermissionButton
        action="doc.reject"
        onClick={onClick}
        className="icon-btn"
        variant="secondary"
        style={{ background: 'rgba(255,59,48,0.12)', color: '#FF3B30' }}
        title="Bekor qilish"
        {...rest}
      >
        <XCircle size={16} />
      </PermissionButton>
    </PermissionGate>
  );
}

/** O'chirish tugmasi */
export function DeleteButton({ onClick, ...rest }) {
  return (
    <PermissionButton
      action="file.delete"
      hideIfNoAccess
      onClick={onClick}
      className="icon-btn"
      variant="secondary"
      title="O‘chirish"
      {...rest}
    >
      <Trash2 size={16} />
    </PermissionButton>
  );
}