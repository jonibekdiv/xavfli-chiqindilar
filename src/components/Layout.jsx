import { useState } from 'react';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { roleMenu } from '../data/mockData.js';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import Icon from './Icons.jsx';
import { LogOut, X } from 'lucide-react';

function MobileDrawer({ open, onClose, items, user, onLogout }) {
  const initials = user.name.split(' ').map((s) => s[0]).slice(0, 2).join('');
  return (
    <div
      className={`drawer-overlay ${open ? 'open' : ''}`}
      onClick={onClose}
    >
      <aside
        className="sidebar"
        style={{
          display: 'flex',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: 280,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 91,
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-brand" style={{ justifyContent: 'space-between' }}>
          <div className="row">
            <div className="sidebar-brand-logo">
              <Icon name="shield" size={22} />
            </div>
            <div className="sidebar-brand-text">
              <b>Xavfli chiqindilar</b>
              <span>Yagona platforma</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === '/'}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
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
            onClick={onLogout}
          >
            <LogOut size={15} />
            Chiqish
          </button>
        </div>
      </aside>
    </div>
  );
}

function BottomNav({ items }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.slice(0, 5).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon name={it.icon} size={22} />
            <span>{it.shortLabel || it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function Layout({ children, title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  const items = roleMenu[user.role] || [];
  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar
          title={title}
          subtitle={subtitle}
          actions={actions}
          onOpenMenu={() => setDrawerOpen(true)}
        />
        <div className="page">{children}</div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        user={user}
        onLogout={handleLogout}
      />

      <BottomNav items={items} />
    </div>
  );
}