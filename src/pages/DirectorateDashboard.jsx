import Layout from '../components/Layout.jsx';
import { StatCard, Card, Badge, Progress } from '../components/UI.jsx';
import { MOCK_COMPANIES, REGIONS } from '../data/mockData.js';

export default function DirectorateDashboard() {
  const totalWaste = MOCK_COMPANIES.reduce((s, c) => s + c.wasteTotal, 0);
  const submitted = MOCK_COMPANIES.reduce((s, c) => s + c.reportsSubmitted, 0);
  const total = MOCK_COMPANIES.reduce((s, c) => s + c.reportsTotal, 0);

  const regionStats = REGIONS.slice(0, 8).map((r, i) => ({
    name: r,
    value: [420, 380, 310, 260, 220, 190, 150, 110][i] || 80
  }));
  const maxVal = Math.max(...regionStats.map(r => r.value));

  return (
    <Layout title="O‘zbekiston Respublikasi" subtitle="Direksiya markaziy dashboard · 2026">
      <div className="grid grid-4 mb-4">
       <StatCard label="Jami korxonalar" value="12 845" icon="building" accent="#007AFF" />
<StatCard label="Jami xavfli chiqindi" value="84 520" unit="t" icon="recycle" accent="#AF52DE" />
<StatCard label="Topshirilgan hisobot" value="10 421" icon="send" accent="#34C759" />
<StatCard label="Muddati o‘tgan" value="892" icon="alert" accent="#FF3B30" />
      </div>

      <div className="grid grid-2">
        <Card>
          <div className="between mb-3">
            <div className="card-title" style={{ margin: 0 }}>Hududlar bo‘yicha chiqindi</div>
            <Badge color="purple">tonna</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {regionStats.map(r => (
              <div key={r.name}>
                <div className="between mb-2" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5 }}>{r.name}</span>
                  <b className="mono">{r.value} t</b>
                </div>
                <Progress value={(r.value / maxVal) * 100} color="#007AFF" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-title">Umumiy hisobot holati</div>
          <div style={{ marginBottom: 14 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="muted">Topshirilgan</span>
              <b className="mono">{submitted} / {total}</b>
            </div>
            <Progress value={(submitted / total) * 100} color="#34C759" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="muted">Ko‘rib chiqilmoqda</span>
              <b className="mono">1 240</b>
            </div>
            <Progress value={65} color="#FF9500" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="muted">Qaytarilgan</span>
              <b className="mono">328</b>
            </div>
            <Progress value={18} color="#FF3B30" />
          </div>

          <div className="mt-4" style={{ padding: 14, background: 'var(--ios-gray6)', borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📊 Tahlil</div>
            <div className="muted" style={{ fontSize: 12.5 }}>
              Eng yuqori ko‘rsatkich — Toshkent shahri. Eng past — Sirdaryo viloyati.
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}