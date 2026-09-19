import { useEffect, useState } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  // Analog soat uchun burchaklar
  const secondDeg = s * 6;
  const minuteDeg = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const pad = (n) => String(n).padStart(2, '0');

  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ];
  const days = [
    'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
    'Payshanba', 'Juma', 'Shanba',
  ];

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 20,
        padding: '18px 20px',
        minWidth: 220,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fon gradient animatsiyasi */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(0,122,255,0.05), rgba(175,82,222,0.05))',
          pointerEvents: 'none',
        }}
      />

      {/* ANALOG SOAT */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background:
            'linear-gradient(145deg, #ffffff 0%, #f0f2f5 100%)',
          boxShadow:
            'inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* 12, 3, 6, 9 raqamlari */}
        {[
          { n: '12', top: 6, left: '50%', tx: '-50%', ty: '0' },
          { n: '3', top: '50%', left: 'auto', right: 6, tx: '0', ty: '-50%' },
          { n: '6', top: 'auto', bottom: 4, left: '50%', tx: '-50%', ty: '0' },
          { n: '9', top: '50%', left: 6, tx: '0', ty: '-50%' },
        ].map((it) => (
          <span
            key={it.n}
            style={{
              position: 'absolute',
              fontSize: 9,
              fontWeight: 700,
              color: '#8E8E93',
              top: it.top,
              bottom: it.bottom,
              left: it.left,
              right: it.right,
              transform: `translate(${it.tx}, ${it.ty})`,
            }}
          >
            {it.n}
          </span>
        ))}

        {/* Soat mili (soat) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2.5,
            height: 18,
            background: '#1A1A1A',
            borderRadius: 2,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 2.5, 0.6, 1)',
            marginTop: 0,
          }}
        />

        {/* Soat mili (daqiqa) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2,
            height: 24,
            background: '#007AFF',
            borderRadius: 2,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.4, 2.5, 0.6, 1)',
          }}
        />

        {/* Sekund mili — qizil, silliq aylanadi */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 1.5,
            height: 28,
            background: '#FF3B30',
            borderRadius: 2,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
            transition: 'transform 0.15s cubic-bezier(0.4, 2.5, 0.6, 1)',
            boxShadow: '0 0 4px rgba(255,59,48,0.6)',
          }}
        />

        {/* Markaziy nuqta */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#007AFF',
            transform: 'translate(-50%, -50%)',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,122,255,0.3)',
          }}
        />

        {/* Pulsatsiya qiluvchi halqa */}
        <div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            border: '1.5px solid rgba(0,122,255,0.35)',
            animation: 'clockPulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* RAQAMLI SOAT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Katta vaqt */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
            fontFamily: 'SF Mono, Menlo, Consolas, monospace',
            letterSpacing: '-1px',
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#1A1A1A',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(h)}
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#007AFF',
              animation: 'clockColon 1s ease-in-out infinite',
            }}
          >
            :
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#1A1A1A',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(m)}
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#FF3B30',
              animation: 'clockColon 1s ease-in-out infinite',
            }}
          >
            :
          </span>
          <span
            key={s}
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#FF3B30',
              fontVariantNumeric: 'tabular-nums',
              display: 'inline-block',
              animation: 'clockSecond 0.6s cubic-bezier(0.4, 2.5, 0.6, 1)',
              minWidth: 34,
            }}
          >
            {pad(s)}
          </span>
        </div>

        {/* Sana */}
        <div
          style={{
            fontSize: 12,
            color: '#5A6170',
            fontWeight: 500,
            marginTop: 4,
          }}
        >
          {time.getDate()}-{months[time.getMonth()]}, {days[time.getDay()]}
        </div>

        {/* Yil */}
        <div
          style={{
            fontSize: 11,
            color: '#8E8E93',
            marginTop: 1,
            fontWeight: 500,
          }}
        >
          {time.getFullYear()}-yil
        </div>
      </div>

      <style>{`
        @keyframes clockColon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes clockSecond {
          0% { transform: scale(1.35); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes clockPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.06); opacity: 0; }
        }
      `}</style>
    </div>
  );
}