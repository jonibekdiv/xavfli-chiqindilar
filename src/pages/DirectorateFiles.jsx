import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Badge } from '../components/UI.jsx';
import FileViewer from '../components/FileViewer.jsx';
import Icon from '../components/Icons.jsx';
import { Eye, Search, Building2, MapPin } from 'lucide-react';
import { listFiles } from '../utils/fileStore.js';
import { FILE_STATUS, REGIONS } from '../data/mockData.js';

export default function DirectorateFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDoc, setOpenDoc] = useState(null);
  const [region, setRegion] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const all = await listFiles();
      setFiles(all.filter((f) => f.status !== 'draft'));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = files;
    if (region !== 'all') list = list.filter((f) => f.region === region);
    if (status !== 'all') list = list.filter((f) => f.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.company || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [files, region, status, search]);

  const counts = useMemo(() => ({
    submitted: files.filter((f) => f.status === 'submitted').length,
    approved: files.filter((f) => f.status === 'approved').length,
    returned: files.filter((f) => f.status === 'returned').length,
    total: files.length,
  }), [files]);

  return (
    <Layout
      title="Barcha fayllar"
      subtitle={`${counts.total} ta fayl respublika bo‘yicha`}
    >
      <div className="grid grid-4 mb-4">
        <div className="stat" style={{ '--accent': '#007AFF' }}>
          <div className="stat-icon" style={{ background: '#007AFF' }}>
            <Icon name="paperclip" size={20} />
          </div>
          <div className="stat-label">Jami</div>
          <div className="stat-value mono">{counts.total}</div>
        </div>
        <div className="stat" style={{ '--accent': '#FF9500' }}>
          <div className="stat-icon" style={{ background: '#FF9500' }}>
            <Icon name="clock" size={20} />
          </div>
          <div className="stat-label">Tekshiruvda</div>
          <div className="stat-value mono">{counts.submitted}</div>
        </div>
        <div className="stat" style={{ '--accent': '#34C759' }}>
          <div className="stat-icon" style={{ background: '#34C759' }}>
            <Icon name="checkCircle" size={20} />
          </div>
          <div className="stat-label">Tasdiqlangan</div>
          <div className="stat-value mono">{counts.approved}</div>
        </div>
        <div className="stat" style={{ '--accent': '#FF3B30' }}>
          <div className="stat-icon" style={{ background: '#FF3B30' }}>
            <Icon name="return" size={20} />
          </div>
          <div className="stat-label">Qaytarilgan</div>
          <div className="stat-value mono">{counts.returned}</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="card mb-3">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ios-gray)', marginBottom: 6 }}>
              Hudud
            </label>
            <select className="input" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">Barchasi</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ios-gray)', marginBottom: 6 }}>
              Holat
            </label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Barchasi</option>
              <option value="submitted">Tekshiruvda</option>
              <option value="approved">Tasdiqlangan</option>
              <option value="returned">Qaytarilgan</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ios-gray)', marginBottom: 6 }}>
              Qidirish
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ios-gray)' }} />
              <input
                className="input"
                placeholder="Fayl yoki korxona..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Yuklanmoqda...</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon"><Icon name="inbox" size={48} strokeWidth={1.5} /></div>
          <b>Fayllar topilmadi</b>
          <div>Filtrlarni o‘zgartirib ko‘ring</div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="list">
          {filtered.map((d) => {
            const st = FILE_STATUS[d.status] || FILE_STATUS.draft;
            return (
              <div key={d.id} className="list-item" onClick={() => setOpenDoc(d)}>
                <div className="list-icon" style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}>
                  <Icon name="file" size={20} />
                </div>
                <div className="list-body">
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <b>{d.name}</b>
                    <Badge color={st.color}>{st.label}</Badge>
                  </div>
                  <div className="row" style={{ gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--ios-gray)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={12} /> {d.company}
                    </span>
                    <span style={{ fontSize: 12.5, color: 'var(--ios-gray)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {d.region}
                    </span>
                  </div>
                </div>
                <button className="icon-btn">
                  <Eye size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {openDoc && <FileViewer file={openDoc} onClose={() => setOpenDoc(null)} />}
    </Layout>
  );
}