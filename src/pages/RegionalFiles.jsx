import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Button, Badge, Modal } from '../components/UI.jsx';
import FileViewer from '../components/FileViewer.jsx';
import Icon from '../components/Icons.jsx';
import {
  Eye, CheckCircle2, RotateCcw, Clock, AlertTriangle,
  Building2, MapPin, Search,
} from 'lucide-react';
import {
  listFiles, updateFileMeta, appendHistory,
} from '../utils/fileStore.js';
import { pushNotification } from '../utils/notify.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { FILE_STATUS } from '../data/mockData.js';

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'hozir';
  if (diff < 3600) return Math.floor(diff / 60) + ' daq oldin';
  if (diff < 86400) return Math.floor(diff / 3600) + ' soat oldin';
  return new Date(iso).toLocaleDateString('uz-UZ');
}

export default function RegionalFiles() {
  const { user } = useAuth();
  const confirm = useConfirm();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDoc, setOpenDoc] = useState(null);
  const [returning, setReturning] = useState(null);
  const [reason, setReason] = useState('');
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const all = await listFiles();
    const inRegion = all
      .filter((f) => f.region === user.region && f.status !== 'draft')
      .sort((a, b) =>
        (b.submittedAt || '').localeCompare(a.submittedAt || '')
      );
    setFiles(inRegion);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [user.region]);

  // ===== Tasdiqlash =====
  const approveFile = async (doc) => {
    const ok = await confirm({
      title: 'Faylni tasdiqlash',
      text: `"${doc.name}" faylini tasdiqlashni xohlaysizmi? Korxona xodimiga bildirishnoma yuboriladi.`,
      confirmText: 'Tasdiqlash',
      cancelText: 'Bekor',
      variant: 'success',
    });
    if (!ok) return;

    const now = new Date().toISOString();
    await updateFileMeta(doc.id, {
      status: 'approved',
      reviewedAt: now,
      reviewedBy: user.id,
      reviewedByName: user.name,
      returnReason: null,
    });
    await appendHistory(doc.id, {
      action: 'approved',
      by: user.id,
      byName: user.name,
      at: now,
    });

    pushNotification({
      toUserId: doc.uploaderId,
      fromUserId: user.id,
      fromName: user.name,
      type: 'approved',
      title: 'Faylingiz tasdiqlandi ✅',
      text: `"${doc.name}" fayli mintaqaviy boshqarma tomonidan tasdiqlandi.`,
      relatedFileId: doc.id,
    });

    load();
  };

  // ===== Qaytarish =====
  const doReturn = async () => {
    if (!returning) return;
    const r = reason.trim();

    if (!r) {
      await confirm({
        title: 'Sabab kiritilmagan',
        text: 'Iltimos, qaytarish sababini kiriting.',
        confirmText: 'Tushunarli',
        hideCancel: true,
        variant: 'warning',
      });
      return;
    }

    const now = new Date().toISOString();
    await updateFileMeta(returning.id, {
      status: 'returned',
      reviewedAt: now,
      reviewedBy: user.id,
      reviewedByName: user.name,
      returnReason: r,
    });
    await appendHistory(returning.id, {
      action: 'returned',
      by: user.id,
      byName: user.name,
      at: now,
      reason: r,
    });

    pushNotification({
      toUserId: returning.uploaderId,
      fromUserId: user.id,
      fromName: user.name,
      type: 'returned',
      title: 'Fayl qaytarildi ⚠️',
      text: `"${returning.name}" fayli qaytarildi. Sabab: ${r}`,
      relatedFileId: returning.id,
    });

    setReturning(null);
    setReason('');
    load();
  };

  // ===== Filtr + qidiruv =====
  const filtered = useMemo(() => {
    let list = files;
    if (filter === 'pending') list = list.filter((f) => f.status === 'submitted');
    if (filter === 'approved') list = list.filter((f) => f.status === 'approved');
    if (filter === 'returned') list = list.filter((f) => f.status === 'returned');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.company || '').toLowerCase().includes(q) ||
          (f.uploaderName || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [files, filter, search]);

  const counts = useMemo(
    () => ({
      pending: files.filter((f) => f.status === 'submitted').length,
      approved: files.filter((f) => f.status === 'approved').length,
      returned: files.filter((f) => f.status === 'returned').length,
      total: files.length,
    }),
    [files]
  );

  return (
    <Layout
      title="Kelgan fayllar"
      subtitle={`${user.region} · ${counts.pending} ta tekshiruvda`}
    >
      {/* Stat kartochkalar */}
      <div className="grid grid-4 mb-4">
        <div className="stat" style={{ '--accent': '#007AFF' }}>
          <div className="stat-icon" style={{ background: '#007AFF' }}>
            <Icon name="paperclip" size={20} />
          </div>
          <div className="stat-label">Jami yuborilgan</div>
          <div className="stat-value mono">{counts.total}</div>
        </div>
        <div className="stat" style={{ '--accent': '#FF9500' }}>
          <div className="stat-icon" style={{ background: '#FF9500' }}>
            <Clock size={20} />
          </div>
          <div className="stat-label">Tekshiruvda</div>
          <div className="stat-value mono">{counts.pending}</div>
        </div>
        <div className="stat" style={{ '--accent': '#34C759' }}>
          <div className="stat-icon" style={{ background: '#34C759' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-label">Tasdiqlangan</div>
          <div className="stat-value mono">{counts.approved}</div>
        </div>
        <div className="stat" style={{ '--accent': '#FF3B30' }}>
          <div className="stat-icon" style={{ background: '#FF3B30' }}>
            <RotateCcw size={20} />
          </div>
          <div className="stat-label">Qaytarilgan</div>
          <div className="stat-value mono">{counts.returned}</div>
        </div>
      </div>

      {/* Filterlar + qidiruv */}
      <div className="between mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { v: 'pending', l: `Tekshiruvda (${counts.pending})` },
            { v: 'approved', l: `Tasdiqlangan (${counts.approved})` },
            { v: 'returned', l: `Qaytarilgan (${counts.returned})` },
            { v: 'all', l: 'Barchasi' },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className="btn btn-sm"
              style={{
                background: filter === f.v ? 'var(--ios-blue)' : 'var(--ios-gray6)',
                color: filter === f.v ? '#fff' : 'var(--ios-text2)',
              }}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 220, flex: '1 1 220px', maxWidth: 320 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ios-gray)',
            }}
          />
          <input
            className="input"
            placeholder="Fayl yoki korxona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {loading && (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>
          Yuklanmoqda...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <Icon name="inbox" size={48} strokeWidth={1.5} />
          </div>
          <b>Fayllar yo‘q</b>
          <div>
            {filter === 'pending'
              ? 'Hozircha tekshirish uchun fayl kelmagan'
              : 'Bu bo‘limda fayllar mavjud emas'}
          </div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="list">
          {filtered.map((d) => {
            const st = FILE_STATUS[d.status] || FILE_STATUS.draft;
            const iconBg =
              st.color === 'green'
                ? 'rgba(52,199,89,0.12)'
                : st.color === 'red'
                ? 'rgba(255,59,48,0.12)'
                : 'rgba(0,122,255,0.1)';
            const iconColor =
              st.color === 'green'
                ? '#34C759'
                : st.color === 'red'
                ? '#FF3B30'
                : '#007AFF';

            return (
              <div
                key={d.id}
                className="list-item"
                style={{ flexWrap: 'wrap' }}
              >
                <div
                  className="list-icon"
                  style={{ background: iconBg, color: iconColor }}
                >
                  <Icon name={FILE_STATUS[d.status]?.icon || 'file'} size={20} />
                </div>

                <div className="list-body" onClick={() => setOpenDoc(d)}>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <b>{d.name}</b>
                    <Badge color={st.color}>{st.label}</Badge>
                  </div>
                  <div
                    className="row"
                    style={{ gap: 12, marginTop: 4, flexWrap: 'wrap' }}
                  >
                    <span
                      style={{
                        fontSize: 12.5,
                        color: 'var(--ios-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Building2 size={12} /> {d.company}
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: 'var(--ios-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <MapPin size={12} /> {d.region}
                    </span>
                    <span style={{ fontSize: 12.5, color: 'var(--ios-gray)' }}>
                      {d.sizeText || formatSize(d.size)}
                    </span>
                    {d.submittedAt && (
                      <span style={{ fontSize: 12.5, color: 'var(--ios-gray)' }}>
                        Yuborilgan: {timeAgo(d.submittedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="row" style={{ gap: 4 }}>
                  <button
                    className="icon-btn"
                    onClick={() => setOpenDoc(d)}
                    title="Ko‘rish"
                  >
                    <Eye size={16} />
                  </button>
                  {d.status === 'submitted' && (
                    <>
                      <button
                        className="icon-btn"
                        onClick={() => approveFile(d)}
                        title="Tasdiqlash"
                        style={{
                          background: 'rgba(52,199,89,0.12)',
                          color: '#34C759',
                        }}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setReturning(d)}
                        title="Qaytarish"
                        style={{
                          background: 'rgba(255,59,48,0.12)',
                          color: '#FF3B30',
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Fayl ko'ruvchi ===== */}
      {openDoc && (
        <FileViewer
          file={openDoc}
          onClose={() => {
            setOpenDoc(null);
            load();
          }}
        />
      )}

      {/* ===== Qaytarish modali ===== */}
      {returning && (
        <Modal
          title="Faylni qaytarish"
          subtitle={`${returning.company} · ${returning.name}`}
          onClose={() => {
            setReturning(null);
            setReason('');
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setReturning(null);
                  setReason('');
                }}
              >
                Bekor
              </Button>
              <Button variant="danger" onClick={doReturn}>
                <RotateCcw size={14} /> Qaytarish
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                padding: 12,
                background: '#FFF4E5',
                border: '1px solid #FFD9A0',
                borderRadius: 10,
                fontSize: 13,
                color: '#8A5C00',
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                Faylni qaytarsangiz, korxona xodimi sababni ko‘radi va
                bildirishnoma oladi.
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--ios-gray)',
                  marginBottom: 6,
                }}
              >
                Qaytarish sababi *
              </label>
              <textarea
                className="input"
                rows={5}
                autoFocus
                placeholder="Masalan: Qayta ishlangan miqdor noto‘g‘ri ko‘rsatilgan. Iltimos, dalolatnoma bilan solishtiring va qayta yuboring."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
              <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>
                Kamida 10 ta belgi kiriting. Sabab korxona xodimiga yuboriladi.
              </div>
            </div>

            {/* Tez tanlash uchun tayyor sabablar */}
            <div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
                Tez tanlash:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'Miqdor noto‘g‘ri ko‘rsatilgan',
                  'Dalolatnoma biriktirilmagan',
                  'Laboratoriya xulosasi yo‘q',
                  'Imzo va muhr mavjud emas',
                  'Fayl formati noto‘g‘ri',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReason(s)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: 12 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}