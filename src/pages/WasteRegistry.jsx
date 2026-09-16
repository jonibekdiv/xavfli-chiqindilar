import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button, Modal, Input, Select } from '../components/UI.jsx';
import { WASTE_TYPES, WASTE_CLASSES, UNITS } from '../data/mockData.js';
import { Plus } from 'lucide-react';
import { Trash2, Pencil } from 'lucide-react';

export default function WasteRegistry() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '', type: WASTE_TYPES[0], wasteClass: 'II',
    source: '', unit: UNITS[0], storage: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crm_wastes') || 'null');
    if (saved) setItems(saved);
    else {
      const init = [
        { id: 'w1', name: 'Ishlatilgan moy', type: 'Ishlatilgan moy', wasteClass: 'II', source: 'Ishlab chiqarish', unit: 'tonna', storage: '1-ombor', status: 'Faol' },
        { id: 'w2', name: 'Batareya', type: 'Batareya', wasteClass: 'II', source: 'Ombor', unit: 'dona', storage: '2-ombor', status: 'Faol' },
        { id: 'w3', name: 'Kimyoviy chiqindi', type: 'Kimyoviy chiqindi', wasteClass: 'III', source: 'Sex', unit: 'kg', storage: '3-ombor', status: 'Faol' },
      ];
      setItems(init);
      localStorage.setItem('crm_wastes', JSON.stringify(init));
    }
  }, []);

  const save = () => {
    if (!form.name.trim()) return;
    const next = [...items, { ...form, id: 'w' + Date.now(), status: 'Faol' }];
    setItems(next);
    localStorage.setItem('crm_wastes', JSON.stringify(next));
    setShow(false);
    setForm({ name: '', type: WASTE_TYPES[0], wasteClass: 'II', source: '', unit: UNITS[0], storage: '' });
  };

  const remove = (id) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    localStorage.setItem('crm_wastes', JSON.stringify(next));
  };

  const classColor = (c) => ({ I: 'red', II: 'orange', III: 'yellow', IV: 'blue', V: 'green' }[c] || 'gray');

  return (
    <Layout
      title="Chiqindilar reyestri"
      subtitle={`${items.length} ta chiqindi turi`}
     actions={
  <Button size="sm" onClick={() => setShow(true)}>
    <Plus size={15} /> Chiqindi qo‘shish
  </Button>
}
    >
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>№</th><th>Chiqindi</th><th>Turi</th><th>Xavflilik</th>
              <th>Manba</th><th>Birlik</th><th>Saqlash</th><th>Holat</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id}>
                <td className="mono">{i + 1}</td>
                <td><b>{it.name}</b></td>
                <td>{it.type}</td>
                <td><Badge color={classColor(it.wasteClass)}>Sinf {it.wasteClass}</Badge></td>
                <td>{it.source}</td>
                <td>{it.unit}</td>
                <td>{it.storage}</td>
                <td><Badge color="green">{it.status}</Badge></td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => remove(it.id)}>
  <Trash2 size={15} />
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal
          title="Yangi chiqindi"
          subtitle="Barcha maydonlar majburiy"
          onClose={() => setShow(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setShow(false)}>Bekor</Button>
              <Button onClick={save}>Saqlash</Button>
            </>
          }
        >
          <div className="form-grid">
            <div className="full">
              <Input label="Chiqindi nomi *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Ishlatilgan moy" />
            </div>
            <Select label="Chiqindi turi *" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {WASTE_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Select label="Xavflilik sinfi *" value={form.wasteClass} onChange={e => setForm({ ...form, wasteClass: e.target.value })}>
              {WASTE_CLASSES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Hosil bo‘lish manbai *" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Sex, ombor..." />
            <Select label="O‘lchov birligi *" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </Select>
            <div className="full">
              <Input label="Saqlash joyi *" value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} placeholder="1-ombor" />
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}