import Icon from './Icons.jsx';

export function Card({ children, style, className = '' }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

export function StatCard({ label, value, unit, icon, accent = '#007AFF' }) {
  return (
    <div className="stat" style={{ '--accent': accent }}>
      {icon && (
        <div className="stat-icon" style={{ background: accent }}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value mono">
        {value}
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}


export function Badge({ color = 'gray', children }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

export function Button({ children, variant = 'primary', size, ...rest }) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''}`;
  return <button className={cls} {...rest}>{children}</button>;
}

export function Input({ label, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input className="input" {...rest} />
    </div>
  );
}

export function Select({ label, children, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select className="input" {...rest}>{children}</select>
    </div>
  );
}

export function Modal({ title, subtitle, children, onClose, actions }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="between mb-2">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} style={{ background: 'transparent' }}>✕</button>
        </div>
        {subtitle && <p className="modal-sub">{subtitle}</p>}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, color = '#007AFF' }) {
  return (
    <div className="progress">
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, text }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={48} strokeWidth={1.5} />
      </div>
      <b>{title}</b>
      {text && <div>{text}</div>}
    </div>
  );
}