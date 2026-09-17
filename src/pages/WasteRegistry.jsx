import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge, Button, Modal, Input, Select } from '../components/UI.jsx';
import { WASTE_CLASSES, UNITS } from '../data/mockData.js';
import { Plus, Trash2, Pencil } from 'lucide-react';

const DEFAULT_TYPES = [
  { id: 'wt1', name: 'Ishlatilgan moy' },
  { id: 'wt2', name: 'Batareya' },
  { id: 'wt3', name: 'Kimyoviy chiqindi' },
  { id: 'wt4', name: 'Lyuminestsent lampa' },
  { id: 'wt5', name: 'Tibbiy chiqindi' },
  { id: 'wt6', name: 'Elektr jihozlar' },
  { id: 'wt7', name: 'Bo‘yoq qoldiqlari' },
  { id: 'wt8', name: 'Pestitsidlar' },
];

const emptyForm = {
  name: '',
  type: '',
  wasteClass: 'II',
  source: '',
  unit: UNITS[0],
  storage: '',
  status: 'Faol',
};

export default function WasteRegistry() {
  const [items, setItems] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ===== Yuklash =====
  useEffect(() => {
    // Chiqindilar
    const saved = JSON.parse(localStorage.getItem('crm_wastes') || 'null');
    if (saved && Array.isArray(saved)) {
      setItems(saved);
    } else {
      const init = [
        { id: 'w1', name: 'Ishlatilgan moy', type: 'Ishlatilgan moy', wasteClass: 'II', source: 'Ishlab chiqarish', unit: 'tonna', storage: '1-ombor', status: 'Faol' },
        { id: 'w2', name: 'Batareya', type: 'Batareya', wasteClass: 'II', source: 'Ombor', unit: 'dona', storage: '2-ombor', status: 'Faol' },
        { id: 'w3', name: 'Kimyoviy chiqindi', type: 'Kimyoviy chiqindi', wasteClass: 'III', source: 'Sex', unit: 'kg', storage: '3-ombor', status: 'Faol' },
      ];
      setItems(init);
      localStorage.setItem('crm_wastes', JSON.stringify(init));
    }

    // Chiqindi turlari (admin panel bilan umumiy)
    const savedTypes = JSON.parse(localStorage.getItem('crm_waste_types') || 'null');
    if (savedTypes && Array.isArray(savedTypes) && savedTypes.length) {
      setWasteTypes(savedTypes);
    } else {
      setWasteTypes(DEFAULT_TYPES);
    }
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('crm_wastes', JSON.stringify(next));
  };

  // ===== CRUD =====
  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      type: wasteTypes[0]?.name || '',
    });
    setShow(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      type: item.type || wasteTypes[0]?.name || '',
      wasteClass: item.wasteClass || 'II',
      source: item.source || '',
      unit: item.unit || UNITS[0],
      storage: item.storage || '',
      status: item.status || 'Faol',
    });
    setShow(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.type.trim()) {
      alert('Chiqindi nomi va turi majburiy');
      return;
    }

    if (editingId) {
      // tahrirlash
      persist(items.map((it) => (it.id === editingId ? { ...it, ...form } : it)));
    } else {
      // yangi
      persist([...items, { ...form, id: 'w' + Date.now() }]);
    }

    setShow(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const doDelete = () => {
    if (!confirmDelete) return;
    persist(items.filter((it) => it.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const classColor = (c) =>
    ({ I: 'red', II: 'orange', III: 'yellow', IV: 'blue', V: 'green' }[c] || 'gray');

  return (
    <Layout
      title="Chiqindilar reyestri"
      subtitle={`${items.length} ta chiqindi turi`}
      actions={
        <Button size="sm" onClick={openAdd}>
          <Plus size={15} /> Chiqindi qo‘shish
        </Button>
      }
    >
      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" style={{ fontSize: 42, opacity: 0.4 }}>♻️</div>
          <b>Chiqindilar yo‘q</b>
          <div>“Chiqindi qo‘shish” tugmasi orqali qo‘shing</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Chiqindi</th>
                <th>Turi</th>
                <th>Xavflilik</th>
                <th>Manba</th>
                <th>Birlik</th>
                <th>Saqlash</th>
                <th>Holat</th>
                <th style={{ textAlign: 'right' }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id}>
                  <td className="mono">{i + 1}</td>
                  <td><b>{it.name}</b></td>
                  <td>{it.type}</td>
                  <td>
                    <Badge color={classColor(it.wasteClass)}>Sinf {it.wasteClass}</Badge>
                  </td>
                  <td>{it.source}</td>
                  <td>{it.unit}</td>
                  <td>{it.storage}</td>
                  <td>
                    <Badge color={it.status === 'Faol' ? 'green' : 'gray'}>{it.status}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 4 }}>
                      <button
                        className="icon-btn"
                        onClick={() => openEdit(it)}
                        title="Tahrirlash"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setConfirmDelete(it)}
                        title="O‘chirish"
                      >
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

      {/* ===== MODAL: qo'shish / tahrirlash ===== */}
      {show && (
        <Modal
          title={editingId ? 'Chiqindini tahrirlash' : 'Yangi chiqindi'}
          subtitle="Barcha maydonlar majburiy"
          onClose={() => {
            setShow(false);
            setEditingId(null);
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                  setEditingId(null);
                }}
              >
                Bekor
              </Button>
              <Button onClick={save}>{editingId ? 'Saqlash' : 'Qo‘shish'}</Button>
            </>
          }
        >
          <div className="form-grid">
            <div className="full">
              <Input
                label="Chiqindi nomi *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Ishlatilgan moy"
              />
            </div>

            <Select
              label="Chiqindi turi *"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {wasteTypes.length === 0 && <option value="">— Tur yo‘q —</option>}
              {wasteTypes.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </Select>

            <Select
              label="Xavflilik sinfi *"
              value={form.wasteClass}
              onChange={(e) => setForm({ ...form, wasteClass: e.target.value })}
            >
              {WASTE_CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>

            <Input
              label="Hosil bo‘lish manbai *"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="Sex, ombor..."
            />

            <Select
              label="O‘lchov birligi *"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </Select>

            <div className="full">
              <Input
                label="Saqlash joyi *"
                value={form.storage}
                onChange={(e) => setForm({ ...form, storage: e.target.value })}
                placeholder="1-ombor"
              />
            </div>

            <div className="full">
              <Select
                label="Holat"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Faol">Faol</option>
                <option value="Nofaol">Nofaol</option>
              </Select>
            </div>
          </div>
        </Modal>
      )}

      {/* ===== MODAL: o'chirish tasdiqlash ===== */}
      {confirmDelete && (
        <Modal
          title="Chiqindini o‘chirish"
          subtitle={confirmDelete.name}
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Bekor
              </Button>
              <Button variant="danger" onClick={doDelete}>
                <Trash2 size={14} /> O‘chirish
              </Button>
            </>
          }
        >
          <div style={{ fontSize: 14, color: 'var(--ios-text2)' }}>
            Bu amalni ortga qaytarib bo‘lmaydi.
          </div>
        </Modal>
      )}
    </Layout>
  );
}