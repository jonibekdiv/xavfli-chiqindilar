import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button, Modal, Input, Select } from '../components/UI.jsx';
import { Plus, Trash2 } from 'lucide-react';

const DOC_TYPES = [
  'Qabul qilish-topshirish dalolatnomasi', 'Qayta ishlash hujjati',
  'Zararsizlantirish hujjati', 'Shartnoma', 'Laboratoriya hujjati',
  'Texnologik hujjat', 'Boshqa'
];

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', type: DOC_TYPES[0] });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crm_docs') || 'null');
    if (saved) setDocs(saved);
    else {
      const init = [
        { id: 'd1', name: 'Qabul qilish-topshirish dalolatnomasi.pdf', type: 'Qabul qilish-topshirish dalolatnomasi', size: '245 KB', date: '2026-10-01' },
        { id: 'd2', name: 'Qayta ishlash dalolatnomasi.pdf', type: 'Qayta ishlash hujjati', size: '180 KB', date: '2026-10-02' },
        { id: 'd3', name: 'Shartnoma 2026-045.pdf', type: 'Shartnoma', size: '520 KB', date: '2026-09-15' },
        { id: 'd4', name: 'Laboratoriya xulosasi Q3.pdf', type: 'Laboratoriya hujjati', size: '310 KB', date: '2026-09-28' },
      ];
      setDocs(init);
      localStorage.setItem('crm_docs', JSON.stringify(init));
    }
  }, []);

  const save = () => {
    if (!form.name.trim()) return;
    const next = [...docs, { ...form, id: 'd' + Date.now(), size: '—', date: new Date().toISOString().slice(0, 10) }];
    setDocs(next);
    localStorage.setItem('crm_docs', JSON.stringify(next));
    setShow(false);
    setForm({ name: '', type: DOC_TYPES[0] });
  };

  const remove = (id) => {
    const next = docs.filter(d => d.id !== id);
    setDocs(next);
    localStorage.setItem('crm_docs', JSON.stringify(next));
  };

  return (
    <Layout
      title="Hujjatlar"
      subtitle={`${docs.length} ta hujjat biriktirilgan`}
    actions={
  <Button size="sm" onClick={() => setShow(true)}>
    <Plus size={15} /> Hujjat qo‘shish
  </Button>
}
    >
      <div className="list">
        {docs.map(d => (
          <div key={d.id} className="list-item">
            <div className="list-icon" style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>📄</div>
            <div className="list-body">
              <b>{d.name}</b>
              <span>{d.type} · {d.size} · {d.date}</span>
            </div>
            <Badge color="gray">{d.type.split(' ')[0]}</Badge>
<button className="btn btn-ghost btn-sm" onClick={() => remove(d.id)}>
  <Trash2 size={15} />
</button>
          </div>
        ))}
      </div>

      {show && (
        <Modal
          title="Hujjat qo‘shish"
          subtitle="Hujjat turi va nomini kiriting"
          onClose={() => setShow(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setShow(false)}>Bekor</Button>
              <Button onClick={save}>Yuklash</Button>
            </>
          }
        >
          <div className="form-grid">
            <div className="full">
              <Input label="Hujjat nomi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="masalan: Dalolatnoma.pdf" />
            </div>
            <div className="full">
              <Select label="Hujjat turi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
              </Select>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}