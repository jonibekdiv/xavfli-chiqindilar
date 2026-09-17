// src/components/ConfirmDialog.jsx
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const ICON_MAP = {
  warning: { Icon: AlertTriangle, color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
  danger: { Icon: AlertTriangle, color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  success: { Icon: CheckCircle2, color: '#34C759', bg: 'rgba(52,199,89,0.14)' },
  info: { Icon: Info, color: '#007AFF', bg: 'rgba(0,122,255,0.12)' },
  error: { Icon: XCircle, color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
};

export default function ConfirmDialog({
  open,
  title,
  text,
  confirmText = 'OK',
  cancelText = 'Bekor',
  variant = 'info', // 'info' | 'warning' | 'danger' | 'success' | 'error'
  onConfirm,
  onCancel,
  hideCancel = false,
}) {
  if (!open) return null;
  const { Icon, color, bg } = ICON_MAP[variant] || ICON_MAP.info;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      style={{
        zIndex: 200,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 22,
          width: '100%',
          maxWidth: 420,
          padding: '28px 24px 22px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
          animation: 'confirmPop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Yopish X */}
        <button
          onClick={onCancel}
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--ios-gray6)',
            color: 'var(--ios-gray)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: bg,
            color,
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Icon size={30} strokeWidth={2.2} />
        </div>

        {/* Sarlavha */}
        {title && (
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: '0 0 8px',
              letterSpacing: '-0.3px',
              color: 'var(--ios-text)',
            }}
          >
            {title}
          </h3>
        )}

        {/* Matn */}
        {text && (
          <p
            style={{
              fontSize: 14,
              color: 'var(--ios-text2)',
              margin: '0 0 22px',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {text}
          </p>
        )}

        {/* Tugmalar */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!hideCancel && (
            <button
              onClick={onCancel}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 12 }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              background:
                variant === 'danger' || variant === 'error'
                  ? '#FF3B30'
                  : variant === 'warning'
                  ? '#FF9500'
                  : variant === 'success'
                  ? '#34C759'
                  : '#007AFF',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmPop {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}