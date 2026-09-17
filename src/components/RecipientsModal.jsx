import { useMemo, useState } from 'react';
import {
  X, Search, ChevronDown, ChevronRight, Check,
  Building2, MapPin, Users, CheckSquare, Square,
} from 'lucide-react';
import { ORG_UNITS } from '../data/orgUnits.js';

export default function RecipientsModal({ open, onClose, onConfirm, selected = [] }) {
  const [picked, setPicked] = useState(new Set(selected));
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(new Set(ORG_UNITS.map((u) => u.id)));

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const toggleExpand = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const selectAllIn = (unit) => {
    const next = new Set(picked);
    unit.children.forEach((c) => next.add(c.id));
    setPicked(next);
  };

  const clearAllIn = (unit) => {
    const next = new Set(picked);
    unit.children.forEach((c) => next.delete(c.id));
    setPicked(next);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return ORG_UNITS;
    const q = search.toLowerCase();
    return ORG_UNITS.map((u) => ({
      ...u,
      children: u.children.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
      ),
    })).filter(
      (u) => u.children.length > 0 || u.name.toLowerCase().includes(q)
    );
  }, [search]);

  if (!open) return null;
  const total = picked.size;
  const allCount = ORG_UNITS.reduce((s, u) => s + u.children.length, 0);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 300, alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 22,
          width: '100%',
          maxWidth: 640,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
          animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--ios-sep)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg,#007AFF,#AF52DE)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 18, letterSpacing: '-0.3px' }}>
              Qabul qiluvchilar
            </h2>
            <div className="muted" style={{ fontSize: 12.5 }}>
              {total ? `${total} ta tanlangan` : `${allCount} ta bo‘lim mavjud`}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Qidiruv + tez tugmalar */}
        <div style={{ padding: '14px 22px 8px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
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
              placeholder="Viloyat, filial yoki bo‘lim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              const all = new Set();
              ORG_UNITS.forEach((u) => u.children.forEach((c) => all.add(c.id)));
              setPicked(all);
            }}
          >
            <CheckSquare size={14} /> Hammasi
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setPicked(new Set())}
          >
            <Square size={14} /> Tozalash
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
          {filtered.map((unit) => {
            const isOpen = expanded.has(unit.id);
            const allPicked =
              unit.children.length > 0 &&
              unit.children.every((c) => picked.has(c.id));
            const somePicked = unit.children.some((c) => picked.has(c.id));

            return (
              <div key={unit.id} style={{ marginBottom: 4 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px',
                    borderRadius: 12,
                    background: allPicked ? 'rgba(0,122,255,0.06)' : 'transparent',
                  }}
                >
                  <button
                    onClick={() => toggleExpand(unit.id)}
                    style={{
                      width: 28,
                      height: 28,
                      border: 'none',
                      background: 'var(--ios-gray6)',
                      borderRadius: 8,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      color: 'var(--ios-text2)',
                      flexShrink: 0,
                    }}
                  >
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  <input
                    type="checkbox"
                    checked={allPicked}
                    ref={(el) => {
                      if (el) el.indeterminate = somePicked && !allPicked;
                    }}
                    onChange={() => (allPicked ? clearAllIn(unit) : selectAllIn(unit))}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: '#007AFF',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />

                  <div
                    onClick={() => toggleExpand(unit.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      minWidth: 0,
                    }}
                  >
                    {unit.type === 'central' ? (
                      <Building2 size={16} color="#007AFF" />
                    ) : (
                      <MapPin size={16} color="#FF3B30" />
                    )}
                    <b style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {unit.name}
                    </b>
                    <span className="muted" style={{ fontSize: 12, flexShrink: 0 }}>
                      ({unit.children.length})
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ paddingLeft: 44, marginTop: 2 }}>
                    {unit.children.map((child) => {
                      const isPicked = picked.has(child.id);
                      return (
                        <label
                          key={child.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            background: isPicked
                              ? 'rgba(0,122,255,0.05)'
                              : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isPicked}
                            onChange={() => togglePick(child.id)}
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: '#007AFF',
                              cursor: 'pointer',
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13.5,
                              color: 'var(--ios-text2)',
                              flex: 1,
                            }}
                          >
                            {child.name}
                          </span>
                          {isPicked && <Check size={14} color="#34C759" />}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--ios-sep)',
            display: 'flex',
            gap: 10,
          }}
        >
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Bekor
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm([...picked])}
            style={{ flex: 2 }}
            disabled={total === 0}
          >
            <Check size={15} /> Tanlash ({total})
          </button>
        </div>
      </div>
    </div>
  );
}