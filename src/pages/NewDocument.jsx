import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Button } from '../components/UI.jsx';
import RecipientsModal from '../components/RecipientsModal.jsx';
import {
  Plus, FileText, X, Paperclip, Users, Link as LinkIcon, Tag,
  ShieldCheck, FileSignature, QrCode, Layers,
} from 'lucide-react';
import { saveDoc, genDocNumber } from '../utils/docStore.js';
import { saveFile } from '../utils/fileStore.js';
import { recipientLabel } from '../data/orgUnits.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';

const DOC_TYPES = {
  kiruvchi: { label: 'Kiruvchi hujjat', color: '#007AFF', icon: '📥' },
  chiquvchi: { label: 'Chiquvchi hujjat', color: '#34C759', icon: '📤' },
  murojaat: { label: 'Murojaat', color: '#FF9500', icon: '📝' },
  ichki: { label: 'Ichki hujjat', color: '#AF52DE', icon: '📄' },
};

const JOURNALS = {
  kiruvchi: ['Kiruvchi hujjatlar jurnali', 'Murojaatlar jurnali'],
  chiquvchi: ['Chiquvchi hujjatlar jurnali', 'Xatlar jurnali'],
  murojaat: ['Fuqarolar murojaatlari jurnali', 'Tashkilotlar murojaatlari jurnali'],
  ichki: ['Ichki hujjatlar jurnali', 'Buyruqlar jurnali', 'Farmoyishlar jurnali'],
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--ios-gray)',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  marginBottom: 6,
};

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function Toggle({ label, checked, onChange, icon: Icon }) {
  return (
    <label
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 20,
          background: checked ? '#34C759' : 'var(--ios-gray4)',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 2,
            left: checked ? 20 : 2,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        />
      </div>
      {Icon && <Icon size={15} color="var(--ios-gray)" />}
      <span style={{ fontSize: 13.5, color: 'var(--ios-text2)' }}>{label}</span>
    </label>
  );
}

export default function NewDocument() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const confirm = useConfirm();

  const type = params.get('type') || 'ichki';
  const meta = DOC_TYPES[type] || DOC_TYPES.ichki;

  const [form, setForm] = useState({
    journal: JOURNALS[type]?.[0] || '',
    number: genDocNumber(type),
    summary: '',
    hashtags: [],
    hashtagInput: '',
    xdfu: false,
    qr: false,
    signature: false,
  });
  const [files, setFiles] = useState([]); // {id, name, size, sizeText, type}
  const [uploading, setUploading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [showRecipients, setShowRecipients] = useState(false);
  const fileRef = useRef(null);

  const changeType = (newType) => {
    setForm({
      ...form,
      journal: JOURNALS[newType]?.[0] || '',
      number: genDocNumber(newType),
    });
    nav(`/documents/new?type=${newType}`, { replace: true });
  };

  const addHashtag = () => {
    const t = form.hashtagInput.trim();
    if (!t) return;
    if (form.hashtags.includes(t)) return;
    setForm({ ...form, hashtags: [...form.hashtags, t], hashtagInput: '' });
  };

  const removeHashtag = (i) =>
    setForm({ ...form, hashtags: form.hashtags.filter((_, idx) => idx !== i) });

  // ===== FAYLLARNI YUKLASH =====
  // Fayllar IndexedDB'ga (fileStore) saqlanadi, hujjatda faqat metadata saqlanadi
  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    setUploading(true);

    const savedMeta = [];
    for (const file of picked) {
      const id = 'f' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      const now = new Date().toISOString();

      // 1) Faylning o'zini IndexedDB'ga saqlash (blob bilan)
      await saveFile({
        id,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        sizeText: formatSize(file.size),
        date: now.slice(0, 10),
        blob: file,
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

      // 2) Hujjatga faqat metadata biriktiramiz
      savedMeta.push({
        id,
        name: file.name,
        size: file.size,
        sizeText: formatSize(file.size),
        type: file.type,
      });
    }

    setFiles((prev) => [...prev, ...savedMeta]);
    setUploading(false);
    e.target.value = '';
  };

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const save = async (asDraft = false) => {
    if (!form.summary.trim()) {
      await confirm({
        title: 'Xatolik',
        text: 'Qisqacha mazmuni kiritilishi shart.',
        confirmText: 'Tushunarli',
        hideCancel: true,
        variant: 'warning',
      });
      return;
    }
    if (!asDraft && recipients.length === 0) {
      await confirm({
        title: 'Qabul qiluvchilar tanlanmagan',
        text: 'Iltimos, kamida bitta qabul qiluvchini tanlang.',
        confirmText: 'Tushunarli',
        hideCancel: true,
        variant: 'warning',
      });
      return;
    }

    const doc = {
      id: 'doc' + Date.now(),
      type,
      typeLabel: meta.label,
      journal: form.journal,
      number: form.number,
      summary: form.summary,
      hashtags: form.hashtags,
      xdfu: form.xdfu,
      qr: form.qr,
      signature: form.signature,
      files, // { id, name, size, sizeText, type }
      recipients,
      status: asDraft ? 'draft' : 'sent',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      createdByName: user.name,
      createdByOrg: user.organization || user.name,
      createdByRegion: user.region,
    };
    saveDoc(doc);

    await confirm({
      title: asDraft ? 'Qoralama saqlandi' : 'Hujjat yuborildi',
      text: asDraft
        ? `"${form.number}" raqamli hujjat qoralama sifatida saqlandi.`
        : `"${form.number}" raqamli hujjat ${recipients.length} ta qabul qiluvchiga yuborildi.`,
      confirmText: 'Yaxshi',
      hideCancel: true,
      variant: 'success',
    });

    nav('/documents');
  };

  return (
    <Layout
      title={`Yangi ${meta.label.toLowerCase()}`}
      subtitle="Hujjat ma’lumotlarini to‘ldiring"
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="row mb-4">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: `${meta.color}18`,
              color: meta.color,
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span>{meta.icon}</span>
            {meta.label}
          </div>
        </div>

        {/* Qator 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <label style={labelStyle}>Hujjat turi *</label>
            <select
              className="input"
              value={type}
              onChange={(e) => changeType(e.target.value)}
            >
              {Object.entries(DOC_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ro‘yxatga olish jurnali *</label>
            <select
              className="input"
              value={form.journal}
              onChange={(e) => setForm({ ...form, journal: e.target.value })}
            >
              {(JOURNALS[type] || []).map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Hujjat raqami</label>
            <input
              className="input"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </div>
        </div>

        {/* Qisqacha mazmuni */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Qisqacha mazmuni *</label>
          <textarea
            className="input"
            rows={4}
            placeholder="Hujjatning qisqacha mazmunini kiriting..."
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            style={{
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Hashtaglar */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Hujjat heshteglari</label>
          {form.hashtags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              {form.hashtags.map((t, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    background: 'rgba(0,122,255,0.1)',
                    color: '#007AFF',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Tag size={12} /> {t}
                  <button
                    onClick={() => removeHashtag(i)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#007AFF',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              placeholder="Heshteg qo‘shish..."
              value={form.hashtagInput}
              onChange={(e) =>
                setForm({ ...form, hashtagInput: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHashtag();
                }
              }}
            />
            <Button variant="secondary" onClick={addHashtag} type="button">
              <Plus size={15} /> Qo‘shish
            </Button>
          </div>
        </div>

        {/* Togglelar */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            padding: 16,
            background: 'var(--ios-gray6)',
            borderRadius: 14,
            marginBottom: 18,
          }}
        >
          <Toggle
            label="XDFU / DSP"
            checked={form.xdfu}
            onChange={(v) => setForm({ ...form, xdfu: v })}
            icon={Layers}
          />
          <Toggle
            label="QR kod yaratish"
            checked={form.qr}
            onChange={(v) => setForm({ ...form, qr: v })}
            icon={QrCode}
          />
          <Toggle
            label="Imzodan so‘ng kelishuvchilar"
            checked={form.signature}
            onChange={(v) => setForm({ ...form, signature: v })}
            icon={FileSignature}
          />
        </div>

        {/* Qabul qiluvchilar */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>
            Qabul qiluvchilar{' '}
            {recipients.length > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  padding: '2px 8px',
                  background: 'rgba(52,199,89,0.14)',
                  color: '#1F8A3F',
                  borderRadius: 10,
                  fontSize: 11,
                }}
              >
                {recipients.length} ta
              </span>
            )}
          </label>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 10,
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {recipients.length === 0 ? (
              <span className="muted" style={{ fontSize: 13 }}>
                Hech kim tanlanmagan
              </span>
            ) : (
              recipients.map((id) => (
                <span
                  key={id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    background: 'rgba(52,199,89,0.12)',
                    color: '#1F8A3F',
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: 500,
                  }}
                >
                  {recipientLabel(id)}
                  <button
                    onClick={() =>
                      setRecipients(recipients.filter((r) => r !== id))
                    }
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#1F8A3F',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => setShowRecipients(true)}
            type="button"
          >
            <Users size={15} /> Qabul qiluvchilarni tanlash
          </Button>
        </div>

        {/* Fayllar */}
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Fayllar va ilovalar</label>
          <input
            ref={fileRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFiles}
          />
          {files.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginBottom: 8,
              }}
            >
              {files.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: 'var(--ios-gray6)',
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  <Paperclip size={14} color="var(--ios-gray)" />
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </span>
                  <span className="muted" style={{ fontSize: 11.5 }}>
                    {f.sizeText}
                  </span>
                  <button
                    onClick={() => removeFile(f.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      color: 'var(--ios-gray)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              type="button"
              disabled={uploading}
            >
              <Paperclip size={15} />{' '}
              {uploading ? 'Yuklanmoqda...' : 'Fayl biriktirish'}
            </Button>
            <Button variant="secondary" type="button">
              <FileText size={15} /> Ilovalar
            </Button>
            <Button variant="secondary" type="button">
              <LinkIcon size={15} /> Aloqador hujjatlar
            </Button>
          </div>
        </div>

        {/* Saqlash */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
            paddingTop: 18,
            borderTop: '1px solid var(--ios-sep)',
            flexWrap: 'wrap',
          }}
        >
          <Button variant="secondary" onClick={() => nav('/documents')}>
            Bekor qilish
          </Button>
          <Button variant="secondary" onClick={() => save(true)}>
            <FileText size={15} /> Qoralama
          </Button>
          <Button onClick={() => save(false)}>
            <ShieldCheck size={15} /> Saqlash va yuborish
          </Button>
        </div>
      </div>

      <RecipientsModal
        open={showRecipients}
        selected={recipients}
        onClose={() => setShowRecipients(false)}
        onConfirm={(ids) => {
          setRecipients(ids);
          setShowRecipients(false);
        }}
      />
    </Layout>
  );
}