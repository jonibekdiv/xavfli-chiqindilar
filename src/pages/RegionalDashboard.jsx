import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { StatCard, Card, Badge, Progress, Segmented } from '../components/UI.jsx';
import { MOCK_COMPANIES } from '../data/mockData.js';

export default function RegionalDashboard() {
  const [filter, setFilter] = useState('all');
  const [companies, setCompanies] = useState(MOCK_COMPANIES);

  const filtered = companies.filter(c => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'overdue') return c.status === 'overdue';
    if (filter === 'pending') return c.status === 'pending';
    return true;
  });

  const total = companies.length;
  const submitted = companies.filter(c => c.reportsSubmitted >= 3).length;
  const overdue = companies.filter(c => c.status === 'overdue').length;

  const statusBadge = (s) => ({ active: ['green', 'Faol'], overdue: ['red', 'Muddati o‘tgan'], pending: ['orange', 'Kutilmoqda'] }[s] || ['gray', s]);

  return (
    <Layout title="Toshkent viloyati" subtitle="Mintaqaviy boshqarma dashboard">
      <div className="grid grid-4 mb-4">
       <StatCard label="Jami korxonalar" value={total} icon="building" accent="#007AFF" />
<StatCard label="Hisobot topshirgan" value={submitted} icon="send" accent="#34C759" />
<StatCard label="Kutilmoqda" value={total - submitted - overdue} icon="clock" accent="#FF9500" />
<StatCard label="Muddati o‘tgan" value={overdue} icon="alert" accent="#FF3B30" />
      </div>

      <Card className="mb-4">
        <div className="between mb-3">
          <div className="card-title" style={{ margin: 0 }}>Korxonalar hisoboti</div>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Barchasi' },
              { value: 'active', label: 'Faol' },
              { value: 'pending', label: 'Kutilmoqda' },
              { value: 'overdue', label: 'Muddati o‘tgan' },
            ]}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Korxona</th><th>STIR</th><th>Hudud</th><th>Chiqindi</th><th>Hisobot</th><th>Holat</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const [color, label] = statusBadge(c.status);
                return (
                  <tr key={c.id}>
                    <td><b>{c.name}</b></td>
                    <td className="mono">{c.stir}</td>
                    <td>{c.district}</td>
                    <td className="mono">{c.wasteTotal} t</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                        <Progress value={(c.reportsSubmitted / c.reportsTotal) * 100} />
                        <span className="mono" style={{ fontSize: 12 }}>{c.reportsSubmitted}/{c.reportsTotal}</span>
                      </div>
                    </td>
                    <td><Badge color={color}>{label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}