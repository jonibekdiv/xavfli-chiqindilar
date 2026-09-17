import { useEffect, useRef, useState } from 'react';

export default function Dropdown({ trigger, items, align = 'left', width = 240 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [align]: 0,
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            padding: 6,
            minWidth: width,
            zIndex: 60,
            animation: 'slideUp 0.18s ease',
          }}
        >
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                it.onClick?.();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: 'transparent',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                textAlign: 'left',
                color: 'var(--ios-text)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--ios-gray6)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  color: it.color || 'var(--ios-gray)',
                  flexShrink: 0,
                }}
              >
                {it.icon}
              </span>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: 'var(--ios-gray6)',
                    color: 'var(--ios-gray)',
                    fontWeight: 600,
                  }}
                >
                  {it.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}