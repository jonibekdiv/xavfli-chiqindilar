import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Badge } from '../components/UI.jsx';
import { STATUS_LABELS } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';
import ClockWidget from '../components/ClockWidget.jsx';

import {
  Recycle, Paperclip, ClipboardList, RotateCcw, ArrowRight,
  Calendar, FileText, Bell, ChevronDown, Sparkles, TrendingUp,
} from 'lucide-react';

function HeroCard({ userName, today }) {
  return (
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
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: '0 0 8px',
            color: '#1A1A1A',
          }}
        >
          Salom, {userName}! 👋
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
          Bugungi kunda tizim orqali barcha jarayonlarni oson va qulay
          boshqaring.
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
          <Calendar size={14} />
          {today}
        </div>
      </div>
{/* O'ng tomon — soat */}
<ClockWidget />
    </div>
  );
}

function StatCard({ label, value, subtext, IconCmp, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        minHeight: 130,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: `${accent}18`,
            color: accent,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ArrowRight size={14} />
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#8E8E93',
          letterSpacing: '0.2px',
          marginTop: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1,
          color: '#1A1A1A',
        }}
      >
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: 11.5, color: '#8E8E93' }}>{subtext}</div>
      )}
    </div>
  );
}

function ActionCard({ IconCmp, color, title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: `${color}18`,
          color,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <IconCmp size={20} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: 2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12, color: '#8E8E93' }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [wastes, setWastes] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    try {
      setWastes(JSON.parse(localStorage.getItem('crm_wastes') || '[]'));
      setReports(JSON.parse(localStorage.getItem('crm_quarterly') || '[]'));
    } catch {
      setWastes([]);
      setReports([]);
    }
  }, []);

  const submitted = reports.filter((r) =>
    ['accepted', 'approved', 'under_review'].includes(r.status)
  ).length;
  const returned = reports.filter((r) => r.status === 'returned').length;

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
    <Layout title="Dashboard" subtitle="Korxona kabineti · 2026-yil">
      <HeroCard
        userName={user.organization || user.name}
        today={today}
      />

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="CHIQINDI TURLARI"
          value={wastes.length}
          subtext="Jami turdagi chiqindilar"
          IconCmp={Recycle}
          accent="#007AFF"
          onClick={() => nav('/wastes')}
        />
        <StatCard
          label="HUJJATLAR"
          value={4}
          subtext="Jami hujjatlar"
          IconCmp={Paperclip}
          accent="#AF52DE"
          onClick={() => nav('/documents')}
        />
        <StatCard
          label="TOPSHIRILGAN HISOBOT"
          value={submitted}
          subtext="Jami hisobotlar"
          IconCmp={ClipboardList}
          accent="#34C759"
          onClick={() => nav('/quarterly')}
        />
        <StatCard
          label="QAYTARILGAN"
          value={returned}
          subtext="Qaytarilgan hisobotlar"
          IconCmp={RotateCcw}
          accent="#FF3B30"
          onClick={() => nav('/quarterly')}
        />
      </div>

      {/* 2 ta katta panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          marginBottom: 18,
        }}
      >
        {/* Hisobotlar holati */}
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
              justifyContent: 'space-between',
              alignItems: 'center',
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
                <FileText size={16} />
              </div>
              <b style={{ fontSize: 15 }}>Hisobotlar holati · 2026</b>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                background: 'rgba(0,122,255,0.1)',
                color: '#007AFF',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              4 chorak
              <ChevronDown size={12} />
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3, 4].map((q) => {
              const r = reports.find((x) => x.quarter === q);
              const st = r
                ? STATUS_LABELS[r.status] || STATUS_LABELS.pending
                : STATUS_LABELS.pending;
              const colors = ['#007AFF', '#34C759', '#FF9500', '#8E8E93'];
              const bgColors = [
                'rgba(0,122,255,0.12)',
                'rgba(52,199,89,0.12)',
                'rgba(255,149,0,0.12)',
                'rgba(142,142,147,0.12)',
              ];
              return (
                <div
                  key={q}
                  onClick={() => nav('/quarterly')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#FAFAFC')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: bgColors[q - 1],
                      color: colors[q - 1],
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    Q{q}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      Chorak {q}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: '#8E8E93',
                        marginTop: 2,
                      }}
                    >
                      {r ? r.submittedAt || '—' : 'Topshirilmagan'}
                    </div>
                  </div>
                  <Badge color={st.color}>{st.label}</Badge>
                  <ArrowRight size={14} color="#C7C7CC" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Yillik bajarilish */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
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
            <b style={{ fontSize: 15 }}>Yillik bajarilishi</b>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: '#5A6170' }}>
                Choraklik hisobotlar
              </span>
              <b style={{ fontSize: 16 }}>{submitted}/4</b>
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
                  width: `${(submitted / 4) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #007AFF, #5AC8FA)',
                  borderRadius: 20,
                  transition: 'width 0.5s',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: 14,
              background: 'rgba(0,122,255,0.06)',
              border: '1px solid rgba(0,122,255,0.12)',
              borderRadius: 12,
              fontSize: 13,
              lineHeight: 1.5,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <Sparkles size={16} color="#007AFF" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <b style={{ color: '#007AFF', display: 'block', marginBottom: 2 }}>
                Siz hisobot topshirishingiz mumkin
              </b>
              <span style={{ color: '#5A6170', fontSize: 12.5 }}>
                Q4 hisobotini topshirish muddati — 2027-01-15.
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <div
              style={{
                padding: 12,
                background: '#FAFAFC',
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 11.5, color: '#8E8E93', marginBottom: 4 }}>
                Faol chiqindilar
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {wastes.filter((w) => w.status === 'Faol').length}
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: '#FAFAFC',
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 11.5, color: '#8E8E93', marginBottom: 4 }}>
                Qaytarilgan
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: returned > 0 ? '#FF3B30' : 'inherit',
                }}
              >
                {returned}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tezkor amallar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <ActionCard
          IconCmp={FileText}
          color="#007AFF"
          title="Yangi hisobot"
          subtitle="Hisobot yaratish"
          onClick={() => nav('/quarterly')}
        />
        <ActionCard
          IconCmp={Paperclip}
          color="#AF52DE"
          title="Hujjat qo‘shish"
          subtitle="Fayl yuklash"
          onClick={() => nav('/documents')}
        />
        <ActionCard
          IconCmp={Recycle}
          color="#34C759"
          title="Chiqindilar"
          subtitle="Ma’lumotlar kiritish"
          onClick={() => nav('/wastes')}
        />
        <ActionCard
          IconCmp={Bell}
          color="#FF9500"
          title="Bildirishnoma"
          subtitle="Yangiliklar"
          onClick={() => nav('/notifications')}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 4px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: 11.5,
          color: '#8E8E93',
        }}
      >
        <div>
          © 2026 Xavfli chiqindilarni boshqarish direksiyasi. Barcha huquqlar
          himoyalangan.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Yordam</span>
          <span style={{ color: '#D1D1D6' }}>|</span>
          <span>Maxfiylik</span>
          <span style={{ color: '#D1D1D6' }}>|</span>
          <span>Sozlamalar</span>
        </div>
      </div>
    </Layout>
  );
}