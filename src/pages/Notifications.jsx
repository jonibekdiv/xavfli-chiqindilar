import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge } from '../components/UI.jsx';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
export default function Notifications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crm_notifications') || 'null');
    if (saved) setList(saved);
    else {
      const init = [
        { id: 'n1', type: 'warning', title: 'Hisobot muddati yaqinlashmoqda', text: 'Q4 hisobotini topshirish muddati 2027-01-15 gacha.', date: '2026-09-10', read: false },
        { id: 'n2', type: 'success', title: 'Hisobot qabul qilindi', text: 'Q2 hisobotingiz mintaqaviy boshqarma tomonidan qabul qilindi.', date: '2026-07-08', read: true },
        { id: 'n3', type: 'info', title: 'Tizim yangilandi', text: 'Yangi versiya: 1.4.0 — xarita moduli qo‘shildi.', date: '2026-09-01', read: true },
      ];
      setList(init);
      localStorage.setItem('crm_notifications', JSON.stringify(init));
    }
  }, []);

  const markRead = (id) => {
    const next = list.map(n => n.id === id ? { ...n, read: true } : n);
    setList(next);
    localStorage.setItem('crm_notifications', JSON.stringify(next));
  };

 
const iconFor = (t) => {
  const map = {
    warning: { Icon: AlertTriangle, color: '#FF9500' },
    success: { Icon: CheckCircle2, color: '#34C759' },
    info: { Icon: Info, color: '#007AFF' },
    error: { Icon: XCircle, color: '#FF3B30' },
  };
  return map[t] || map.info;
};

  return (
    <Layout title="Bildirishnomalar" subtitle={`${list.filter(n => !n.read).length} ta yangi`}>
      <div className="list">
        {list.map(n => {
          const { Icon, color } = iconFor(n.type);
          return (
            <div key={n.id} className="list-item" onClick={() => markRead(n.id)} style={{ background: n.read ? '#fff' : 'rgba(0,122,255,0.04)' }}>
              <div className="list-icon" style={{ background: `${color}20`, color }}>
                <Icon size={15} />
              </div>
              <div className="list-body">
                <b>{n.title}</b>
                <span>{n.text}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="muted" style={{ fontSize: 12 }}>{n.date}</div>
                {!n.read && <Badge color="blue">Yangi</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}