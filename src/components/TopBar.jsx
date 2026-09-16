import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icons.jsx';
import { Menu } from 'lucide-react';

export default function TopBar({ title, subtitle, actions, onOpenMenu }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const initials = user.name.split(' ').map((s) => s[0]).slice(0, 2).join('');

  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-menu-btn"
        onClick={onOpenMenu}
        aria-label="Menyu"
      >
        <Menu size={20} />
      </button>

      <div style={{ minWidth: 0, flex: 1 }}>
        <h1>{title}</h1>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>

      <div className="topbar-actions">
        {actions}
        <button
          className="icon-btn"
          onClick={() => nav('/notifications')}
          title="Bildirishnomalar"
        >
          <Icon name="bell" size={19} />
          <span className="dot" />
        </button>
        <div className="user-avatar" title={user.name}>
          {initials}
        </div>
      </div>
    </header>
  );
}