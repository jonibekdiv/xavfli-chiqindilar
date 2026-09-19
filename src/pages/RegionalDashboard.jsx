import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge } from '../components/UI.jsx';
import { MOCK_COMPANIES } from '../data/mockData.js';
import ClockWidget from '../components/ClockWidget.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Building2, Send, Clock, AlertTriangle, ArrowRight, MapPin,
  TrendingUp, Users, FileText,
} from 'lucide-react';

function StatCard({ label, value, subtext, IconCmp, accent }) {
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
      </div>
      {subtext && (
        <div style={{ fontSize: 11.5, color: '#8E8E93' }}>{subtext}</div>
      )}
    </div>
  );
}

export default function RegionalDashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    setCompanies(MOCK_COMPANIES || []);
  }, []);

  const stats = useMemo(() => {
    const total = companies.length;
    const submitted = companies.filter((c) => c.reportsSubmitted >= 3).length;
    const overdue = companies.filter((c) => c.status === 'overdue').length;
    const pending = total - submitted - overdue;
    return { total, submitted, overdue, pending };
  }, [companies]);

  const now = new Date();
  const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
  const days = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
  const today = `${now.getFullYear()}-yil, ${now.getDate()}-${months[now.getMonth()]}, ${days[now.getDay()]}`;

  const statusBadge = (s) => {
    const map = {
      active: ['green', 'Faol'],
      overdue: ['red', 'Muddati o‘tgan'],
      pending: ['orange', 'Kutilmoqda'],
    };
    return map[s] || ['gray', s];
  };

  return (
    <Layout title="Dashboard" subtitle={`${user.region || 'Hudud'} · Mintaqaviy boshqarma`}>
      {/* HERO */}
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
      {user.region} hududi bo‘yicha barcha korxonalar va hisobotlarni
      kuzatib boring.
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
      <MapPin size={14} />
      {today}
    </div>
  </div>

  <ClockWidget />
</div>

      {/* STATS */}
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
          value={stats.total}
          subtext={`${user.region} hududi`}
          IconCmp={Building2}
          accent="#007AFF"
        />
        <StatCard
          label="HISOBOT TOPSHIRGAN"
          value={stats.submitted}
          subtext="Faol korxonalar"
          IconCmp={Send}
          accent="#34C759"
        />
        <StatCard
          label="KUTILMOQDA"
          value={stats.pending}
          subtext="Topshirilmagan"
          IconCmp={Clock}
          accent="#FF9500"
        />
        <StatCard
          label="MUDDATI O‘TGAN"
          value={stats.overdue}
          subtext="E’tibor talab"
          IconCmp={AlertTriangle}
          accent="#FF3B30"
        />
      </div>

      {/* Korxonalar jadvali */}
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
              background: 'rgba(0,122,255,0.12)',
              color: '#007AFF',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Building2 size={16} />
          </div>
          <b style={{ fontSize: 15 }}>Korxonalar hisoboti</b>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={thStyle}>Korxona</th>
                <th style={thStyle}>STIR</th>
                <th style={thStyle}>Hudud</th>
                <th style={thStyle}>Chiqindi</th>
                <th style={thStyle}>Hisobot</th>
                <th style={thStyle}>Holat</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => {
                const [color, label] = statusBadge(c.status);
                const pct = c.reportsTotal ? (c.reportsSubmitted / c.reportsTotal) * 100 : 0;
                return (
                  <tr key={c.id}>
                    <td style={tdStyle}><b>{c.name}</b></td>
                    <td style={tdStyle}>{c.stir}</td>
                    <td style={tdStyle}>{c.district}</td>
                    <td style={tdStyle}>{c.wasteTotal} t</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#E5E5EA', borderRadius: 20, overflow: 'hidden', minWidth: 60 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#007AFF', borderRadius: 20 }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{c.reportsSubmitted}/{c.reportsTotal}</span>
                      </div>
                    </td>
                    <td style={tdStyle}><Badge color={color}>{label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 12,
  color: '#8E8E93',
  fontWeight: 600,
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(60,60,67,0.12)',
  background: '#FAFAFC',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: 14,
  borderBottom: '1px solid rgba(60,60,67,0.12)',
  whiteSpace: 'nowrap',
};