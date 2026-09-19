import { useMemo } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge } from '../components/UI.jsx';
import ClockWidget from '../components/ClockWidget.jsx';
import { MOCK_COMPANIES, REGIONS } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Building2, Recycle, Send, AlertTriangle, TrendingUp, MapPin, BarChart3,
} from 'lucide-react';

function StatCard({ label, value, unit, IconCmp, accent }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: 130,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: accent,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 4px 12px ${accent}40`,
        }}
      >
        <IconCmp size={20} strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#8E8E93' }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
        {value}
        {unit && (
          <span style={{ fontSize: 14, color: '#8E8E93', marginLeft: 4 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DirectorateDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const totalWaste = MOCK_COMPANIES.reduce((s, c) => s + c.wasteTotal, 0);
    const submitted = MOCK_COMPANIES.reduce((s, c) => s + c.reportsSubmitted, 0);
    const total = MOCK_COMPANIES.reduce((s, c) => s + c.reportsTotal, 0);
    return { totalWaste, submitted, total };
  }, []);

  const regionStats = useMemo(
    () =>
      REGIONS.slice(0, 8).map((r, i) => ({
        name: r,
        value: [420, 380, 310, 260, 220, 190, 150, 110][i] || 80,
      })),
    []
  );
  const maxVal = Math.max(...regionStats.map((r) => r.value), 1);

  const now = new Date();
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ];
  const days = [
    'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
    'Payshanba', 'Juma', 'Shanba',
  ];
  const today = `${now.getFullYear()}-yil, ${now.getDate()}-${
    months[now.getMonth()]
  }, ${days[now.getDay()]}`;

  return (
    <Layout
      title="Dashboard"
      subtitle="O‘zbekiston Respublikasi · Direksiya markazi"
    >
      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO CARD — yangilangan (ClockWidget bilan) */}
      {/* ═══════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #E8F1FF 0%, #F5F0FF 100%)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 18,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>
            Salom, {user.name}! 👋
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#5A6170',
              margin: '0 0 14px',
              lineHeight: 1.5,
              maxWidth: 480,
            }}
          >
            Respublika bo‘yicha barcha korxonalar, hududlar va hisobotlar
            statistikasi.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.75)',
              borderRadius: 10,
              fontSize: 12.5,
              color: '#3C3C43',
              fontWeight: 500,
            }}
          >
            <BarChart3 size={14} />
            {today}
          </div>
        </div>

        <ClockWidget />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* STAT CARDS */}
      {/* ═══════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="JAMI KORXONALAR"
          value="12 845"
          IconCmp={Building2}
          accent="#007AFF"
        />
        <StatCard
          label="JAMI XAVFLI CHIQINDI"
          value="84 520"
          unit="t"
          IconCmp={Recycle}
          accent="#AF52DE"
        />
        <StatCard
          label="TOPSHIRILGAN HISOBOT"
          value="10 421"
          IconCmp={Send}
          accent="#34C759"
        />
        <StatCard
          label="MUDDATI O‘TGAN"
          value="892"
          IconCmp={AlertTriangle}
          accent="#FF3B30"
        />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 2 TA GRAFIK */}
      {/* ═══════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {/* Hududlar bo'yicha */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'rgba(0,122,255,0.12)',
                  color: '#007AFF',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <MapPin size={16} />
              </div>
              <b style={{ fontSize: 15 }}>Hududlar bo‘yicha chiqindi</b>
            </div>
            <Badge color="purple">tonna</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {regionStats.map((r) => (
              <div key={r.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13.5 }}>{r.name}</span>
                  <b style={{ fontSize: 13 }}>{r.value} t</b>
                </div>
                <div
                  style={{
                    height: 8,
                    background: '#E5E5EA',
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(r.value / maxVal) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #007AFF, #AF52DE)',
                      borderRadius: 20,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Umumiy hisobot holati */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(52,199,89,0.12)',
                color: '#34C759',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <TrendingUp size={16} />
            </div>
            <b style={{ fontSize: 15 }}>Umumiy hisobot holati</b>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{ color: '#5A6170' }}>Topshirilgan</span>
              <b>
                {stats.submitted} / {stats.total}
              </b>
            </div>
            <div
              style={{
                height: 8,
                background: '#E5E5EA',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(stats.submitted / stats.total) * 100}%`,
                  height: '100%',
                  background: '#34C759',
                  borderRadius: 20,
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{ color: '#5A6170' }}>Ko‘rib chiqilmoqda</span>
              <b>1 240</b>
            </div>
            <div
              style={{
                height: 8,
                background: '#E5E5EA',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  background: '#FF9500',
                  borderRadius: 20,
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{ color: '#5A6170' }}>Qaytarilgan</span>
              <b>328</b>
            </div>
            <div
              style={{
                height: 8,
                background: '#E5E5EA',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '18%',
                  height: '100%',
                  background: '#FF3B30',
                  borderRadius: 20,
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: '#FAFAFC',
              borderRadius: 12,
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            <b style={{ display: 'block', marginBottom: 4 }}>📊 Tahlil</b>
            <span style={{ color: '#5A6170' }}>
              Eng yuqori ko‘rsatkich — Toshkent shahri. Eng past — Sirdaryo
              viloyati.
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}