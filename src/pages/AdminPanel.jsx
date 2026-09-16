import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button, Segmented, Modal, Input, Select } from '../components/UI.jsx';
import { DEMO_USERS, REGIONS, WASTE_TYPES, WASTE_CLASSES } from '../data/mockData.js';

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(DEMO_USERS.map(u => ({ ...u, status: 'active' })));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', login: '', role: 'company', region: REGIONS[0] });

  const save = () => {
    if (!form.name.trim() || !form.login.trim()) return;
    setUsers([...users, { ...form, id: 'u' + Date.now(), password: '123456', roleLabel: 'Yangi foydalanuvchi', status: 'active' }]);
    setShowAdd(false);
    setForm({ name: '', login: '', role: 'company', region: REGIONS[0] });
  };

  const tabs = [
    { value: 'users', label: 'Foydalanuvchilar' },
    { value: 'regions', label: 'Hududlar' },
    { value: 'wasteTypes', label: 'Chiqindi turlari' },
    { value: 'wasteClasses', label: 'Xavflilik sinflari' },
    { value: 'audit', label: 'Audit log' },
  ];

  return (
    <Layout
      title="Admin panel"
      subtitle="Tizim boshqaruvi"
      actions={<Button size="sm" onClick={() => setShowAdd(true)}>+ Foydalanuvchi</Button>}
    >
      <div className="mb-4"><Segmented value={tab} onChange={setTab} options={tabs} /></div>

      {tab === 'users' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>F.I.Sh.</th><th>Login</th><th>Rol</th><th>Hudud</th><th>Holat</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="row">
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {u.name.split(' ').map(s => s[0]).slice(0, 2).join('')}
                      </div>
                      <b>{u.name}</b>
                    </div>
                  </td>
                  <td className="mono">{u.login}</td>
                  <td><Badge color="blue">{u.roleLabel}</Badge></td>
                  <td>{u.region}</td>
                  <td><Badge color="green">Faol</Badge></td>
                  <td><button className="btn btn-ghost btn-sm">✏️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'regions' && (
        <Card>
          <div className="card-title">Hududlar ({REGIONS.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {REGIONS.map(r => (
              <div key={r} style={{ padding: 12, background: 'var(--ios-gray6)', borderRadius: 10, fontSize: 13.5 }}>
                📍 {r}
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'wasteTypes' && (
        <Card>
          <div className="card-title">Chiqindi turlari ({WASTE_TYPES.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {WASTE_TYPES.map(t => (
              <div key={t} style={{ padding: 12, background: 'var(--ios-gray6)', borderRadius: 10, fontSize: 13.5 }}>
                ♻️ {t}
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'wasteClasses' && (
        <Card>
          <div className="card-title">Xavflilik sinflari</div>
          {WASTE_CLASSES.map(c => (
            <div key={c} className="list-item" style={{ borderBottom: '1px solid var(--ios-sep)' }}>
              <Badge color={{ I: 'red', II: 'orange', III: 'yellow', IV: 'blue', V: 'green' }[c]}>Sinf {c}</Badge>
              <div className="list-body"><span>Xavflilik toifasi {c}</span></div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'audit' && (
        <div className="list">
          {[
            { who: 'Aziz Karimov', what: 'Q3 hisobotini taqdim etdi', when: '2026-10-05 14:22' },
            { who: 'Dilshod Rahimov', what: 'Q3 hisobotini ko‘rib chiqdi', when: '2026-10-05 15:10' },
            { who: 'O. Hazratqulov', what: 'Yillik hisobotni tasdiqladi', when: '2026-10-06 09:14' },
            { who: 'Sardor Adminov', what: 'Yangi foydalanuvchi qo‘shdi', when: '2026-10-06 10:00' },
          ].map((a, i) => (
            <div key={i} className="list-item" style={{ cursor: 'default' }}>
              <div className="list-icon">📝</div>
              <div className="list-body">
                <b>{a.who}</b>
                <span>{a.what}</span>
              </div>
              <span className="muted" style={{ fontSize: 12 }}>{a.when}</span>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal
          title="Yangi foydalanuvchi"
          subtitle="Rol va hududni tanlang"
          onClose={() => setShowAdd(false)}
          actions={<><Button variant="secondary" onClick={() => setShowAdd(false)}>Bekor</Button><Button onClick={save}>Saqlash</Button></>}
        >
          <div className="form-grid">
            <div className="full"><Input label="F.I.Sh." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <Input label="Login" value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} />
            <Select label="Rol" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="company">Korxona</option>
              <option value="regional">Mintaqaviy</option>
              <option value="directorate">Direksiya</option>
              <option value="admin">Admin</option>
            </Select>
            <div className="full">
              <Select label="Hudud" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </Select>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}