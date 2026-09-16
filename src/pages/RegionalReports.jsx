import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button, Modal, Input } from '../components/UI.jsx';
import { Check, RotateCcw } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'r1', company: 'ABC MChJ', stir: '123456789', quarter: 'Q3', year: 2026, waste: 'Ishlatilgan moy', amount: 22, status: 'under_review', submitted: '2026-10-05' },
  { id: 'r2', company: 'XYZ MChJ', stir: '987654321', quarter: 'Q3', year: 2026, waste: 'Batareya', amount: 12, status: 'submitted', submitted: '2026-10-03' },
  { id: 'r3', company: 'DEF MChJ', stir: '555666777', quarter: 'Q3', year: 2026, waste: 'Kimyoviy', amount: 45, status: 'accepted', submitted: '2026-09-28' },
  { id: 'r4', company: 'GHI MChJ', stir: '111222333', quarter: 'Q2', year: 2026, waste: 'Ishlatilgan moy', amount: 18, status: 'returned', submitted: '2026-07-10' },
];

const LABELS = {
  submitted: ['blue', 'Taqdim etildi'],
  under_review: ['orange', 'Ko‘rib chiqilmoqda'],
  accepted: ['green', 'Qabul qilindi'],
  returned: ['red', 'Qaytarildi'],
  approved: ['green', 'Tasdiqlandi'],
};

export default function RegionalReports() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [returning, setReturning] = useState(null);
  const [reason, setReason] = useState('');

  const accept = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };
  const approve = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };
  const doReturn = () => {
    if (!reason.trim()) return;
    setReports(reports.map(r => r.id === returning.id ? { ...r, status: 'returned' } : r));
    setReturning(null);
    setReason('');
  };

  return (
    <Layout title="Hisobotlarni tekshirish" subtitle="Mintaqaviy boshqarma">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Korxona</th><th>STIR</th><th>Chorak</th><th>Chiqindi</th>
              <th>Miqdor</th><th>Sana</th><th>Holat</th><th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => {
              const [color, label] = LABELS[r.status] || ['gray', r.status];
              return (
                <tr key={r.id}>
                  <td><b>{r.company}</b></td>
                  <td className="mono">{r.stir}</td>
                  <td><Badge color="blue">{r.quarter} {r.year}</Badge></td>
                  <td>{r.waste}</td>
                  <td className="mono">{r.amount} t</td>
                  <td>{r.submitted}</td>
                  <td><Badge color={color}>{label}</Badge></td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      {(r.status === 'submitted' || r.status === 'under_review') && (
                        <>
                         <Button size="sm" onClick={() => accept(r.id)}>
  <Check size={15} /> Qabul
</Button>
                         <Button size="sm" variant="danger" onClick={() => setReturning(r)}>
  <RotateCcw size={15} /> Qaytarish
</Button>
                        </>
                      )}
                      {r.status === 'accepted' && (
                       <Button size="sm" onClick={() => approve(r.id)}>
  <Check size={15} /> Tasdiqlash
</Button>
                      )}
                      {r.status === 'returned' && <span className="muted">—</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {returning && (
        <Modal
          title="Hisobotni qaytarish"
          subtitle={`${returning.company} — ${returning.quarter} ${returning.year}`}
          onClose={() => setReturning(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setReturning(null)}>Bekor</Button>
              <Button variant="danger" onClick={doReturn}>Qaytarish</Button>
            </>
          }
        >
          <Input
            label="Qaytarish sababi *"
            placeholder="Masalan: Qayta ishlangan miqdor noto‘g‘ri"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </Modal>
      )}
    </Layout>
  );
}