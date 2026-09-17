import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icons.jsx';
import { Menu } from 'lucide-react';
import { unreadCount } from '../utils/notify.js';

export default function TopBar({ title, subtitle, actions, onOpenMenu }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);
  const initials = user.name.split(' ').map((s) => s[0]).slice(0, 2).join('');

  useEffect(() => {
    const refresh = () => setUnread(unreadCount(user.id));
    refresh();
    window.addEventListener('crm:notifications-changed', refresh);
    return () => window.removeEventListener('crm:notifications-changed', refresh);
  }, [user.id]);

  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu-btn" onClick={onOpenMenu} aria-label="Menyu">
        <Menu size={20} />
      </button>

      <div style={{ minWidth: 0, flex: 1 }}>
        <h1>{title}</h1>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>

      <div className="topbar-actions">
        {actions}
        <button className="icon-btn" onClick={() => nav('/notifications')} title="Bildirishnomalar">
          <Icon name="bell" size={19} />
          {unread > 0 && (
            <span
              className="dot"
              style={{
                display: 'grid', placeItems: 'center',
                width: 18, height: 18, top: 2, right: 2,
                fontSize: 10, fontWeight: 700, color: '#fff',
                border: '2px solid var(--ios-bg)',
              }}
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        <div className="user-avatar" title={user.name}>{initials}</div>
      </div>
    </header>
  );
}