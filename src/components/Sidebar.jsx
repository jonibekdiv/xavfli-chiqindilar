import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { roleMenu } from '../data/mockData.js';
import Icon from './Icons.jsx';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const items = roleMenu[user.role] || [];

  const initials = user.name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('');

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <Icon name="shield" size={22} />
        </div>
        <div className="sidebar-brand-text">
          <b>Ijro intizomi</b>
          <span>Idoralararo hujjat aylanish</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">
              <Icon name={it.icon} size={19} />
            </span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <b>{user.name}</b>
            <span>{user.roleLabel}</span>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm mt-2"
          style={{ width: '100%' }}
          onClick={() => {
            logout();
            nav('/login');
          }}
        >
          <LogOut size={15} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}