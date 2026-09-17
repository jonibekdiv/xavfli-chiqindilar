import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Button, Badge, Modal } from '../components/UI.jsx';
import FileViewer from '../components/FileViewer.jsx';
import Icon from '../components/Icons.jsx';
import {
  Upload, Trash2, Eye, Send, RotateCcw, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import {
  saveFile, listFiles, deleteFile, updateFileMeta, appendHistory,
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

function extBadge(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return { label: 'PDF', color: '#FF3B30' };
  if (['xlsx', 'xls', 'xlsm'].includes(ext)) return { label: 'XLS', color: '#34C759' };
  if (ext === 'csv') return { label: 'CSV', color: '#34C759' };
  if (['docx', 'doc'].includes(ext)) return { label: 'DOC', color: '#007AFF' };
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext))
    return { label: 'IMG', color: '#AF52DE' };
  if (['txt', 'md', 'log'].includes(ext)) return { label: 'TXT', color: '#8E8E93' };
  return { label: 'FILE', color: '#8E8E93' };
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'hozir';
  if (diff < 3600) return Math.floor(diff / 60) + ' daq oldin';
  if (diff < 86400) return Math.floor(diff / 3600) + ' soat oldin';
  return new Date(iso).toLocaleDateString('uz-UZ');
}

export default function Documents() {
  const { user } = useAuth();
  const confirm = useConfirm();

  const [docs, setDocs] = useState([]);
  const [openDoc, setOpenDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [returnInfo, setReturnInfo] = useState(null);
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const all = await listFiles();
    const mine = all
      .filter((f) => f.uploaderId === user.id || f.ownerId === user.id)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    setDocs(mine);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [user.id]);

  // ===== Fayl yuklash =====
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      const id = 'f' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      const now = new Date().toISOString();
      await saveFile({
        id,
        name: f.name,
        type: f.type || 'application/octet-stream',
        size: f.size,
        sizeText: formatSize(f.size),
        date: now.slice(0, 10),
        blob: f,
        uploaderId: user.id,
        uploaderName: user.name,
        company: user.organization || user.name,
        region: user.region,
        status: 'draft',
        submittedAt: null,
        reviewedAt: null,
        reviewedBy: null,
        reviewedByName: null,
        returnReason: null,
        history: [{ action: 'created', by: user.id, byName: user.name, at: now }],
      });
    }
    e.target.value = '';
    load();
  };

  // ===== Tasdiqlashga yuborish =====
  const submitForReview = async (doc) => {
    const ok = await confirm({
      title: 'Tasdiqlashga yuborish',
      text: `"${doc.name}" faylini mintaqaviy boshqarmaga tasdiqlashga yubormoqchimisiz?`,
      confirmText: 'Yuborish',
      cancelText: 'Bekor',
      variant: 'info',
    });
    if (!ok) return;

    const now = new Date().toISOString();
    await updateFileMeta(doc.id, {
      status: 'submitted',
      submittedAt: now,
      returnReason: null,
    });
    await appendHistory(doc.id, {
      action: 'submitted',
      by: user.id,
      byName: user.name,
      at: now,
    });
    pushNotification({
      toUserId: 'u2',
      fromUserId: user.id,
      fromName: user.name,
      type: 'submitted',
      title: 'Yangi fayl tasdiqlashga yuborildi',
      text: `${user.organization || user.name} "${doc.name}" faylini tasdiqlashga yubordi.`,
      relatedFileId: doc.id,
    });
    load();
  };

  // ===== O‘chirish (sabab bilan) =====
  const doDelete = async () => {
    if (!confirmDelete) return;
    const reason = deleteReason.trim();

    if (!reason) {
      await confirm({
        title: 'Sabab kiritilmagan',
        text: 'Iltimos, o‘chirish sababini kiriting.',
        confirmText: 'Tushunarli',
        hideCancel: true,
        variant: 'warning',
      });
      return;
    }

    const ok = await confirm({
      title: 'Faylni o‘chirish',
      text: `"${confirmDelete.name}" faylini butunlay o‘chirmoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.`,
      confirmText: 'O‘chirish',
      cancelText: 'Bekor',
      variant: 'danger',
    });
    if (!ok) return;

    await deleteFile(confirmDelete.id);

    if (
      confirmDelete.status === 'submitted' ||
      confirmDelete.status === 'approved'
    ) {
      pushNotification({
        toUserId: 'u2',
        fromUserId: user.id,
        fromName: user.name,
        type: 'warning',
        title: 'Fayl o‘chirildi',
        text: `${user.organization || user.name} "${confirmDelete.name}" faylini o‘chirdi. Sabab: ${reason}`,
        relatedFileId: confirmDelete.id,
      });
    }

    setConfirmDelete(null);
    setDeleteReason('');
    load();
  };

  // ===== Filtrlash =====
  const filtered = useMemo(() => {
    if (filter === 'all') return docs;
    return docs.filter((d) => d.status === filter);
  }, [docs, filter]);

  const returnedCount = docs.filter((d) => d.status === 'returned').length;

  return (
    <Layout
      title="Hujjatlar"
      subtitle={`${docs.length} ta fayl${
        returnedCount ? ` · ${returnedCount} ta qaytarilgan` : ''
      }`}
      actions={
        <>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
            accept=".pdf,.xlsx,.xls,.xlsm,.csv,.docx,.doc,.txt,.md,.log,.png,.jpg,.jpeg,.gif,.webp,.svg"
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} /> Fayl yuklash
          </Button>
        </>
      }
    >
      {/* Qaytarilgan fayllar bo'yicha ogohlantirish */}
      {returnedCount > 0 && (
        <div
          className="alert-warning mb-3"
          style={{
            padding: 14,
            background: '#FFF4E5',
            border: '1px solid #FFD9A0',
            borderRadius: 12,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <AlertTriangle size={20} color="#B36B00" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <b style={{ color: '#B36B00' }}>
              {returnedCount} ta fayl qaytarilgan
            </b>
            <div style={{ fontSize: 13, color: '#8A5C00', marginTop: 2 }}>
              Mintaqaviy boshqarma tomonidan qaytarilgan fayllar mavjud.
              Sabablarni ko‘rib chiqing.
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setFilter('returned')}>
            Ko‘rish
          </Button>
        </div>
      )}

      {/* Filter */}
      <div className="mb-3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { v: 'all', l: 'Barchasi' },
          { v: 'draft', l: 'Qoralama' },
          { v: 'submitted', l: 'Tekshiruvda' },
          { v: 'returned', l: 'Qaytarilgan' },
          { v: 'approved', l: 'Tasdiqlangan' },
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

      {loading && (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>
          Yuklanmoqda...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <Icon name="paperclip" size={48} strokeWidth={1.5} />
          </div>
          <b>Fayllar yo‘q</b>
          <div>“Fayl yuklash” tugmasi orqali hujjat qo‘shing</div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="list">
          {filtered.map((d) => {
            const { label, color } = extBadge(d.name);
            const st = FILE_STATUS[d.status] || FILE_STATUS.draft;
            const canSubmit = d.status === 'draft' || d.status === 'returned';
            const isReturned = d.status === 'returned';

            return (
              <div
                key={d.id}
                className="list-item"
                style={{
                  flexWrap: 'wrap',
                  borderLeft: isReturned ? '4px solid #FF3B30' : 'none',
                }}
              >
                <div
                  className="list-icon"
                  style={{
                    background: `${color}18`,
                    color,
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {label}
                </div>

                <div className="list-body" onClick={() => setOpenDoc(d)}>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <b>{d.name}</b>
                    <Badge color={st.color}>{st.label}</Badge>
                  </div>
                  <span>
                    {d.sizeText || formatSize(d.size)} · {d.date}
                    {d.submittedAt && ` · Yuborilgan: ${timeAgo(d.submittedAt)}`}
                  </span>

                  {isReturned && d.returnReason && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setReturnInfo(d);
                      }}
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        background: '#FFEBEA',
                        border: '1px solid #FFC9C4',
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: '#B22',
                        cursor: 'pointer',
                      }}
                    >
                      <b>↩ Qaytarilgan.</b> Sabab: {d.returnReason.slice(0, 80)}
                      {d.returnReason.length > 80 ? '…' : ''}
                      <div
                        style={{
                          fontSize: 11,
                          marginTop: 3,
                          color: '#8A5C5C',
                        }}
                      >
                        Batafsil ko‘rish uchun bosing →
                      </div>
                    </div>
                  )}

                  {d.status === 'approved' && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12.5,
                        color: '#1F8A3F',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <CheckCircle2 size={14} />
                      Tasdiqlangan · {d.reviewedByName || 'Mintaqaviy boshqarma'}
                      {d.reviewedAt && ` · ${timeAgo(d.reviewedAt)}`}
                    </div>
                  )}
                </div>

                <div className="row" style={{ gap: 4 }}>
                  {canSubmit && (
                    <button
                      className="icon-btn"
                      onClick={() => submitForReview(d)}
                      title="Tasdiqlashga yuborish"
                      style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
                    >
                      <Send size={15} />
                    </button>
                  )}
                  <button
                    className="icon-btn"
                    onClick={() => setOpenDoc(d)}
                    title="Ko‘rish / tahrirlash"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setConfirmDelete(d)}
                    title="O‘chirish"
                  >
                    <Trash2 size={16} />
                  </button>
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

      {/* ===== Qaytarilgan fayl haqida modal ===== */}
      {returnInfo && (
        <Modal
          title="Qaytarilgan fayl"
          subtitle={returnInfo.name}
          onClose={() => setReturnInfo(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setReturnInfo(null)}>
                Yopish
              </Button>
              <Button
                onClick={() => {
                  const doc = returnInfo;
                  setReturnInfo(null);
                  submitForReview(doc);
                }}
              >
                <Send size={14} /> Qayta yuborish
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                padding: 14,
                background: '#FFEBEA',
                border: '1px solid #FFC9C4',
                borderRadius: 12,
              }}
            >
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <RotateCcw size={16} color="#B22" />
                <b style={{ color: '#B22' }}>Qaytarish sababi</b>
              </div>
              <div style={{ fontSize: 14, color: '#5A2020', lineHeight: 1.5 }}>
                {returnInfo.returnReason}
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                Qaytargan xodim
              </div>
              <b>{returnInfo.reviewedByName || 'Mintaqaviy boshqarma xodimi'}</b>
              {returnInfo.reviewedAt && (
                <div className="muted" style={{ fontSize: 12 }}>
                  {new Date(returnInfo.reviewedAt).toLocaleString('uz-UZ')}
                </div>
              )}
            </div>

            {Array.isArray(returnInfo.history) && returnInfo.history.length > 0 && (
              <div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                  Tarix
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {returnInfo.history.map((h, i) => (
                    <div
                      key={i}
                      className="row"
                      style={{ alignItems: 'flex-start', gap: 10 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background:
                            h.action === 'returned' ? '#FF3B30' : '#007AFF',
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <b style={{ fontSize: 13 }}>
                          {{
                            created: 'Yaratildi',
                            submitted: 'Tasdiqlashga yuborildi',
                            returned: 'Qaytarildi',
                            approved: 'Tasdiqlandi',
                            resubmitted: 'Qayta yuborildi',
                          }[h.action] || h.action}
                        </b>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {h.byName} · {new Date(h.at).toLocaleString('uz-UZ')}
                        </div>
                        {h.reason && (
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12.5,
                              color: '#B22',
                              padding: '4px 8px',
                              background: '#FFEBEA',
                              borderRadius: 6,
                            }}
                          >
                            {h.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ===== O'chirish modali ===== */}
      {confirmDelete && (
        <Modal
          title="Faylni o‘chirish"
          subtitle={confirmDelete.name}
          onClose={() => {
            setConfirmDelete(null);
            setDeleteReason('');
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteReason('');
                }}
              >
                Bekor
              </Button>
              <Button variant="danger" onClick={doDelete}>
                <Trash2 size={14} /> O‘chirish
              </Button>
            </>
          }
        >
          <div
            style={{
              fontSize: 14,
              color: 'var(--ios-text2)',
              marginBottom: 12,
            }}
          >
            Bu amalni ortga qaytarib bo‘lmaydi. Iltimos, o‘chirish sababini
            kiriting — mintaqaviy boshqarma xabardor qilinadi.
          </div>
          <div className="field">
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ios-gray)',
                marginBottom: 6,
              }}
            >
              O‘chirish sababi *
            </label>
            <textarea
              className="input"
              rows={3}
              placeholder="Masalan: Xato yuklangan, qayta yuklayman"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </Modal>
      )}
    </Layout>
  );
}