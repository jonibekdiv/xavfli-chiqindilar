import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, StatCard, Badge, Progress } from '../components/UI.jsx';
import { STATUS_LABELS } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../utils/permissions.js';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [wastes, setWastes] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setWastes(JSON.parse(localStorage.getItem('crm_wastes') || '[]'));
    setReports(JSON.parse(localStorage.getItem('crm_quarterly') || '[]'));
  }, []);

  const submitted = reports.filter((r) =>
    ['accepted', 'approved', 'under_review'].includes(r.status)
  ).length;
  const returned = reports.filter((r) => r.status === 'returned').length;

  return (
    <Layout
      title={`Salom, "${user.organization || user.name}" 👋`}
      subtitle="Korxona kabineti · 2026-yil"
    >
      <div className="grid grid-4 mb-4">
        <StatCard
          label="Chiqindi turlari"
          value={wastes.length}
          icon="recycle"
          accent="#007AFF"
        />
        <StatCard
          label="Hujjatlar"
          value={4}
          icon="paperclip"
          accent="#AF52DE"
        />
        <StatCard
          label="Topshirilgan hisobot"
          value={submitted}
          icon="clipboard"
          accent="#34C759"
        />
        <StatCard
          label="Qaytarilgan"
          value={returned}
          icon="return"
          accent="#FF3B30"
        />
      </div>

      <div className="grid grid-2">
        <Card>
          <div className="between mb-3">
            <div className="card-title" style={{ margin: 0 }}>
              Hisobotlar holati · 2026
            </div>
            <Badge color="blue">4 chorak</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3, 4].map((q) => {
              const r = reports.find((x) => x.quarter === q);
              const st = r ? STATUS_LABELS[r.status] : STATUS_LABELS.pending;
              return (
                <div key={q} className="between">
                  <div className="row">
                    <div
                      className="list-icon"
                      style={{ background: 'var(--ios-gray6)' }}
                    >
                      Q{q}
                    </div>
                    <div>
                      <b style={{ fontSize: 14 }}>Chorak {q}</b>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {r ? r.submittedAt || '—' : 'Topshirilmagan'}
                      </div>
                    </div>
                  </div>
                  <Badge color={st.color}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="card-title">Yillik bajarilish</div>
          <div style={{ marginBottom: 12 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="muted">Choraklik hisobotlar</span>
              <b className="mono">{submitted}/4</b>
            </div>
            <Progress value={(submitted / 4) * 100} />
          </div>

          {/* RBAC: Faqat "report.submit" ruxsati bo'lsa ko'rsatiladi */}
          {can(user, 'report.submit') && (
            <div
              className="mt-4"
              style={{
                padding: 14,
                background: 'rgba(0,122,255,0.06)',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                ℹ Siz hisobot topshirishingiz mumkin
              </div>
              <div className="muted" style={{ fontSize: 12.5 }}>
                Q4 hisobotini topshirish muddati — 2027-01-15.
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}