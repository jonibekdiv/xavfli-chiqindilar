import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge, Button, Select, Input, Modal } from '../components/UI.jsx';
import { STATUS_LABELS } from '../data/mockData.js';
import { exportPDF } from '../utils/pdf.js';
import { exportExcel } from '../utils/excel.js';
import { FileDown, FileSpreadsheet, Plus } from 'lucide-react';

const emptyQ = {
  year: 2026,
  quarter: 1,
  wasteName: 'Ishlatilgan moy',
  wasteClass: 'II',
  opening: 0,
  generated: 0,
  recycled: 0,
  neutralized: 0,
  handedOver: 0,
  stored: 0,
};

export default function QuarterlyReport() {
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyQ);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crm_quarterly') || 'null');
    if (saved) {
      setReports(saved);
    } else {
      const init = [
        {
          id: 'q1', year: 2026, quarter: 1, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
          opening: 10, generated: 20, recycled: 5, neutralized: 3, handedOver: 7, stored: 2,
          status: 'accepted', submittedAt: '2026-04-10',
        },
        {
          id: 'q2', year: 2026, quarter: 2, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
          opening: 13, generated: 18, recycled: 6, neutralized: 2, handedOver: 8, stored: 3,
          status: 'accepted', submittedAt: '2026-07-08',
        },
        {
          id: 'q3', year: 2026, quarter: 3, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
          opening: 12, generated: 22, recycled: 7, neutralized: 2, handedOver: 6, stored: 4,
          status: 'under_review', submittedAt: '2026-10-05',
        },
        {
          id: 'q4', year: 2026, quarter: 4, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
          opening: 15, generated: 0, recycled: 0, neutralized: 0, handedOver: 0, stored: 0,
          status: 'pending',
        },
      ];
      setReports(init);
      localStorage.setItem('crm_quarterly', JSON.stringify(init));
    }
  }, []);

  const persist = (next) => {
    setReports(next);
    localStorage.setItem('crm_quarterly', JSON.stringify(next));
  };

  const closing = useMemo(() => {
    const { opening, generated, recycled, neutralized, handedOver, stored } = form;
    return (
      Number(opening) + Number(generated) - Number(recycled) -
      Number(neutralized) - Number(handedOver) - Number(stored)
    );
  }, [form]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyQ);
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm(r);
    setShowForm(true);
  };

  const save = () => {
    if (editing) {
      const next = reports.map((r) =>
        r.id === editing.id ? { ...form, id: r.id, status: r.status } : r
      );
      persist(next);
    } else {
      const next = [...reports, { ...form, id: 'q' + Date.now(), status: 'draft' }];
      persist(next);
    }
    setShowForm(false);
  };

  const submit = (id) => {
    const next = reports.map((r) =>
      r.id === id
        ? { ...r, status: 'submitted', submittedAt: new Date().toISOString().slice(0, 10) }
        : r
    );
    persist(next);
  };

  // ===== PDF EKSPORT =====
  const handleExportPDF = () => {
    const columns = [
      { header: 'Chorak', dataKey: 'quarter' },
      { header: 'Chiqindi', dataKey: 'wasteName' },
      { header: 'Sinf', dataKey: 'wasteClass' },
      { header: 'Bosh.', dataKey: 'opening' },
      { header: 'Hosil', dataKey: 'generated' },
      { header: 'Qayta ishl.', dataKey: 'recycled' },
      { header: 'Zararsiz.', dataKey: 'neutralized' },
      { header: 'Topshir.', dataKey: 'handedOver' },
      { header: 'Saqlangan', dataKey: 'stored' },
      { header: 'Qoldiq', dataKey: 'closing' },
      { header: 'Holat', dataKey: 'status' },
    ];

    const rows = reports.map((r) => {
      const close =
        Number(r.opening) + Number(r.generated) - Number(r.recycled) -
        Number(r.neutralized) - Number(r.handedOver) - Number(r.stored);
      return {
        quarter: `Q${r.quarter}`,
        wasteName: r.wasteName,
        wasteClass: r.wasteClass,
        opening: r.opening,
        generated: r.generated,
        recycled: r.recycled,
        neutralized: r.neutralized,
        handedOver: r.handedOver,
        stored: r.stored,
        closing: close.toFixed(1),
        status: STATUS_LABELS[r.status]?.label || r.status,
      };
    });

    exportPDF({
      title: 'Choraklik hisobotlar · 2026',
      subtitle: "Barcha choraklar bo'yicha yig'ma jadval",
      columns,
      rows,
      fileName: `Choraklik-hisobot-2026-${new Date().toISOString().slice(0, 10)}.pdf`,
      orientation: 'landscape',
      meta: {
        Tashkilot: 'ABC MChJ',
        STIR: '123456789',
        Hudud: 'Toshkent shahri',
        Davr: '2026-yil',
        Choraklar: 'Q1 – Q4',
      },
    });
  };

  // ===== EXCEL EKSPORT =====
  const handleExportExcel = () => {
    const columns = [
      { header: 'Chorak', dataKey: 'quarter' },
      { header: 'Yil', dataKey: 'year' },
      { header: 'Chiqindi', dataKey: 'wasteName' },
      { header: 'Sinf', dataKey: 'wasteClass' },
      { header: 'Yil boshidagi qoldiq', dataKey: 'opening' },
      { header: "Hosil bo'lgan", dataKey: 'generated' },
      { header: 'Qayta ishlangan', dataKey: 'recycled' },
      { header: 'Zararsizlantirilgan', dataKey: 'neutralized' },
      { header: 'Topshirilgan', dataKey: 'handedOver' },
      { header: 'Saqlangan', dataKey: 'stored' },
      { header: 'Yil oxiri qoldiq', dataKey: 'closing' },
      { header: 'Holat', dataKey: 'status' },
    ];

    const rows = reports.map((r) => {
      const close =
        Number(r.opening) + Number(r.generated) - Number(r.recycled) -
        Number(r.neutralized) - Number(r.handedOver) - Number(r.stored);
      return {
        quarter: `Q${r.quarter}`,
        year: r.year,
        wasteName: r.wasteName,
        wasteClass: r.wasteClass,
        opening: r.opening,
        generated: r.generated,
        recycled: r.recycled,
        neutralized: r.neutralized,
        handedOver: r.handedOver,
        stored: r.stored,
        closing: close.toFixed(1),
        status: STATUS_LABELS[r.status]?.label || r.status,
      };
    });

    exportExcel({
      title: 'Choraklik hisobotlar · 2026',
      subtitle: "Barcha choraklar bo'yicha yig'ma jadval",
      columns,
      rows,
      fileName: `Choraklik-hisobot-2026-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Choraklik hisobot',
      meta: {
        Tashkilot: 'ABC MChJ',
        STIR: '123456789',
        Hudud: 'Toshkent shahri',
        Davr: '2026-yil',
      },
    });
  };

  return (
    <Layout
      title="Choraklik hisobot"
      subtitle="2026-yil hisobot davri"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={handleExportPDF}>
            <FileDown size={15} /> PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet size={15} /> Excel
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus size={15} /> Yangi
          </Button>
        </>
      }
    >
      <div className="table-wrap mb-4">
        <table>
          <thead>
            <tr>
              <th>Chorak</th>
              <th>Chiqindi</th>
              <th>Sinf</th>
              <th>Bosh.</th>
              <th>Hosil</th>
              <th>Qayta ishl.</th>
              <th>Topshir.</th>
              <th>Qoldiq</th>
              <th>Holat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const st = STATUS_LABELS[r.status] || STATUS_LABELS.draft;
              const close =
                Number(r.opening) + Number(r.generated) - Number(r.recycled) -
                Number(r.neutralized) - Number(r.handedOver) - Number(r.stored);
              return (
                <tr key={r.id}>
                  <td><b>Q{r.quarter}</b></td>
                  <td>{r.wasteName}</td>
                  <td><Badge color="orange">{r.wasteClass}</Badge></td>
                  <td className="mono">{r.opening}</td>
                  <td className="mono">{r.generated}</td>
                  <td className="mono">{r.recycled}</td>
                  <td className="mono">{r.handedOver}</td>
                  <td className="mono"><b>{close.toFixed(1)}</b></td>
                  <td><Badge color={st.color}>{st.label}</Badge></td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(r)}
                        title="Tahrirlash"
                      >
                        ✏️
                      </button>
                      {r.status === 'draft' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => submit(r.id)}
                          title="Yuborish"
                        >
                          📤
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal
          title={editing ? `Q${form.quarter} hisobotini tahrirlash` : 'Yangi choraklik hisobot'}
          subtitle="Barcha miqdorlar tonnada (yoki tanlangan birlikda)"
          onClose={() => setShowForm(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Bekor
              </Button>
              <Button onClick={save}>Saqlash</Button>
            </>
          }
        >
          <div className="form-grid">
            <Select
              label="Chorak"
              value={form.quarter}
              onChange={(e) => setForm({ ...form, quarter: Number(e.target.value) })}
            >
              {[1, 2, 3, 4].map((q) => (
                <option key={q} value={q}>Q{q}</option>
              ))}
            </Select>

            <Input
              label="Yil"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />

            <div className="full">
              <Input
                label="Chiqindi nomi"
                value={form.wasteName}
                onChange={(e) => setForm({ ...form, wasteName: e.target.value })}
              />
            </div>

            <Input
              label="Yil boshidagi qoldiq"
              type="number"
              step="0.1"
              value={form.opening}
              onChange={(e) => setForm({ ...form, opening: e.target.value })}
            />
            <Input
              label="Hosil bo'lgan"
              type="number"
              step="0.1"
              value={form.generated}
              onChange={(e) => setForm({ ...form, generated: e.target.value })}
            />
            <Input
              label="Qayta ishlangan"
              type="number"
              step="0.1"
              value={form.recycled}
              onChange={(e) => setForm({ ...form, recycled: e.target.value })}
            />
            <Input
              label="Zararsizlantirilgan"
              type="number"
              step="0.1"
              value={form.neutralized}
              onChange={(e) => setForm({ ...form, neutralized: e.target.value })}
            />
            <Input
              label="Topshirilgan"
              type="number"
              step="0.1"
              value={form.handedOver}
              onChange={(e) => setForm({ ...form, handedOver: e.target.value })}
            />
            <Input
              label="Saqlangan / joylashtirilgan"
              type="number"
              step="0.1"
              value={form.stored}
              onChange={(e) => setForm({ ...form, stored: e.target.value })}
            />

            <div className="full">
              <div
                style={{
                  padding: 12,
                  background: closing < 0 ? '#FFEBEA' : 'var(--ios-gray6)',
                  borderRadius: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="muted">Yil oxiri qoldiq (avtomatik)</span>
                <b
                  className="mono"
                  style={{ fontSize: 18, color: closing < 0 ? '#FF3B30' : 'inherit' }}
                >
                  {closing.toFixed(1)}
                </b>
              </div>
              {closing < 0 && (
                <div style={{ color: '#FF3B30', fontSize: 12.5, marginTop: 8 }}>
                  ⚠ Xatolik: matematik nomuvofiqlik. Kiritilgan miqdorlarni tekshiring.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}