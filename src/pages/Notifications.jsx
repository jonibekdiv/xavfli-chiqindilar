import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Badge, Button } from '../components/UI.jsx';
import {
  AlertTriangle, CheckCircle2, Info, XCircle, RotateCcw, Send,
  Bell, Trash2, CheckCheck, FileText,
} from 'lucide-react';
import {
  getNotifications, markRead, markAllRead, deleteNotification,
  unreadCount,
} from '../utils/notify.js';
import { useAuth } from '../context/AuthContext.jsx';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'hozir';
  if (diff < 3600) return Math.floor(diff / 60) + ' daqiqa oldin';
  if (diff < 86400) return Math.floor(diff / 3600) + ' soat oldin';
  if (diff < 604800) return Math.floor(diff / 86400) + ' kun oldin';
  return new Date(iso).toLocaleDateString('uz-UZ');
}

function iconFor(type) {
  const map = {
    warning: { Icon: AlertTriangle, color: '#FF9500' },
    success: { Icon: CheckCircle2, color: '#34C759' },
    info: { Icon: Info, color: '#007AFF' },
    error: { Icon: XCircle, color: '#FF3B30' },
    returned: { Icon: RotateCcw, color: '#FF3B30' },
    approved: { Icon: CheckCircle2, color: '#34C759' },
    submitted: { Icon: Send, color: '#007AFF' },
  };
  return map[type] || map.info;
}

export default function Notifications() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');

  const reload = () => setList(getNotifications(user.id));

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener('crm:notifications-changed', handler);
    return () => window.removeEventListener('crm:notifications-changed', handler);
  }, [user.id]);

  const handleOpen = (n) => {
    markRead(n.id);
    reload();
    // Faylga bog'langan bo'lsa, fayllar sahifasiga o'tish
    if (n.relatedFileId) {
      if (user.role === 'company') nav('/documents');
      else if (user.role === 'regional') nav('/regional/files');
      else if (user.role === 'directorate') nav('/directorate/files');
    }
  };

  const doMarkAll = () => {
    markAllRead(user.id);
    reload();
  };

  const doDelete = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
    reload();
  };

  const filtered = filter === 'all' ? list : list.filter((n) => !n.read);
  const unread = unreadCount(user.id);

  return (
    <Layout
      title="Bildirishnomalar"
      subtitle={unread ? `${unread} ta yangi` : 'Hammasi o‘qilgan'}
      actions={
        unread > 0 && (
          <Button variant="secondary" size="sm" onClick={doMarkAll}>
            <CheckCheck size={15} /> Hammasini o‘qildi
          </Button>
        )
      }
    >
      <div className="mb-3" style={{ display: 'flex', gap: 6 }}>
        {[
          { v: 'all', l: `Barchasi (${list.length})` },
          { v: 'unread', l: `O‘qilmagan (${unread})` },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className="btn btn-sm"
            style={{
              background: filter === f.v ? 'var(--ios-blue)' : 'var(--ios-gray6)',
              color: filter === f.v ? '#fff' : 'var(--ios-text2)',
            }}
          >
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><Bell size={48} strokeWidth={1.5} /></div>
          <b>Bildirishnomalar yo‘q</b>
          <div>Yangi xabarlar shu yerda ko‘rinadi</div>
        </div>
      ) : (
        <div className="list">
          {filtered.map((n) => {
            const { Icon: NIcon, color } = iconFor(n.type);
            return (
              <div
                key={n.id}
                className="list-item"
                onClick={() => handleOpen(n)}
                style={{
                  background: n.read ? '#fff' : 'rgba(0,122,255,0.04)',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  className="list-icon"
                  style={{ background: `${color}18`, color, flexShrink: 0, marginTop: 2 }}
                >
                  <NIcon size={20} />
                </div>
                <div className="list-body">
                  <div className="row" style={{ gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <b style={{ fontSize: 14 }}>{n.title}</b>
                    {!n.read && <Badge color="blue">Yangi</Badge>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text2)', lineHeight: 1.5 }}>
                    {n.text}
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--ios-gray)', marginTop: 6,
                    display: 'flex', gap: 10, flexWrap: 'wrap',
                  }}>
                    <span>{n.fromName}</span>
                    <span>·</span>
                    <span>{timeAgo(n.date)}</span>
                    {n.relatedFileId && (
                      <>
                        <span>·</span>
                        <span style={{ color: 'var(--ios-blue)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <FileText size={11} /> Faylni ko‘rish
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="icon-btn"
                  onClick={(e) => doDelete(e, n.id)}
                  title="O‘chirish"
                  style={{ flexShrink: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}