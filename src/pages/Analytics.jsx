import Layout from '../components/Layout.jsx';
import { Card } from '../components/UI.jsx';
import { MOCK_COMPANIES, WASTE_TYPES } from '../data/mockData.js';
import {
  Recycle, Building2, TrendingUp, AlertTriangle,
} from 'lucide-react';

function StatCardFixed({ label, value, unit, Icon, accent }) {
  return (
    <div
      className="stat"
      style={{
        '--accent': accent,
        padding: 22,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 130,
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: accent,
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: accent,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 6px 16px ${accent}40`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: '#8E8E93',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '-0.8px',
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: 14,
              color: '#8E8E93',
              fontWeight: 500,
              marginLeft: 4,
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Analytics() {
  const total = MOCK_COMPANIES.reduce((s, c) => s + c.wasteTotal, 0);

  const byType = WASTE_TYPES.slice(0, 6).map((t, i) => ({
    name: t,
    value: [1250, 890, 640, 420, 320, 180][i] || 100,
  }));
  const maxVal = Math.max(...byType.map((x) => x.value));

  return (
    <Layout
      title="Analitika"
      subtitle="Respublika bo‘yicha tahlil · 2026"
    >
      {/* ===== Stat kartochkalar ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        <StatCardFixed
          label="Jami chiqindi"
          value={total.toLocaleString()}
          unit="t"
          Icon={Recycle}
          accent="#007AFF"
        />
        <StatCardFixed
          label="Faol korxonalar"
          value="11 953"
          Icon={Building2}
          accent="#34C759"
        />
        <StatCardFixed
          label="O‘rtacha/korxona"
          value="6.6"
          unit="t"
          Icon={TrendingUp}
          accent="#AF52DE"
        />
        <StatCardFixed
          label="Muddati o‘tgan"
          value="892"
          Icon={AlertTriangle}
          accent="#FF3B30"
        />
      </div>

      {/* ===== Grafiklar ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 18,
        }}
      >
        <Card style={{ padding: 24 }}>
          <div className="card-title">Chiqindi turlari bo‘yicha</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {byType.map((t) => (
              <div key={t.name}>
                <div
                  className="between"
                  style={{ marginBottom: 8 }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>
                    {t.name}
                  </span>
                  <b className="mono" style={{ fontSize: 13 }}>
                    {t.value} t
                  </b>
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'var(--ios-gray5)',
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(t.value / maxVal) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg,#007AFF,#AF52DE)',
                      borderRadius: 20,
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div className="card-title">Xavflilik sinflari</div>
          {[
            { cls: 'I', color: '#FF3B30', pct: 12 },
            { cls: 'II', color: '#FF9500', pct: 28 },
            { cls: 'III', color: '#FFCC00', pct: 34 },
            { cls: 'IV', color: '#007AFF', pct: 18 },
            { cls: 'V', color: '#34C759', pct: 8 },
          ].map((s) => (
            <div key={s.cls} style={{ marginBottom: 16 }}>
              <div className="between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>
                  Sinf {s.cls}
                </span>
                <b className="mono" style={{ fontSize: 13 }}>
                  {s.pct}%
                </b>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'var(--ios-gray5)',
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${s.pct}%`,
                    height: '100%',
                    background: s.color,
                    borderRadius: 20,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Layout>
  );
}