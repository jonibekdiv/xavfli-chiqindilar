export function Skeleton({ width = '100%', height = '20px', count = 1, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width,
            height,
            background:
              'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s infinite',
            borderRadius: 8,
          }}
        />
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <Skeleton height="24px" width="60%" />
      <div style={{ marginTop: 12 }}>
        <Skeleton height="16px" width="100%" count={3} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            borderBottom: '1px solid var(--ios-sep)',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 12,
          }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height="16px" width="80%" />
          ))}
        </div>
      ))}
    </div>
  );
}