import Layout from '../components/Layout.jsx';
import { Card, StatCard } from '../components/UI.jsx';
import { MOCK_COMPANIES, WASTE_TYPES } from '../data/mockData.js';

export default function Analytics() {
  const total = MOCK_COMPANIES.reduce((s, c) => s + c.wasteTotal, 0);

  const byType = WASTE_TYPES.slice(0, 6).map((t, i) => ({
    name: t,
    value: [1250, 890, 640, 420, 320, 180][i] || 100
  }));
  const maxVal = Math.max(...byType.map(x => x.value));

  return (
    <Layout title="Analitika" subtitle="Respublica bo‘yicha tahlil · 2026">
      <div className="grid-4 mb-4">
       <StatCard label="Jami chiqindi" value={total.toLocaleString()} unit="t" icon="recycle" accent="#007AFF" />
<StatCard label="Faol korxonalar" value="11 953" icon="building" accent="#34C759" />
<StatCard label="O‘rtacha/korxona" value="6.6" unit="t" icon="chart" accent="#AF52DE" />
<StatCard label="Muddati o‘tgan" value="892" icon="alert" accent="#FF3B30" />
      </div>

      <div className="grid grid-2">
        <Card>
          <div className="card-title">Chiqindi turlari bo‘yicha</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {byType.map(t => (
              <div key={t.name}>
                <div className="between mb-2" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5 }}>{t.name}</span>
                  <b className="mono">{t.value} t</b>
                </div>
                <div className="progress"><div style={{ width: `${(t.value / maxVal) * 100}%`, background: 'linear-gradient(90deg,#007AFF,#AF52DE)' }} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-title">Xavflilik sinflari</div>
          {[
            { cls: 'I', color: '#FF3B30', pct: 12 },
            { cls: 'II', color: '#FF9500', pct: 28 },
            { cls: 'III', color: '#FFCC00', pct: 34 },
            { cls: 'IV', color: '#007AFF', pct: 18 },
            { cls: 'V', color: '#34C759', pct: 8 },
          ].map(s => (
            <div key={s.cls} style={{ marginBottom: 14 }}>
              <div className="between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13.5 }}>Sinf {s.cls}</span>
                <b className="mono">{s.pct}%</b>
              </div>
              <div className="progress">
                <div style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Layout>
  );
}