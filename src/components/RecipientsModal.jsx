import { useMemo, useState } from 'react';
import {
  X, Search, ChevronDown, ChevronRight, Check,
  Building2, MapPin, Users, CheckSquare, Square, User as UserIcon,
} from 'lucide-react';
import { ORG_UNITS } from '../data/orgUnits.js';

export default function RecipientsModal({ open, onClose, onConfirm, selected = [] }) {
  const [picked, setPicked] = useState(new Set(selected));
  const [search, setSearch] = useState('');
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const toggleUnit = (id) => {
    const next = new Set(expandedUnits);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedUnits(next);
  };

  const toggleGroup = (id) => {
    const next = new Set(expandedGroups);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedGroups(next);
  };

  // Filial ichidagi barcha xodimlarni tanlash
  const toggleUnitStaff = (unit) => {
    const ids = (unit.staff || []).map((s) => s.id);
    const allPicked = ids.length > 0 && ids.every((id) => picked.has(id));
    const next = new Set(picked);
    ids.forEach((id) => (allPicked ? next.delete(id) : next.add(id)));
    setPicked(next);
  };

  // Viloyat ichidagi barcha xodimlarni tanlash
  const toggleRegionStaff = (region) => {
    const ids = [];
    region.children.forEach((c) => (c.staff || []).forEach((s) => ids.push(s.id)));
    const allPicked = ids.length > 0 && ids.every((id) => picked.has(id));
    const next = new Set(picked);
    ids.forEach((id) => (allPicked ? next.delete(id) : next.add(id)));
    setPicked(next);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return ORG_UNITS;
    const q = search.toLowerCase();

    return ORG_UNITS.map((region) => {
      const regionMatch = region.name.toLowerCase().includes(q);
      const children = region.children
        .map((unit) => {
          const unitMatch = unit.name.toLowerCase().includes(q);
          const staff = (unit.staff || []).filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.position.toLowerCase().includes(q)
          );
          if (regionMatch || unitMatch) return unit;
          if (staff.length > 0) return { ...unit, staff };
          return null;
        })
        .filter(Boolean);

      if (regionMatch) return region;
      if (children.length > 0) return { ...region, children };
      return null;
    }).filter(Boolean);
  }, [search]);

  if (!open) return null;

  const totalPicked = picked.size;
  const totalStaff = ORG_UNITS.reduce(
    (sum, r) => sum + r.children.reduce((s, c) => s + (c.staff?.length || 0), 0),
    0
  );

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
          maxHeight: '90vh',
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
              {totalStaff} ta xodim ·{' '}
              {totalPicked > 0 ? `${totalPicked} ta tanlandi` : 'tanlang'}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Qidiruv + tez tugmalar */}
        <div
          style={{
            padding: '14px 22px 8px',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
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
              placeholder="Viloyat, filial, xodim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              const all = new Set();
              ORG_UNITS.forEach((r) =>
                r.children.forEach((c) =>
                  (c.staff || []).forEach((s) => all.add(s.id))
                )
              );
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

        {/* Ro'yxat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
          {filtered.length === 0 && (
            <div className="empty" style={{ padding: 40 }}>
              <b>Topilmadi</b>
              <div>Qidiruvni o‘zgartirib ko‘ring</div>
            </div>
          )}

          {filtered.map((region) => {
            const regionStaffIds = [];
            region.children.forEach((c) =>
              (c.staff || []).forEach((s) => regionStaffIds.push(s.id))
            );
            const regionAllPicked =
              regionStaffIds.length > 0 &&
              regionStaffIds.every((id) => picked.has(id));
            const regionSomePicked = regionStaffIds.some((id) => picked.has(id));
            const regionOpen = expandedUnits.has(region.id);

            return (
              <div key={region.id} style={{ marginBottom: 6 }}>
                {/* Viloyat */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: regionAllPicked
                      ? 'rgba(0,122,255,0.06)'
                      : 'transparent',
                  }}
                >
                  <button
                    onClick={() => toggleUnit(region.id)}
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
                    {regionOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  <input
                    type="checkbox"
                    checked={regionAllPicked}
                    ref={(el) => {
                      if (el)
                        el.indeterminate = regionSomePicked && !regionAllPicked;
                    }}
                    onChange={() => toggleRegionStaff(region)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: '#007AFF',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />

                  <div
                    onClick={() => toggleUnit(region.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      minWidth: 0,
                    }}
                  >
                    {region.type === 'central' ? (
                      <Building2 size={16} color="#007AFF" />
                    ) : (
                      <MapPin size={16} color="#FF3B30" />
                    )}
                    <b
                      style={{
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {region.name}
                    </b>
                    <span
                      className="muted"
                      style={{ fontSize: 12, flexShrink: 0 }}
                    >
                      ({regionStaffIds.length})
                    </span>
                  </div>
                </div>

                {/* Filiallar */}
                {regionOpen && (
                  <div style={{ paddingLeft: 20, marginTop: 2 }}>
                    {region.children.map((unit) => {
                      const unitStaffIds = (unit.staff || []).map((s) => s.id);
                      const unitAllPicked =
                        unitStaffIds.length > 0 &&
                        unitStaffIds.every((id) => picked.has(id));
                      const unitSomePicked = unitStaffIds.some((id) =>
                        picked.has(id)
                      );
                      const unitOpen = expandedGroups.has(unit.id);

                      return (
                        <div key={unit.id} style={{ marginBottom: 4 }}>
                          {/* Filial */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 10px',
                              borderRadius: 10,
                              background: unitAllPicked
                                ? 'rgba(0,122,255,0.04)'
                                : 'transparent',
                            }}
                          >
                            <button
                              onClick={() => toggleGroup(unit.id)}
                              style={{
                                width: 24,
                                height: 24,
                                border: 'none',
                                background: 'var(--ios-gray6)',
                                borderRadius: 6,
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                                color: 'var(--ios-text2)',
                                flexShrink: 0,
                              }}
                            >
                              {unitOpen ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>

                            <input
                              type="checkbox"
                              checked={unitAllPicked}
                              ref={(el) => {
                                if (el)
                                  el.indeterminate =
                                    unitSomePicked && !unitAllPicked;
                              }}
                              onChange={() => toggleUnitStaff(unit)}
                              style={{
                                width: 16,
                                height: 16,
                                accentColor: '#007AFF',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            />

                            <div
                              onClick={() => toggleGroup(unit.id)}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13.5,
                                  color: 'var(--ios-text2)',
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {unit.name}
                              </span>
                              <span
                                className="muted"
                                style={{ fontSize: 11.5, flexShrink: 0 }}
                              >
                                ({unitStaffIds.length})
                              </span>
                            </div>
                          </div>

                          {/* Xodimlar */}
                          {unitOpen && (
                            <div
                              style={{
                                paddingLeft: 46,
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                              }}
                            >
                              {(unit.staff || []).map((s) => {
                                const isPicked = picked.has(s.id);
                                return (
                                  <label
                                    key={s.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      padding: '6px 10px',
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      background: isPicked
                                        ? 'rgba(0,122,255,0.06)'
                                        : 'transparent',
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isPicked}
                                      onChange={() => togglePick(s.id)}
                                      style={{
                                        width: 15,
                                        height: 15,
                                        accentColor: '#007AFF',
                                        cursor: 'pointer',
                                      }}
                                    />
                                    <UserIcon
                                      size={13}
                                      color="var(--ios-gray)"
                                      style={{ flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          fontSize: 13,
                                          fontWeight: 500,
                                          color: 'var(--ios-text)',
                                        }}
                                      >
                                        {s.name}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 11,
                                          color: 'var(--ios-gray)',
                                        }}
                                      >
                                        {s.position}
                                      </div>
                                    </div>
                                    {isPicked && (
                                      <Check
                                        size={14}
                                        color="#34C759"
                                        style={{ flexShrink: 0 }}
                                      />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
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
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Bekor
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm([...picked])}
            style={{ flex: 2 }}
            disabled={totalPicked === 0}
          >
            <Check size={15} /> Tanlash ({totalPicked})
          </button>
        </div>
      </div>
    </div>
  );
}