import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Button, Badge, Modal } from '../components/UI.jsx';
import FileViewer from '../components/FileViewer.jsx';
import Dropdown from '../components/Dropdown.jsx';
import Icon from '../components/Icons.jsx';
import {
  ApproveButton,
  ReturnButton,
  RejectButton,
  DeleteButton,
} from '../components/ActionButtons.jsx';
import {
  Upload, Eye, Send, RotateCcw, CheckCircle2, AlertTriangle,
  FileText, Building2, Plus, Inbox, FileSignature,
  XCircle, ShieldCheck, User as UserIcon, MessageSquare, Paperclip,
} from 'lucide-react';
import {
  saveFile, listFiles, deleteFile, updateFileMeta, appendHistory,
  listIncomingFiles,
} from '../utils/fileStore.js';
import {
  listMyDocs, listIncomingDocs,
  markDocRead, approveDoc, returnDoc, rejectDoc,
} from '../utils/docStore.js';
import { pushNotification } from '../utils/notify.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { FILE_STATUS } from '../data/mockData.js';
import { unitFullName } from '../data/orgUnits.js';
import { canAny, can } from '../utils/permissions.js';

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
  if (diff < 604800) return Math.floor(diff / 86400) + ' kun oldin';
  return new Date(iso).toLocaleDateString('uz-UZ');
}

const DOC_STATUS = {
  draft: { label: 'Qoralama', color: 'gray' },
  sent: { label: 'Yuborilgan', color: 'blue' },
  approved: { label: 'Tasdiqlangan', color: 'green' },
  returned: { label: 'Qaytarilgan', color: 'red' },
  rejected: { label: 'Bekor qilingan', color: 'red' },
};

export default function Documents() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const nav = useNavigate();

  // ===== RBAC =====
  const canCreate = canAny(user, ['doc.create']);
  const canUploadFile = canAny(user, ['file.upload']);
  const canApprove = canAny(user, ['doc.approve', 'file.approve']);
  const canReturn = canAny(user, ['doc.return', 'file.return']);
  const canReject = canAny(user, ['doc.reject']);
  const canDeleteFile = canAny(user, ['file.delete', 'file.upload']);
  const isRecipientRole = canApprove || canReturn || canReject;

  const [myFiles, setMyFiles] = useState([]);
  const [incomingFiles, setIncomingFiles] = useState([]);
  const [myDocs, setMyDocs] = useState([]);
  const [incomingDocs, setIncomingDocs] = useState([]);

  const [openDoc, setOpenDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [returnInfo, setReturnInfo] = useState(null);
  const [docDetail, setDocDetail] = useState(null);
  const [actionDoc, setActionDoc] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef(null);

  const newDocItems = [
    {
      label: 'Kiruvchi hujjat',
      icon: <Inbox size={16} />,
      color: '#007AFF',
      onClick: () => nav('/documents/new?type=kiruvchi'),
    },
    {
      label: 'Chiquvchi hujjat',
      icon: <Send size={16} />,
      color: '#34C759',
      onClick: () => nav('/documents/new?type=chiquvchi'),
    },
    {
      label: 'Murojaat',
      icon: <FileSignature size={16} />,
      color: '#FF9500',
      onClick: () => nav('/documents/new?type=murojaat'),
    },
    {
      label: 'Ichki hujjat',
      icon: <FileText size={16} />,
      color: '#AF52DE',
      onClick: () => nav('/documents/new?type=ichki'),
    },
  ];

  const load = async () => {
    setLoading(true);
    const all = await listFiles();

    setMyFiles(
      all
        .filter((f) => f.uploaderId === user.id || f.ownerId === user.id)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    );

    if (isRecipientRole) {
      const incoming = await listIncomingFiles(user);
      setIncomingFiles(
        incoming.sort((a, b) =>
          (b.submittedAt || b.date || '').localeCompare(
            a.submittedAt || a.date || ''
          )
        )
      );
      setIncomingDocs(
        listIncomingDocs(user).sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        )
      );
    } else {
      setIncomingFiles([]);
      setIncomingDocs([]);
    }

    setMyDocs(
      listMyDocs(user).sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || '')
      )
    );

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [user.id, user.role]);

  // ===== Fayl yuklash =====
  const handleUpload = async (e) => {
    if (!canUploadFile) return;
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

  // ===== Faylni tasdiqlashga yuborish =====
  const submitFileForReview = async (doc) => {
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

  // ===== Kelgan fayl ustida harakat =====
  const openFileAction = async (file, type) => {
    if (type === 'approve' && !canApprove) return;
    if (type === 'return' && !canReturn) return;

    if (type === 'approve') {
      const ok = await confirm({
        title: 'Faylni tasdiqlash',
        text: `"${file.name}" faylini tasdiqlaysizmi?`,
        confirmText: 'Tasdiqlash',
        cancelText: 'Bekor',
        variant: 'success',
      });
      if (!ok) return;
      const now = new Date().toISOString();
      await updateFileMeta(file.id, {
        status: 'approved',
        reviewedAt: now,
        reviewedBy: user.id,
        reviewedByName: user.name,
        returnReason: null,
      });
      await appendHistory(file.id, {
        action: 'approved',
        by: user.id,
        byName: user.name,
        at: now,
      });
      pushNotification({
        toUserId: file.uploaderId,
        fromUserId: user.id,
        fromName: user.name,
        type: 'approved',
        title: 'Faylingiz tasdiqlandi ✅',
        text: `"${file.name}" fayli tasdiqlandi.`,
        relatedFileId: file.id,
      });
      load();
    } else if (type === 'return') {
      const reason = prompt('Qaytarish sababini kiriting:');
      if (!reason || !reason.trim()) return;
      const now = new Date().toISOString();
      await updateFileMeta(file.id, {
        status: 'returned',
        reviewedAt: now,
        reviewedBy: user.id,
        reviewedByName: user.name,
        returnReason: reason.trim(),
      });
      await appendHistory(file.id, {
        action: 'returned',
        by: user.id,
        byName: user.name,
        at: now,
        reason: reason.trim(),
      });
      pushNotification({
        toUserId: file.uploaderId,
        fromUserId: user.id,
        fromName: user.name,
        type: 'returned',
        title: 'Fayl qaytarildi ⚠️',
        text: `"${file.name}" fayli qaytarildi. Sabab: ${reason.trim()}`,
        relatedFileId: file.id,
      });
      load();
    }
  };

  // ===== Faylni o‘chirish =====
  const doDelete = async () => {
    if (!confirmDelete || !canDeleteFile) return;
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
      text: `"${confirmDelete.name}" faylini butunlay o‘chirmoqchimisiz?`,
      confirmText: 'O‘chirish',
      cancelText: 'Bekor',
      variant: 'danger',
    });
    if (!ok) return;

    await deleteFile(confirmDelete.id);
    setConfirmDelete(null);
    setDeleteReason('');
    load();
  };

  // ===== Hujjat harakati =====
  const openDocAction = (doc, type) => {
    if (type === 'approve' && !canApprove) return;
    if (type === 'return' && !canReturn) return;
    if (type === 'reject' && !canReject) return;

    markDocRead(doc.id, user);
    setDocDetail(null);
    setActionDoc(doc);
    setActionType(type);
    setActionReason('');
  };

  const executeDocAction = async () => {
    if (!actionDoc || !actionType) return;
    const reason = actionReason.trim();

    if ((actionType === 'return' || actionType === 'reject') && !reason) {
      await confirm({
        title: 'Sabab kiritilmagan',
        text: 'Iltimos, sababni kiriting.',
        confirmText: 'Tushunarli',
        hideCancel: true,
        variant: 'warning',
      });
      return;
    }

    const cfgs = {
      approve: {
        title: 'Hujjatni tasdiqlash',
        text: `"${actionDoc.number}" hujjatini tasdiqlaysizmi?`,
        confirmText: 'Tasdiqlash',
        variant: 'success',
      },
      return: {
        title: 'Hujjatni qaytarish',
        text: `"${actionDoc.number}" hujjatini qaytarasizmi?`,
        confirmText: 'Qaytarish',
        variant: 'warning',
      },
      reject: {
        title: 'Hujjatni bekor qilish',
        text: `"${actionDoc.number}" hujjatini butunlay bekor qilasizmi? Bu amalni ortga qaytarib bo‘lmaydi.`,
        confirmText: 'Bekor qilish',
        variant: 'danger',
      },
    }[actionType];

    const ok = await confirm({ ...cfgs, cancelText: 'Yopish' });
    if (!ok) return;

    if (actionType === 'approve') {
      approveDoc(actionDoc.id, user, reason);
      pushNotification({
        toUserId: actionDoc.createdBy,
        fromUserId: user.id,
        fromName: user.name,
        type: 'approved',
        title: 'Hujjatingiz tasdiqlandi ✅',
        text: `"${actionDoc.number}" tasdiqlandi.${reason ? ' Izoh: ' + reason : ''}`,
      });
    } else if (actionType === 'return') {
      returnDoc(actionDoc.id, user, reason);
      pushNotification({
        toUserId: actionDoc.createdBy,
        fromUserId: user.id,
        fromName: user.name,
        type: 'returned',
        title: 'Hujjat qaytarildi ⚠️',
        text: `"${actionDoc.number}" qaytarildi. Sabab: ${reason}`,
      });
    } else if (actionType === 'reject') {
      rejectDoc(actionDoc.id, user, reason);
      pushNotification({
        toUserId: actionDoc.createdBy,
        fromUserId: user.id,
        fromName: user.name,
        type: 'error',
        title: 'Hujjat bekor qilindi ❌',
        text: `"${actionDoc.number}" bekor qilindi. Sabab: ${reason}`,
      });
    }

    setActionDoc(null);
    setActionType(null);
    setActionReason('');
    load();
  };

  // ===== FILTRLASH =====
  const filteredMyFiles = useMemo(() => {
    if (filter === 'all') return myFiles;
    if (filter === 'draft') return myFiles.filter((d) => d.status === 'draft');
    if (filter === 'sent') return myFiles.filter((d) => d.status === 'submitted');
    if (filter === 'approved') return myFiles.filter((d) => d.status === 'approved');
    if (filter === 'returned') return myFiles.filter((d) => d.status === 'returned');
    return [];
  }, [myFiles, filter]);

  const filteredIncomingFiles = useMemo(() => {
    if (filter === 'all') return incomingFiles;
    if (filter === 'sent') return incomingFiles.filter((d) => d.status === 'submitted');
    if (filter === 'approved') return incomingFiles.filter((d) => d.status === 'approved');
    if (filter === 'returned') return incomingFiles.filter((d) => d.status === 'returned');
    return [];
  }, [incomingFiles, filter]);

  const filteredMyDocs = useMemo(() => {
    if (filter === 'all') return myDocs;
    if (filter === 'draft') return myDocs.filter((d) => d.status === 'draft');
    if (filter === 'sent') return myDocs.filter((d) => d.status === 'sent');
    if (filter === 'approved') return myDocs.filter((d) => d.status === 'approved');
    if (filter === 'returned') return myDocs.filter((d) => d.status === 'returned');
    if (filter === 'rejected') return myDocs.filter((d) => d.status === 'rejected');
    return [];
  }, [myDocs, filter]);

  const filteredIncomingDocs = useMemo(() => {
    if (filter === 'all') return incomingDocs;
    if (filter === 'sent') return incomingDocs.filter((d) => d.status === 'sent');
    if (filter === 'approved') return incomingDocs.filter((d) => d.status === 'approved');
    if (filter === 'returned') return incomingDocs.filter((d) => d.status === 'returned');
    if (filter === 'rejected') return incomingDocs.filter((d) => d.status === 'rejected');
    return [];
  }, [incomingDocs, filter]);

  const unreadIncomingDocs = incomingDocs.filter(
    (d) => !Array.isArray(d.readBy) || !d.readBy.some((r) => r.userId === user.id)
  ).length;
  const pendingIncomingFiles = incomingFiles.filter(
    (d) => d.status === 'submitted'
  ).length;

  const totalCount =
    myFiles.length + incomingFiles.length + myDocs.length + incomingDocs.length;

  const empty =
    !loading &&
    filteredMyFiles.length === 0 &&
    filteredIncomingFiles.length === 0 &&
    filteredMyDocs.length === 0 &&
    filteredIncomingDocs.length === 0;

  return (
    <Layout
      title="Hujjatlar"
      subtitle={`${totalCount} ta yozuv${
        pendingIncomingFiles + unreadIncomingDocs > 0
          ? ` · ${pendingIncomingFiles + unreadIncomingDocs} ta yangi`
          : ''
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
          {canUploadFile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> Fayl yuklash
            </Button>
          )}
        </>
      }
    >
      {/* ===== Yangi hujjat panel ===== */}
      {canCreate && (
        <div
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
            borderRadius: 18,
            padding: '20px 22px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            boxShadow: '0 8px 24px rgba(0,122,255,0.25)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 220, color: '#fff' }}>
            <div
              style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}
            >
              Yangi hujjat yaratish
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              Kiruvchi, chiquvchi, murojaat yoki ichki hujjat tayyorlang
            </div>
          </div>
          <Dropdown
            trigger={
              <button
                className="btn"
                style={{
                  background: '#fff',
                  color: '#007AFF',
                  fontWeight: 600,
                  padding: '11px 20px',
                  fontSize: 14,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <Plus size={16} /> Yangi hujjat
              </button>
            }
            items={newDocItems}
            align="right"
            width={260}
          />
        </div>
      )}

      {/* ===== Filtrlar ===== */}
      <div
        className="mb-3"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        {[
          { v: 'all', l: 'Barchasi' },
          { v: 'draft', l: 'Qoralama' },
          { v: 'sent', l: 'Yuborilgan' },
          { v: 'approved', l: 'Tasdiqlangan' },
          { v: 'returned', l: 'Qaytarilgan' },
          { v: 'rejected', l: 'Bekor qilingan' },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className="btn btn-sm"
            style={{
              background:
                filter === f.v ? 'var(--ios-blue)' : 'var(--ios-gray6)',
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

      {/* ====== KELGAN FAYLLAR ====== */}
      {!loading && isRecipientRole && filteredIncomingFiles.length > 0 && (
        <div className="card mb-4">
          <div className="between mb-3">
            <div
              className="card-title"
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Paperclip size={14} />
              Kelgan fayllar ({filteredIncomingFiles.length})
            </div>
            {pendingIncomingFiles > 0 && (
              <Badge color="orange">{pendingIncomingFiles} tekshiruvda</Badge>
            )}
          </div>
          <div className="list" style={{ boxShadow: 'none' }}>
            {filteredIncomingFiles.map((d) => {
              const { label, color } = extBadge(d.name);
              const st = FILE_STATUS[d.status] || FILE_STATUS.draft;
              const canAct = d.status === 'submitted';
              return (
                <div
                  key={d.id}
                  className="list-item"
                  style={{ flexWrap: 'wrap' }}
                >
                  <div
                    className="list-icon"
                    style={{
                      background: `${color}18`,
                      color,
                      fontWeight: 700,
                      fontSize: 11,
                      flexShrink: 0,
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
                      {d.company || 'Noma’lum'} · {d.region} ·{' '}
                      {d.sizeText || formatSize(d.size)}
                      {d.submittedAt && ` · ${timeAgo(d.submittedAt)}`}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    <button
                      className="icon-btn"
                      onClick={() => setOpenDoc(d)}
                      title="Ko‘rish"
                    >
                      <Eye size={16} />
                    </button>
                    {canAct && (
                      <>
                        <ApproveButton
                          onClick={() => openFileAction(d, 'approve')}
                        />
                        <ReturnButton
                          onClick={() => openFileAction(d, 'return')}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====== KELGAN HUJJATLAR ====== */}
      {!loading && isRecipientRole && filteredIncomingDocs.length > 0 && (
        <div className="card mb-4">
          <div className="between mb-3">
            <div
              className="card-title"
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Inbox size={14} />
              Kelgan hujjatlar ({filteredIncomingDocs.length})
            </div>
            {unreadIncomingDocs > 0 && (
              <Badge color="red">{unreadIncomingDocs} yangi</Badge>
            )}
          </div>
          <div className="list" style={{ boxShadow: 'none' }}>
            {filteredIncomingDocs.map((d) => {
              const st = DOC_STATUS[d.status] || DOC_STATUS.sent;
              const isUnread =
                !Array.isArray(d.readBy) ||
                !d.readBy.some((r) => r.userId === user.id);
              const canAct = d.status === 'sent';
              return (
                <div
                  key={d.id}
                  className="list-item"
                  style={{
                    flexWrap: 'wrap',
                    background: isUnread ? 'rgba(0,122,255,0.04)' : '#fff',
                    borderLeft: isUnread
                      ? '4px solid #007AFF'
                      : '4px solid transparent',
                  }}
                >
                  <div
                    className="list-icon"
                    style={{
                      background:
                        d.status === 'approved'
                          ? 'rgba(52,199,89,0.12)'
                          : d.status === 'returned' || d.status === 'rejected'
                          ? 'rgba(255,59,48,0.12)'
                          : 'rgba(0,122,255,0.1)',
                      color:
                        d.status === 'approved'
                          ? '#34C759'
                          : d.status === 'returned' || d.status === 'rejected'
                          ? '#FF3B30'
                          : '#007AFF',
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      markDocRead(d.id, user);
                      setDocDetail(d);
                      load();
                    }}
                  >
                    <FileText size={18} />
                  </div>
                  <div
                    className="list-body"
                    onClick={() => {
                      markDocRead(d.id, user);
                      setDocDetail(d);
                      load();
                    }}
                  >
                    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                      <b>{d.number}</b>
                      <Badge color={st.color}>{st.label}</Badge>
                      {isUnread && <Badge color="blue">Yangi</Badge>}
                    </div>
                    <span>
                      {d.typeLabel} · {d.createdByOrg || '—'} ·{' '}
                      {timeAgo(d.createdAt)}
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: 'var(--ios-gray)',
                        marginTop: 4,
                        display: 'block',
                      }}
                    >
                      {d.summary.slice(0, 100)}
                      {d.summary.length > 100 ? '…' : ''}
                    </span>
                  </div>

                  <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                    {canAct && (
                      <>
                        <ApproveButton
                          onClick={() => openDocAction(d, 'approve')}
                        />
                        <ReturnButton
                          onClick={() => openDocAction(d, 'return')}
                        />
                        <RejectButton
                          onClick={() => openDocAction(d, 'reject')}
                        />
                      </>
                    )}
                    <button
                      className="icon-btn"
                      onClick={() => setDocDetail(d)}
                      title="Ko‘rish"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====== MEN YUBORGAN HUJJATLAR ====== */}
      {!loading && filteredMyDocs.length > 0 && (
        <div className="card mb-4">
          <div className="between mb-3">
            <div
              className="card-title"
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Send size={14} />
              Men yuborgan hujjatlar ({filteredMyDocs.length})
            </div>
          </div>
          <div className="list" style={{ boxShadow: 'none' }}>
            {filteredMyDocs.map((d) => {
              const st = DOC_STATUS[d.status] || DOC_STATUS.draft;
              return (
                <div
                  key={d.id}
                  className="list-item"
                  onClick={() => setDocDetail(d)}
                >
                  <div
                    className="list-icon"
                    style={{
                      background:
                        d.status === 'approved'
                          ? 'rgba(52,199,89,0.12)'
                          : d.status === 'returned' || d.status === 'rejected'
                          ? 'rgba(255,59,48,0.12)'
                          : d.status === 'draft'
                          ? 'var(--ios-gray6)'
                          : 'rgba(0,122,255,0.1)',
                      color:
                        d.status === 'approved'
                          ? '#34C759'
                          : d.status === 'returned' || d.status === 'rejected'
                          ? '#FF3B30'
                          : d.status === 'draft'
                          ? 'var(--ios-gray)'
                          : '#007AFF',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={18} />
                  </div>
                  <div className="list-body">
                    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                      <b>{d.number}</b>
                      <Badge color={st.color}>{st.label}</Badge>
                    </div>
                    <span>
                      {d.typeLabel} · {d.recipients.length} qabul qiluvchi ·{' '}
                      {timeAgo(d.createdAt)}
                    </span>
                  </div>
                  <Eye
                    size={16}
                    style={{ color: 'var(--ios-gray3)', flexShrink: 0 }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====== MENING FAYLLARIM ====== */}
      {!loading && filteredMyFiles.length > 0 && (
        <div className="card mb-4">
          <div
            className="card-title"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Paperclip size={14} />
            Mening fayllarim ({filteredMyFiles.length})
          </div>
          <div className="list" style={{ boxShadow: 'none' }}>
            {filteredMyFiles.map((d) => {
              const { label, color } = extBadge(d.name);
              const st = FILE_STATUS[d.status] || FILE_STATUS.draft;
              const canSubmit = d.status === 'draft' || d.status === 'returned';
              return (
                <div
                  key={d.id}
                  className="list-item"
                  style={{ flexWrap: 'wrap' }}
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
                    </span>
                    {d.returnReason && (
                      <div
                        style={{
                          marginTop: 6,
                          padding: '6px 10px',
                          background: '#FFEBEA',
                          borderRadius: 8,
                          fontSize: 12.5,
                          color: '#B22',
                        }}
                      >
                        <b>↩ Sabab:</b> {d.returnReason.slice(0, 100)}
                      </div>
                    )}
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    {canSubmit && canUploadFile && (
                      <button
                        className="icon-btn"
                        onClick={() => submitFileForReview(d)}
                        title="Tasdiqlashga yuborish"
                        style={{
                          background: 'rgba(0,122,255,0.1)',
                          color: '#007AFF',
                        }}
                      >
                        <Send size={15} />
                      </button>
                    )}
                    <button
                      className="icon-btn"
                      onClick={() => setOpenDoc(d)}
                      title="Ko‘rish"
                    >
                      <Eye size={16} />
                    </button>
                    <DeleteButton onClick={() => setConfirmDelete(d)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {empty && (
        <div className="empty">
          <div className="empty-icon">
            <Icon name="paperclip" size={48} strokeWidth={1.5} />
          </div>
          <b>
            {filter === 'all'
              ? 'Hujjatlar yo‘q'
              : 'Bu filtrda hujjatlar yo‘q'}
          </b>
          <div style={{ marginBottom: 18 }}>
            {canCreate
              ? '“Fayl yuklash” yoki “Yangi hujjat” orqali hujjat qo‘shing'
              : 'Hozircha sizga tegishli hujjat yo‘q'}
          </div>
          {canCreate && (
            <div
              style={{
                display: 'inline-flex',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {canUploadFile && (
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} /> Fayl yuklash
                </Button>
              )}
              <Dropdown
                trigger={
                  <button className="btn btn-primary">
                    <Plus size={15} /> Yangi hujjat
                  </button>
                }
                items={newDocItems}
                align="center"
                width={260}
              />
            </div>
          )}
        </div>
      )}

      {/* Fayl ko'ruvchi */}
      {openDoc && (
        <FileViewer
          file={openDoc}
          onClose={() => {
            setOpenDoc(null);
            load();
          }}
        />
      )}

      {/* Hujjat tafsiloti */}
      {docDetail && (
        <Modal
          title={docDetail.number}
          subtitle={`${docDetail.typeLabel} · ${docDetail.journal}`}
          onClose={() => setDocDetail(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setDocDetail(null)}>
                Yopish
              </Button>
              {docDetail.status === 'sent' &&
                docDetail.createdBy !== user.id &&
                (canApprove || canReturn || canReject) && (
                  <>
                    {canReject && (
                      <Button
                        variant="danger"
                        onClick={() => openDocAction(docDetail, 'reject')}
                      >
                        <XCircle size={14} /> Bekor
                      </Button>
                    )}
                    {canReturn && (
                      <Button
                        variant="secondary"
                        onClick={() => openDocAction(docDetail, 'return')}
                      >
                        <RotateCcw size={14} /> Qaytarish
                      </Button>
                    )}
                    {canApprove && (
                      <Button
                        onClick={() => openDocAction(docDetail, 'approve')}
                      >
                        <CheckCircle2 size={14} /> Tasdiqlash
                      </Button>
                    )}
                  </>
                )}
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                Holat
              </div>
              <Badge
                color={(DOC_STATUS[docDetail.status] || DOC_STATUS.draft).color}
              >
                {(DOC_STATUS[docDetail.status] || DOC_STATUS.draft).label}
              </Badge>
            </div>
            {docDetail.createdByOrg && (
              <div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                  Yuboruvchi
                </div>
                <div className="row" style={{ gap: 8, fontSize: 13.5 }}>
                  <UserIcon size={14} />
                  <b>{docDetail.createdByOrg}</b>
                </div>
              </div>
            )}
            <div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                Qisqacha mazmuni
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                {docDetail.summary}
              </div>
            </div>
            {docDetail.recipients?.length > 0 && (
              <div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
                  Qabul qiluvchilar ({docDetail.recipients.length})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {docDetail.recipients.map((r) => (
                    <div
                      key={r}
                      className="row"
                      style={{
                        padding: '8px 10px',
                        background: 'var(--ios-gray6)',
                        borderRadius: 8,
                        fontSize: 13,
                        gap: 8,
                      }}
                    >
                      <Building2 size={14} color="#007AFF" />
                      <span>{unitFullName(r)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {docDetail.status === 'approved' && docDetail.approvedByName && (
              <div
                style={{
                  padding: 12,
                  background: 'rgba(52,199,89,0.1)',
                  border: '1px solid rgba(52,199,89,0.3)',
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div
                  className="row"
                  style={{ gap: 8, marginBottom: 4, color: '#1F8A3F' }}
                >
                  <CheckCircle2 size={16} />
                  <b>Tasdiqlangan</b>
                </div>
                <div style={{ color: '#1F8A3F' }}>
                  <b>{docDetail.approvedByName}</b> ·{' '}
                  {new Date(docDetail.approvedAt).toLocaleString('uz-UZ')}
                </div>
              </div>
            )}
            {docDetail.status === 'returned' && docDetail.returnReason && (
              <div
                style={{
                  padding: 12,
                  background: '#FFEBEA',
                  border: '1px solid #FFC9C4',
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div
                  className="row"
                  style={{ gap: 8, marginBottom: 4, color: '#B22' }}
                >
                  <RotateCcw size={16} />
                  <b>Qaytarilgan</b>
                </div>
                <div style={{ color: '#5A2020' }}>
                  <b>{docDetail.returnedByName}</b> ·{' '}
                  {new Date(docDetail.returnedAt).toLocaleString('uz-UZ')}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    padding: '8px 10px',
                    background: '#fff',
                    borderRadius: 6,
                    color: '#B22',
                    fontSize: 13,
                  }}
                >
                  {docDetail.returnReason}
                </div>
              </div>
            )}
            {docDetail.status === 'rejected' && docDetail.rejectReason && (
              <div
                style={{
                  padding: 12,
                  background: '#FFEBEA',
                  border: '1px solid #FFC9C4',
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div
                  className="row"
                  style={{ gap: 8, marginBottom: 4, color: '#B22' }}
                >
                  <XCircle size={16} />
                  <b>Bekor qilingan</b>
                </div>
                <div style={{ color: '#5A2020' }}>
                  <b>{docDetail.rejectedByName}</b> ·{' '}
                  {new Date(docDetail.rejectedAt).toLocaleString('uz-UZ')}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    padding: '8px 10px',
                    background: '#fff',
                    borderRadius: 6,
                    color: '#B22',
                    fontSize: 13,
                  }}
                >
                  {docDetail.rejectReason}
                </div>
              </div>
            )}
            {docDetail.readBy?.length > 0 && (
              <div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
                  O‘qiganlar ({docDetail.readBy.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {docDetail.readBy.map((r, i) => (
                    <div
                      key={i}
                      className="row"
                      style={{
                        padding: '6px 10px',
                        background: 'var(--ios-gray6)',
                        borderRadius: 8,
                        fontSize: 12.5,
                        gap: 8,
                      }}
                    >
                      <ShieldCheck size={12} color="#34C759" />
                      <span style={{ flex: 1 }}>{r.userName}</span>
                      <span className="muted">{timeAgo(r.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Harakat modali */}
      {actionDoc && actionType && (
        <Modal
          title={
            {
              approve: 'Hujjatni tasdiqlash',
              return: 'Hujjatni qaytarish',
              reject: 'Hujjatni bekor qilish',
            }[actionType]
          }
          subtitle={`${actionDoc.number} · ${actionDoc.createdByOrg || ''}`}
          onClose={() => {
            setActionDoc(null);
            setActionType(null);
            setActionReason('');
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setActionDoc(null);
                  setActionType(null);
                  setActionReason('');
                }}
              >
                Yopish
              </Button>
              <Button
                variant={actionType === 'approve' ? 'primary' : 'danger'}
                onClick={executeDocAction}
              >
                {actionType === 'approve' && (
                  <>
                    <CheckCircle2 size={14} /> Tasdiqlash
                  </>
                )}
                {actionType === 'return' && (
                  <>
                    <RotateCcw size={14} /> Qaytarish
                  </>
                )}
                {actionType === 'reject' && (
                  <>
                    <XCircle size={14} /> Bekor qilish
                  </>
                )}
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {actionType === 'approve' && (
              <div
                style={{
                  padding: 12,
                  background: 'rgba(52,199,89,0.1)',
                  border: '1px solid rgba(52,199,89,0.3)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#1F8A3F',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>Tasdiqlansa, yuboruvchi xabar oladi.</div>
              </div>
            )}
            {actionType === 'return' && (
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
                }}
              >
                <AlertTriangle
                  size={16}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>Sabab yuboruvchiga yuboriladi.</div>
              </div>
            )}
            {actionType === 'reject' && (
              <div
                style={{
                  padding: 12,
                  background: '#FFEBEA',
                  border: '1px solid #FFC9C4',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#B22',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <XCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <b>Diqqat!</b> Bu amalni ortga qaytarib bo‘lmaydi.
                </div>
              </div>
            )}
            <div
              style={{
                padding: 10,
                background: 'var(--ios-gray6)',
                borderRadius: 8,
                fontSize: 12.5,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <UserIcon size={14} />
              <span>
                Siz: <b>{user.name}</b> ({user.roleLabel})
              </span>
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
                {actionType === 'approve' ? 'Izoh (ixtiyoriy)' : 'Sabab *'}
              </label>
              <textarea
                className="input"
                rows={4}
                autoFocus
                placeholder={
                  actionType === 'approve'
                    ? 'Izoh...'
                    : actionType === 'return'
                    ? 'Nega qaytarilganini yozing...'
                    : 'Nega bekor qilinayotganini yozing...'
                }
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                style={{
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
            </div>
            {actionType !== 'approve' && (
              <div>
                <div
                  className="muted"
                  style={{ fontSize: 12, marginBottom: 6 }}
                >
                  Tez tanlash:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(actionType === 'return'
                    ? [
                        'Miqdor noto‘g‘ri',
                        'Fayl biriktirilmagan',
                        'Imzo yo‘q',
                        'Format noto‘g‘ri',
                        'Qo‘shimcha hujjat kerak',
                      ]
                    : [
                        'Talablarga javob bermaydi',
                        'Noto‘g‘ri manzil',
                        'Xato yuborilgan',
                        'Dublikat',
                      ]
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActionReason(s)}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: 12 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Qaytarilgan fayl modali */}
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
                  submitFileForReview(doc);
                }}
              >
                <Send size={14} /> Qayta yuborish
              </Button>
            </>
          }
        >
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
        </Modal>
      )}

      {/* O'chirish modali */}
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
            Sababni kiriting.
          </div>
          <textarea
            className="input"
            rows={3}
            placeholder="Masalan: Xato yuklangan"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </Modal>
      )}
    </Layout>
  );
}