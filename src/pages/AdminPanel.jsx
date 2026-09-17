import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button, Segmented, Modal, Input, Select } from '../components/UI.jsx';
import { DEMO_USERS, REGIONS, WASTE_CLASSES } from '../data/mockData.js';
import Icon from '../components/Icons.jsx';
import { Plus, Pencil, Trash2, Shield, Users, MapPin } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'company', label: 'Korxona' },
  { value: 'regional', label: 'Mintaqaviy' },
  { value: 'directorate', label: 'Direksiya' },
  { value: 'admin', label: 'Admin' },
];

const ROLE_LABELS = {
  company: 'Korxona mas’ul xodimi',
  regional: 'Mintaqaviy boshqarma xodimi',
  directorate: 'Direksiya mutaxassisi',
  admin: 'Tizim administratori',
};

const DEFAULT_WASTE_TYPES = [
  'Ishlatilgan moy', 'Batareya', 'Kimyoviy chiqindi', 'Lyuminestsent lampa',
  'Tibbiy chiqindi', 'Elektr jihozlar', 'Bo‘yoq qoldiqlari', 'Pestitsidlar',
];

const emptyUser = {
  name: '',
  login: '',
  password: '123456',
  role: 'company',
  region: REGIONS[0],
  status: 'active',
};

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);

  // Modallar
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [typeForm, setTypeForm] = useState({ name: '' });
  const [confirmDeleteType, setConfirmDeleteType] = useState(null);

  // ===== Yuklash =====
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('crm_users') || 'null');
    if (savedUsers && Array.isArray(savedUsers) && savedUsers.length) {
      setUsers(savedUsers);
    } else {
      const init = DEMO_USERS.map((u) => ({ ...u, status: 'active' }));
      setUsers(init);
      localStorage.setItem('crm_users', JSON.stringify(init));
    }

    const savedTypes = JSON.parse(localStorage.getItem('crm_waste_types') || 'null');
    if (savedTypes && Array.isArray(savedTypes) && savedTypes.length) {
      setWasteTypes(savedTypes);
    } else {
      const init = DEFAULT_WASTE_TYPES.map((name, i) => ({
        id: 'wt' + (i + 1),
        name,
        createdAt: new Date().toISOString().slice(0, 10),
      }));
      setWasteTypes(init);
      localStorage.setItem('crm_waste_types', JSON.stringify(init));
    }
  }, []);

  const persistUsers = (next) => {
    setUsers(next);
    localStorage.setItem('crm_users', JSON.stringify(next));
  };

  const persistTypes = (next) => {
    setWasteTypes(next);
    localStorage.setItem('crm_waste_types', JSON.stringify(next));
  };

  // ===== USER CRUD =====
  const openAddUser = () => {
    setEditingUserId(null);
    setUserForm(emptyUser);
    setShowUserForm(true);
  };

  const openEditUser = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name || '',
      login: user.login || '',
      password: user.password || '123456',
      role: user.role || 'company',
      region: user.region || REGIONS[0],
      status: user.status || 'active',
    });
    setShowUserForm(true);
  };

  const saveUser = () => {
    if (!userForm.name.trim() || !userForm.login.trim()) {
      alert('F.I.Sh. va Login majburiy');
      return;
    }
    if (editingUserId) {
      const next = users.map((u) =>
        u.id === editingUserId
          ? { ...u, ...userForm, roleLabel: ROLE_LABELS[userForm.role] || u.roleLabel }
          : u
      );
      persistUsers(next);
    } else {
      const next = [
        ...users,
        {
          ...userForm,
          id: 'u' + Date.now(),
          roleLabel: ROLE_LABELS[userForm.role] || 'Foydalanuvchi',
        },
      ];
      persistUsers(next);
    }
    setShowUserForm(false);
    setEditingUserId(null);
    setUserForm(emptyUser);
  };

  const doDeleteUser = () => {
    if (!confirmDeleteUser) return;
    persistUsers(users.filter((u) => u.id !== confirmDeleteUser.id));
    setConfirmDeleteUser(null);
  };

  // ===== WASTE TYPE CRUD =====
  const openAddType = () => {
    setEditingTypeId(null);
    setTypeForm({ name: '' });
    setShowTypeForm(true);
  };

  const openEditType = (t) => {
    setEditingTypeId(t.id);
    setTypeForm({ name: t.name });
    setShowTypeForm(true);
  };

  const saveType = () => {
    const name = typeForm.name.trim();
    if (!name) {
      alert('Chiqindi turi nomi majburiy');
      return;
    }
    const duplicate = wasteTypes.find(
      (t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== editingTypeId
    );
    if (duplicate) {
      alert('Bu nom allaqachon mavjud');
      return;
    }
    if (editingTypeId) {
      persistTypes(wasteTypes.map((t) => (t.id === editingTypeId ? { ...t, name } : t)));
    } else {
      persistTypes([
        ...wasteTypes,
        { id: 'wt' + Date.now(), name, createdAt: new Date().toISOString().slice(0, 10) },
      ]);
    }
    setShowTypeForm(false);
    setEditingTypeId(null);
    setTypeForm({ name: '' });
  };

  const doDeleteType = () => {
    if (!confirmDeleteType) return;
    persistTypes(wasteTypes.filter((t) => t.id !== confirmDeleteType.id));
    setConfirmDeleteType(null);
  };

  // ===== Statistika: hududlar bo'yicha faol foydalanuvchilar =====
  const regionStats = useMemo(() => {
    return REGIONS.map((r) => {
      const inRegion = users.filter((u) => u.region === r);
      const active = inRegion.filter((u) => u.status === 'active').length;
      const inactive = inRegion.length - active;
      return { name: r, total: inRegion.length, active, inactive };
    }).sort((a, b) => b.active - a.active);
  }, [users]);

  const totalUsers = users.length;
  const totalActive = users.filter((u) => u.status === 'active').length;

  const tabs = [
    { value: 'users', label: 'Foydalanuvchilar' },
    { value: 'regions', label: 'Hududlar' },
    { value: 'wasteTypes', label: 'Chiqindi turlari' },
    { value: 'wasteClasses', label: 'Xavflilik sinflari' },
    { value: 'audit', label: 'Audit log' },
  ];

  // Sarlavha tugmasi — tabga qarab
  const headerAction = () => {
    if (tab === 'users') {
      return (
        <Button size="sm" onClick={openAddUser}>
          <Plus size={15} /> Foydalanuvchi
        </Button>
      );
    }
    if (tab === 'wasteTypes') {
      return (
        <Button size="sm" onClick={openAddType}>
          <Plus size={15} /> Chiqindi turi
        </Button>
      );
    }
    return null;
  };

  return (
    <Layout title="Admin panel" subtitle="Tizim boshqaruvi" actions={headerAction()}>
      <div className="mb-4" style={{ overflowX: 'auto' }}>
        <Segmented value={tab} onChange={setTab} options={tabs} />
      </div>

      {/* ================= USERS ================= */}
      {tab === 'users' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>F.I.Sh.</th>
                <th>Login</th>
                <th>Rol</th>
                <th>Hudud</th>
                <th>Holat</th>
                <th style={{ textAlign: 'right' }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="row">
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {u.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                      </div>
                      <b>{u.name}</b>
                    </div>
                  </td>
                  <td className="mono">{u.login}</td>
                  <td><Badge color="blue">{u.roleLabel || ROLE_LABELS[u.role]}</Badge></td>
                  <td>{u.region}</td>
                  <td>
                    <Badge color={u.status === 'active' ? 'green' : 'gray'}>
                      {u.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 4 }}>
                      <button className="icon-btn" onClick={() => openEditUser(u)} title="Tahrirlash">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn" onClick={() => setConfirmDeleteUser(u)} title="O‘chirish">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= REGIONS ================= */}
      {tab === 'regions' && (
        <>
          <div className="grid grid-3 mb-4">
            <div className="stat" style={{ '--accent': '#007AFF' }}>
              <div className="stat-icon" style={{ background: '#007AFF' }}>
                <Users size={20} />
              </div>
              <div className="stat-label">Jami foydalanuvchilar</div>
              <div className="stat-value mono">{totalUsers}</div>
            </div>
            <div className="stat" style={{ '--accent': '#34C759' }}>
              <div className="stat-icon" style={{ background: '#34C759' }}>
                <Users size={20} />
              </div>
              <div className="stat-label">Faol foydalanuvchilar</div>
              <div className="stat-value mono">{totalActive}</div>
            </div>
            <div className="stat" style={{ '--accent': '#AF52DE' }}>
              <div className="stat-icon" style={{ background: '#AF52DE' }}>
                <MapPin size={20} />
              </div>
              <div className="stat-label">Hududlar</div>
              <div className="stat-value mono">{REGIONS.length}</div>
            </div>
          </div>

          <Card>
            <div className="between mb-3">
              <div className="card-title" style={{ margin: 0 }}>
                Hududlar bo‘yicha faol foydalanuvchilar
              </div>
              <Badge color="green">Faol ro‘yxatdan o‘tgan</Badge>
            </div>

            <div className="table-wrap" style={{ boxShadow: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Hudud</th>
                    <th style={{ textAlign: 'right' }}>Faol</th>
                    <th style={{ textAlign: 'right' }}>Nofaol</th>
                    <th style={{ textAlign: 'right' }}>Jami</th>
                    <th>Ulush</th>
                  </tr>
                </thead>
                <tbody>
                  {regionStats.map((r, i) => {
                    const pct = totalUsers ? (r.active / totalUsers) * 100 : 0;
                    return (
                      <tr key={r.name}>
                        <td className="mono" style={{ color: 'var(--ios-gray)' }}>{i + 1}</td>
                        <td>
                          <div className="row">
                            <div
                              className="list-icon"
                              style={{
                                width: 30,
                                height: 30,
                                background: 'rgba(255,59,48,0.1)',
                                color: '#FF3B30',
                              }}
                            >
                              <MapPin size={14} />
                            </div>
                            <b>{r.name}</b>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Badge color={r.active > 0 ? 'green' : 'gray'}>{r.active}</Badge>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Badge color={r.inactive > 0 ? 'red' : 'gray'}>{r.inactive}</Badge>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <b className="mono">{r.total}</b>
                        </td>
                        <td style={{ minWidth: 140 }}>
                          <div className="row" style={{ gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div className="progress">
                                <div
                                  style={{
                                    width: `${pct}%`,
                                    background: 'linear-gradient(90deg,#007AFF,#34C759)',
                                  }}
                                />
                              </div>
                            </div>
                            <span className="mono" style={{ fontSize: 12, minWidth: 42, textAlign: 'right' }}>
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ================= WASTE TYPES ================= */}
      {tab === 'wasteTypes' && (
        <Card>
          <div className="between mb-3">
            <div className="card-title" style={{ margin: 0 }}>
              Chiqindi turlari ({wasteTypes.length})
            </div>
            <Badge color="purple">CRUD</Badge>
          </div>

          {wasteTypes.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon name="recycle" size={48} strokeWidth={1.5} /></div>
              <b>Chiqindi turlari yo‘q</b>
              <div>“Chiqindi turi” tugmasi orqali qo‘shing</div>
            </div>
          ) : (
            <div className="list" style={{ boxShadow: 'none' }}>
              {wasteTypes.map((t, i) => (
                <div key={t.id} className="list-item" style={{ cursor: 'default' }}>
                  <div
                    className="list-icon"
                    style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759', fontSize: 13, fontWeight: 700 }}
                  >
                    {i + 1}
                  </div>
                  <div className="list-body">
                    <b>{t.name}</b>
                    <span>Qo‘shilgan: {t.createdAt || '—'}</span>
                  </div>
                  <button className="icon-btn" onClick={() => openEditType(t)} title="Tahrirlash">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn" onClick={() => setConfirmDeleteType(t)} title="O‘chirish">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ================= WASTE CLASSES ================= */}
      {tab === 'wasteClasses' && (
        <Card>
          <div className="card-title">Xavflilik sinflari</div>
          {WASTE_CLASSES.map((c) => (
            <div key={c} className="list-item" style={{ borderBottom: '1px solid var(--ios-sep)' }}>
              <Badge color={{ I: 'red', II: 'orange', III: 'yellow', IV: 'blue', V: 'green' }[c]}>
                Sinf {c}
              </Badge>
              <div className="list-body"><span>Xavflilik toifasi {c}</span></div>
            </div>
          ))}
        </Card>
      )}

      {/* ================= AUDIT ================= */}
      {tab === 'audit' && (
        <div className="list">
          {[
            { who: 'Aziz Karimov', what: 'Q3 hisobotini taqdim etdi', when: '2026-10-05 14:22' },
            { who: 'Dilshod Rahimov', what: 'Q3 hisobotini ko‘rib chiqdi', when: '2026-10-05 15:10' },
            { who: 'O. Hazratqulov', what: 'Yillik hisobotni tasdiqladi', when: '2026-10-06 09:14' },
            { who: 'Sardor Adminov', what: 'Yangi foydalanuvchi qo‘shdi', when: '2026-10-06 10:00' },
          ].map((a, i) => (
            <div key={i} className="list-item" style={{ cursor: 'default' }}>
              <div className="list-icon"><Icon name="activity" size={20} /></div>
              <div className="list-body">
                <b>{a.who}</b>
                <span>{a.what}</span>
              </div>
              <span className="muted" style={{ fontSize: 12 }}>{a.when}</span>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: USER ================= */}
      {showUserForm && (
        <Modal
          title={editingUserId ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
          subtitle={editingUserId ? 'Ma’lumotlarni o‘zgartiring' : 'Yangi foydalanuvchi ma’lumotlari'}
          onClose={() => { setShowUserForm(false); setEditingUserId(null); }}
          actions={
            <>
              <Button variant="secondary" onClick={() => { setShowUserForm(false); setEditingUserId(null); }}>
                Bekor
              </Button>
              <Button onClick={saveUser}>{editingUserId ? 'Saqlash' : 'Qo‘shish'}</Button>
            </>
          }
        >
          <div className="form-grid">
            <div className="full">
              <Input
                label="F.I.Sh. *"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="Masalan: Aziz Karimov"
              />
            </div>
            <Input
              label="Login *"
              value={userForm.login}
              onChange={(e) => setUserForm({ ...userForm, login: e.target.value })}
            />
            <Input
              label="Parol"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            />
            <Select label="Rol" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              {ROLE_OPTIONS.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
            </Select>
            <Select label="Hudud" value={userForm.region} onChange={(e) => setUserForm({ ...userForm, region: e.target.value })}>
              {REGIONS.map((r) => (<option key={r}>{r}</option>))}
            </Select>
            <div className="full">
              <Select label="Holat" value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </Select>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: 12, background: 'var(--ios-gray6)', borderRadius: 10, fontSize: 12, color: 'var(--ios-gray)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Shield size={14} /> Parolni o‘zgartirsangiz, foydalanuvchi yangi parol bilan kiradi.
          </div>
        </Modal>
      )}

      {/* ================= MODAL: DELETE USER ================= */}
      {confirmDeleteUser && (
        <Modal
          title="Foydalanuvchini o‘chirish"
          subtitle={`${confirmDeleteUser.name} (${confirmDeleteUser.login})`}
          onClose={() => setConfirmDeleteUser(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirmDeleteUser(null)}>Bekor</Button>
              <Button variant="danger" onClick={doDeleteUser}>
                <Trash2 size={14} /> O‘chirish
              </Button>
            </>
          }
        >
          <div style={{ fontSize: 14, color: 'var(--ios-text2)' }}>
            Bu amalni ortga qaytarib bo‘lmaydi. Foydalanuvchi tizimga kira olmaydi.
          </div>
        </Modal>
      )}

      {/* ================= MODAL: WASTE TYPE ================= */}
      {showTypeForm && (
        <Modal
          title={editingTypeId ? 'Chiqindi turini tahrirlash' : 'Yangi chiqindi turi'}
          subtitle={editingTypeId ? 'Nomni o‘zgartiring' : 'Yangi tur nomini kiriting'}
          onClose={() => { setShowTypeForm(false); setEditingTypeId(null); }}
          actions={
            <>
              <Button variant="secondary" onClick={() => { setShowTypeForm(false); setEditingTypeId(null); }}>
                Bekor
              </Button>
              <Button onClick={saveType}>{editingTypeId ? 'Saqlash' : 'Qo‘shish'}</Button>
            </>
          }
        >
          <Input
            label="Chiqindi turi nomi *"
            value={typeForm.name}
            onChange={(e) => setTypeForm({ name: e.target.value })}
            placeholder="Masalan: Ishlatilgan moy"
            autoFocus
          />
        </Modal>
      )}

      {/* ================= MODAL: DELETE WASTE TYPE ================= */}
      {confirmDeleteType && (
        <Modal
          title="Chiqindi turini o‘chirish"
          subtitle={confirmDeleteType.name}
          onClose={() => setConfirmDeleteType(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirmDeleteType(null)}>Bekor</Button>
              <Button variant="danger" onClick={doDeleteType}>
                <Trash2 size={14} /> O‘chirish
              </Button>
            </>
          }
        >
          <div style={{ fontSize: 14, color: 'var(--ios-text2)' }}>
            Bu turni o‘chirsangiz, yangi chiqindi qo‘shishda ro‘yxatda ko‘rinmaydi. Avval qo‘shilgan chiqindilarga ta’sir qilmaydi.
          </div>
        </Modal>
      )}
    </Layout>
  );
}