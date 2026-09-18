import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { X, Download, Save, Pencil, Eye } from 'lucide-react';
import { Button } from './UI.jsx';
import { getFile } from '../utils/fileStore.js';

function getKind(ext, mime = '') {
  if (ext === 'pdf' || mime.includes('pdf')) return 'pdf';
  if (
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext) ||
    mime.startsWith('image/')
  )
    return 'image';
  if (['xlsx', 'xls', 'xlsm'].includes(ext)) return 'excel';
  if (ext === 'csv') return 'csv';
  if (ext === 'docx') return 'docx';
  if (ext === 'doc') return 'doc';
  if (['txt', 'md', 'log'].includes(ext) || mime.startsWith('text/')) return 'text';
  return 'other';
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function ExcelEditor({ value, onChange, editable }) {
  const aoa = value.aoa || [];
  const maxCols = Math.max(1, ...aoa.map((r) => (Array.isArray(r) ? r.length : 0)));

  const updateCell = (r, c, v) => {
    const next = aoa.map((row) => [...row]);
    while (next.length <= r) next.push([]);
    while (next[r].length <= c) next[r].push('');
    next[r][c] = v;
    onChange({ ...value, aoa: next });
  };

  return (
    <div className="excel-view">
      <table>
        <tbody>
          {aoa.map((row, r) => (
            <tr key={r}>
              <th
                style={{
                  width: 40,
                  textAlign: 'center',
                  color: '#8E8E93',
                  background: '#FAFAFC',
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                }}
              >
                {r + 1}
              </th>
              {Array.from({ length: maxCols }).map((_, c) => (
                <td key={c} style={{ padding: 0 }}>
                  {editable ? (
                    <input
                      className="excel-cell-input"
                      value={row?.[c] ?? ''}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                    />
                  ) : (
                    <div className="excel-cell">{row?.[c] ?? ''}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FileViewer({ file, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('view');
  const [content, setContent] = useState(null);
  const [blob, setBlob] = useState(null);
  const urlRef = useRef(null);

  const ext = file.name.split('.').pop().toLowerCase();
  const kind = getKind(ext, file.type);
  const editable = ['excel', 'csv', 'docx', 'text'].includes(kind);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // ✅ Blob'ni har doim IndexedDB'dan olamiz (xavfsizroq)
        let b = file.blob;
        if (!b || !(b instanceof Blob)) {
          const stored = await getFile(file.id);
          b = stored?.blob;
        }
        if (!b) throw new Error('Fayl blob topilmadi');
        if (mounted) setBlob(b);

        if (['pdf', 'image'].includes(kind)) {
          const url = URL.createObjectURL(b);
          urlRef.current = url;
          if (mounted) setContent(url);
        } else if (kind === 'excel' || kind === 'csv') {
          const buf = await b.arrayBuffer();
          const wb = XLSX.read(buf, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          if (mounted) setContent({ sheetName: wb.SheetNames[0], aoa });
        } else if (kind === 'docx') {
          const buf = await b.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer: buf });
          if (mounted) setContent(result.value || '<p></p>');
        } else if (kind === 'text') {
          const text = await b.text();
          if (mounted) setContent(text);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Faylni ochib bo‘lmadi');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [file, kind]);

  const downloadOriginal = () => {
    if (blob) downloadBlob(blob, file.name);
  };

  const saveEdited = () => {
    try {
      if (kind === 'excel' || kind === 'csv') {
        const ws = XLSX.utils.aoa_to_sheet(content.aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, content.sheetName || 'Sheet1');
        const bookType = kind === 'csv' ? 'csv' : 'xlsx';
        const out = XLSX.write(wb, { bookType, type: 'array' });
        const mime =
          kind === 'csv'
            ? 'text/csv'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        downloadBlob(new Blob([out], { type: mime }), file.name);
      } else if (kind === 'docx') {
        const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${file.name}</title></head><body>${content}</body></html>`;
        const newName = file.name.replace(/\.docx$/i, '.doc');
        downloadBlob(new Blob([html], { type: 'application/msword' }), newName);
      } else if (kind === 'text') {
        downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), file.name);
      }
    } catch (e) {
      alert('Saqlashda xatolik: ' + e.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="file-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="file-viewer-header">
          <div className="row" style={{ minWidth: 0, flex: 1 }}>
            <div
              className="list-icon"
              style={{
                background: 'rgba(0,122,255,0.1)',
                color: '#007AFF',
                flexShrink: 0,
              }}
            >
              📄
            </div>
            <div style={{ minWidth: 0 }}>
              <b
                style={{
                  display: 'block',
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </b>
              <span style={{ fontSize: 12, color: '#8E8E93' }}>
                {file.sizeText} · {file.date}
              </span>
            </div>
          </div>

          <div className="row" style={{ flexWrap: 'wrap' }}>
            {editable && !loading && (
              <Button
                variant={mode === 'edit' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}
              >
                {mode === 'edit' ? (
                  <>
                    <Eye size={14} /> Ko‘rish
                  </>
                ) : (
                  <>
                    <Pencil size={14} /> Tahrirlash
                  </>
                )}
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={downloadOriginal}>
              <Download size={14} /> Yuklab olish
            </Button>
            {mode === 'edit' && editable && (
              <Button size="sm" onClick={saveEdited}>
                <Save size={14} /> Saqlash
              </Button>
            )}
            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="file-viewer-body">
          {loading && (
            <div className="muted" style={{ padding: 40, textAlign: 'center' }}>
              Yuklanmoqda...
            </div>
          )}
          {error && (
            <div style={{ padding: 40, textAlign: 'center', color: '#FF3B30' }}>
              ⚠ {error}
            </div>
          )}

          {!loading && !error && content !== null && (
            <>
              {kind === 'pdf' && (
                <iframe src={content} title={file.name} className="file-frame" />
              )}
              {kind === 'image' && (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <img
                    src={content}
                    alt={file.name}
                    style={{ maxWidth: '100%', borderRadius: 12 }}
                  />
                </div>
              )}
              {(kind === 'excel' || kind === 'csv') && (
                <ExcelEditor
                  value={content}
                  onChange={setContent}
                  editable={mode === 'edit'}
                />
              )}
              {kind === 'docx' && (
                <div
                  className="docx-view"
                  contentEditable={mode === 'edit'}
                  suppressContentEditableWarning
                  onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
              {kind === 'text' && (
                <textarea
                  className="text-editor"
                  value={content}
                  readOnly={mode !== 'edit'}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}
            </>
          )}

          {!loading && !error && content === null && (
            <div style={{ padding: 60, textAlign: 'center', color: '#8E8E93' }}>
              <p style={{ fontSize: 15, color: '#3C3C43', fontWeight: 600 }}>
                Bu fayl turi ko‘rib chiqishni qo‘llab-quvvatlamaydi
              </p>
              <p style={{ fontSize: 13 }}>
                Faylni yuklab olib, kompyuterda oching.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}