import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:     ${dark ? '#f0f0ee' : '#0f0f0f'};
      --ink-2:   ${dark ? '#a0a0a0' : '#6b6b6b'};
      --ink-3:   ${dark ? '#555555' : '#b0b0b0'};
      --surface: ${dark ? '#1a1a1e' : '#ffffff'};
      --bg:      ${dark ? '#111115' : '#f5f4f1'};
      --card-bg: ${dark ? '#1f1f25' : '#ffffff'};
      --border:  ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'};
      --accent:  #1a5cff;
      --accent-h:#0040d8;
      --green:   #22c55e;
      --gold:    #f59e0b;
      --radius:  16px;
      --font-body: 'DM Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
      --shadow-sm: ${dark ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06)'};
      --shadow-md: ${dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)'};
      --shadow-lg: ${dark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)'};
    }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--ink);
      transition: background 0.3s ease, color 0.3s ease;
    }

    input:focus { outline: 2px solid var(--accent); outline-offset: 0; }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--ink-3); border-radius: 99px; }

    /* ── Aquarium hero ── */
    .aquarium-hero {
      position: relative;
      width: 100%;
      height: 340px;
      background: linear-gradient(180deg, #0a3d6b 0%, #0d5fa0 40%, #1a8cb8 75%, #2db8c8 100%);
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 40px;
    }

    @keyframes caustics {
      0%,100% { opacity: 0.18; transform: scaleX(1) translateX(0); }
      50%      { opacity: 0.28; transform: scaleX(1.06) translateX(12px); }
    }
    .caustic-ray {
      position: absolute; top: 0; width: 3px; height: 100%;
      background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%);
      transform-origin: top center;
      animation: caustics 4s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes bubble {
      0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
      50%  { transform: translateY(-60px) translateX(6px) scale(1.1); opacity: 0.5; }
      100% { transform: translateY(-120px) translateX(-4px) scale(0.8); opacity: 0; }
    }
    .bubble {
      position: absolute; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.1);
      animation: bubble linear infinite;
      pointer-events: none;
    }

    @keyframes sway {
      0%,100% { transform-origin: bottom center; transform: rotate(-8deg) scaleY(1); }
      50%      { transform-origin: bottom center; transform: rotate(8deg) scaleY(1.03); }
    }
    .seaweed { animation: sway ease-in-out infinite; }

    /*
      Los peces SVG tienen nariz en la DERECHA y cola en la IZQUIERDA → miran a la DERECHA.
      swimRight: va izq→der, pez ya mira derecha → sin flip, scaleX(1) ✓
      swimLeft:  va der→izq, hay que voltear → scaleX(-1) para que mire izquierda ✓
    */
    @keyframes swimRight {
      0%   { transform: translateX(-160px) scaleX(1); }
      100% { transform: translateX(calc(100vw + 160px)) scaleX(1); }
    }
    @keyframes swimLeft {
      0%   { transform: translateX(calc(100vw + 160px)) scaleX(-1); }
      100% { transform: translateX(-160px) scaleX(-1); }
    }
    .fish { position: absolute; pointer-events: none; will-change: transform; }
    .fish-r { animation: swimRight linear infinite; }
    .fish-l { animation: swimLeft  linear infinite; }

    @keyframes shimmer {
      0%,100% { opacity: 0.12; }
      50%      { opacity: 0.22; }
    }
    .water-surface {
      position: absolute; top: 0; left: 0; right: 0; height: 24px;
      background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%);
      animation: shimmer 3s ease-in-out infinite;
    }

    .tank-sand {
      position: absolute; bottom: 0; left: 0; right: 0; height: 36px;
      background: linear-gradient(180deg, #c9a84c 0%, #a87c2a 100%);
      border-radius: 0 0 24px 24px;
    }

    .hero-text {
      position: absolute; bottom: 52px; left: 36px; z-index: 20;
    }

    /* ── Loader ── */
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-ring {
      width: 40px; height: 40px;
      border: 2px solid var(--bg);
      border-top-color: var(--ink);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s ease both; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Cards ── */
    .prod-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .prod-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

    /* ── Slide-in panel ── */
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .panel { animation: slideIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }

    /* ── Modal ── */
    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalIn {
      from { opacity: 0; transform: translate(-50%,-46%) scale(0.93); }
      to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    }
    .modal { animation: modalIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
    .modal-overlay { animation: overlayIn 0.25s ease both; }

    .modal-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
    .modal-img:hover { transform: scale(1.06); }

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .modal-content-1 { animation: revealUp 0.35s 0.15s ease both; }
    .modal-content-2 { animation: revealUp 0.35s 0.22s ease both; }
    .modal-content-3 { animation: revealUp 0.35s 0.30s ease both; }
    .modal-content-4 { animation: revealUp 0.35s 0.38s ease both; }

    /* ── Pill button ── */
    .pill-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 99px;
      font-family: var(--font-body); font-size: 0.82rem; font-weight: 600;
      border: none; cursor: pointer; transition: background 0.2s, transform 0.15s;
    }
    .pill-btn:active { transform: scale(0.97); }
    .pill-btn--accent { background: var(--accent); color: #fff; }
    .pill-btn--accent:hover { background: var(--accent-h); }
    .pill-btn--ghost { background: ${dark ? 'rgba(255,255,255,0.08)' : '#ededea'}; color: var(--ink); }
    .pill-btn--ghost:hover { background: ${dark ? 'rgba(255,255,255,0.14)' : '#e2e2de'}; }
    .pill-btn--green { background: var(--green); color: #fff; }

    /* ── Icon btn ── */
    .icon-btn {
      width: 36px; height: 36px; border-radius: 10px;
      border: none; background: ${dark ? 'rgba(255,255,255,0.1)' : '#ededea'}; color: var(--ink);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 0.9rem; transition: background 0.15s;
    }
    .icon-btn:hover { background: ${dark ? 'rgba(255,255,255,0.18)' : '#ddddd9'}; }

    /* ── Form input ── */
    .form-input {
      width: 100%; padding: 13px 16px; border-radius: 12px;
      border: 1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e5e1'};
      background: ${dark ? 'rgba(255,255,255,0.05)' : 'var(--surface)'};
      font-family: var(--font-body); font-size: 0.9rem; color: var(--ink);
      transition: border-color 0.2s;
    }
    .form-input:focus { border-color: var(--accent); }
    .form-input::placeholder { color: var(--ink-3); }
    textarea.form-input { font-family: var(--font-body); }

    /* ── Category pill ── */
    .cat-pill {
      flex-shrink: 0; padding: 8px 16px; border-radius: 99px;
      font-size: 0.78rem; font-weight: 600; border: none; cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .cat-pill--off {
      background: ${dark ? 'rgba(255,255,255,0.07)' : 'var(--surface)'};
      color: var(--ink-2);
      box-shadow: var(--shadow-sm);
    }
    .cat-pill--on { background: var(--ink); color: ${dark ? '#111' : 'var(--surface)'}; }

    /* ── Dark mode toggle ── */
    .dark-toggle {
      width: 48px; height: 26px; border-radius: 99px; border: none; cursor: pointer;
      position: relative; transition: background 0.3s;
      background: ${dark ? 'var(--accent)' : '#d1d1ce'};
      flex-shrink: 0;
    }
    .dark-toggle::after {
      content: ''; position: absolute; top: 3px;
      left: ${dark ? '25px' : '3px'};
      width: 20px; height: 20px; border-radius: 50%;
      background: white; transition: left 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* ── Star rating ── */
    .star { cursor: pointer; transition: transform 0.15s; font-size: 1rem; }
    .star:hover { transform: scale(1.2); }

    /* ── Best seller badge ── */
    @keyframes badgePop {
      0%   { transform: scale(0.6) rotate(-12deg); opacity: 0; }
      60%  { transform: scale(1.1) rotate(2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .badge-best { animation: badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

    /* ── Horizontal scroll best sellers ── */
    .best-scroll {
      display: flex; gap: 16px; overflow-x: auto;
      padding-bottom: 12px; scrollbar-width: none;
    }
    .best-scroll::-webkit-scrollbar { display: none; }

    /* ── Transitions ── */
    * { transition-property: background-color, border-color, color; transition-duration: 0.25s; }
    .fish, .caustic-ray, .bubble, .seaweed { transition: none !important; }
  `}</style>
);

/* ─────────────────────────────────────────────
   LOADER
───────────────────────────────────────────── */
const Loader = () => (
  <div style={{
    position: 'fixed', inset: 0, background: 'var(--bg)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '28px', zIndex: 9999
  }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
        Distribuciones Ariza
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginTop: '6px', fontWeight: 400 }}>
        Cargando catálogo…
      </p>
    </div>
    <div className="loader-ring" />
  </div>
);

/* ─────────────────────────────────────────────
   FISH SVGs  (todos miran a la IZQUIERDA por defecto)
   swimRight usa scaleX(-1) para voltearlos → miran a la derecha
   swimLeft  no voltea   → miran izquierda  (dirección correcta)
───────────────────────────────────────────── */
/*
  Pez mirando claramente a la DERECHA:
  - Cola de abanico en la IZQUIERDA (x=0..18)
  - Cuerpo ovalado en el centro
  - Nariz puntiaguda en la DERECHA (x=76)
  - Ojo cerca del extremo derecho (x=62)

  swimRight = scaleX(1)  → mira derecha, va a la derecha ✓
  swimLeft  = scaleX(-1) → flip, mira izquierda, va a la izquierda ✓
*/
const FishSVG = ({ color = '#f97316', size = 40, accent = '#fbbf24' }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 80 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cola de abanico — IZQUIERDA */}
    <path d="M18 22 L0 4  L4 22  L0 40 Z" fill={accent} opacity="0.95"/>
    {/* Aleta dorsal — arriba */}
    <path d="M36 8 Q44 0 52 7 L50 14 Q44 10 36 14 Z" fill={accent} opacity="0.85"/>
    {/* Cuerpo principal */}
    <ellipse cx="44" cy="22" rx="28" ry="16" fill={color}/>
    {/* Brillo */}
    <ellipse cx="46" cy="17" rx="14" ry="7" fill="rgba(255,255,255,0.22)" transform="rotate(-10 46 17)"/>
    {/* Nariz puntiaguda — DERECHA */}
    <path d="M70 22 L58 14 L58 30 Z" fill={color}/>
    <path d="M76 22 L62 13 L62 31 Z" fill={accent} opacity="0.7"/>
    {/* Ojo — lado derecho del cuerpo */}
    <circle cx="60" cy="18" r="4.5" fill="white"/>
    <circle cx="61" cy="18" r="2.5" fill="#1a1a2e"/>
    <circle cx="61.8" cy="17" r="0.9" fill="white"/>
    {/* Escamas */}
    <path d="M38 10 Q36 22 38 34" stroke="rgba(0,0,0,0.09)" strokeWidth="1.4" fill="none"/>
    <path d="M28 13 Q26 22 28 31" stroke="rgba(0,0,0,0.07)" strokeWidth="1.2" fill="none"/>
  </svg>
);

const FishSmall = ({ color = '#06b6d4', size = 28 }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cola — IZQUIERDA */}
    <path d="M14 18 L0 4  L3 18  L0 32 Z" fill={color} opacity="0.8"/>
    {/* Cuerpo */}
    <ellipse cx="36" cy="18" rx="22" ry="13" fill={color}/>
    <ellipse cx="37" cy="13" rx="11" ry="6" fill="rgba(255,255,255,0.22)" transform="rotate(-8 37 13)"/>
    {/* Nariz — DERECHA */}
    <path d="M60 18 L50 11 L50 25 Z" fill={color} opacity="0.8"/>
    {/* Ojo — lado derecho */}
    <circle cx="49" cy="14" r="3.8" fill="white"/>
    <circle cx="50" cy="14" r="2" fill="#1a1a2e"/>
    <circle cx="50.7" cy="13.2" r="0.7" fill="white"/>
  </svg>
);

const FISH_DATA = [
  { id:1, color:'#f97316', accent:'#fbbf24', size:48, top:'22%', dir:'r', duration:'18s', delay:'0s'  },
  { id:2, color:'#ec4899', accent:'#f9a8d4', size:38, top:'45%', dir:'l', duration:'22s', delay:'4s'  },
  { id:3, color:'#06b6d4', accent:'#67e8f9', size:54, top:'30%', dir:'r', duration:'26s', delay:'8s'  },
  { id:4, color:'#a855f7', accent:'#d8b4fe', size:34, top:'58%', dir:'l', duration:'19s', delay:'2s'  },
  { id:5, color:'#22c55e', accent:'#86efac', size:42, top:'15%', dir:'l', duration:'30s', delay:'12s' },
  { id:6, color:'#f59e0b', accent:'#fde68a', size:30, top:'68%', dir:'r', duration:'16s', delay:'6s'  },
  { id:7, color:'#38bdf8', accent:'#bae6fd', size:26, top:'38%', dir:'r', duration:'24s', delay:'15s' },
  { id:8, color:'#fb923c', accent:'#fed7aa', size:44, top:'52%', dir:'l', duration:'20s', delay:'9s'  },
];

const BUBBLE_DATA = [
  { left:'12%', bottom:'40px', size:6,  delay:'0s',   dur:'6s'   },
  { left:'28%', bottom:'40px', size:9,  delay:'2s',   dur:'8s'   },
  { left:'45%', bottom:'40px', size:5,  delay:'1s',   dur:'7s'   },
  { left:'62%', bottom:'40px', size:8,  delay:'3s',   dur:'9s'   },
  { left:'78%', bottom:'40px', size:6,  delay:'0.5s', dur:'6.5s' },
  { left:'90%', bottom:'40px', size:10, delay:'4s',   dur:'10s'  },
];
const RAYS = [8, 18, 30, 42, 55, 66, 78, 88];
const SEAWEEDS = [
  { left:'6%',  h:80, w:14, color:'#16a34a', delay:'0s',   dur:'3.5s' },
  { left:'14%', h:60, w:10, color:'#15803d', delay:'0.5s', dur:'4s'   },
  { left:'72%', h:90, w:15, color:'#166534', delay:'1s',   dur:'3.8s' },
  { left:'82%', h:55, w:10, color:'#16a34a', delay:'0.3s', dur:'4.2s' },
  { left:'91%', h:70, w:12, color:'#15803d', delay:'0.8s', dur:'3.6s' },
];
const PEBBLES = [
  { left:'5%',  size:12, color:'#92400e' }, { left:'18%', size:8,  color:'#78350f' },
  { left:'35%', size:14, color:'#92400e' }, { left:'52%', size:9,  color:'#a16207' },
  { left:'65%', size:11, color:'#78350f' }, { left:'80%', size:13, color:'#92400e' },
  { left:'94%', size:7,  color:'#a16207' },
];

/* ─────────────────────────────────────────────
   AQUARIUM HERO
───────────────────────────────────────────── */
const AquariumHero = ({ busqueda, setBusqueda }) => (
  <div className="aquarium-hero">
    {RAYS.map((l, i) => (
      <div key={i} className="caustic-ray" style={{ left:`${l}%`, animationDelay:`${i*0.6}s`, animationDuration:`${3.5+i*0.3}s` }} />
    ))}
    <div className="water-surface" />
    {SEAWEEDS.map((s, i) => (
      <div key={i} className="seaweed" style={{ position:'absolute', bottom:'36px', left:s.left, width:s.w, height:s.h, background:`linear-gradient(180deg,${s.color} 0%,#14532d 100%)`, borderRadius:'6px 6px 2px 2px', animationDelay:s.delay, animationDuration:s.dur, zIndex:3 }}/>
    ))}
    {PEBBLES.map((p, i) => (
      <div key={i} style={{ position:'absolute', bottom:`${36+(i%2)*4}px`, left:p.left, width:p.size, height:p.size*0.65, background:p.color, borderRadius:'50%', opacity:0.85, zIndex:4 }}/>
    ))}
    <div className="tank-sand" />
    {BUBBLE_DATA.map((b, i) => (
      <div key={i} className="bubble" style={{ left:b.left, bottom:b.bottom, width:b.size, height:b.size, animationDelay:b.delay, animationDuration:b.dur, zIndex:5 }}/>
    ))}
    {FISH_DATA.map(f => (
      <div key={f.id} className={`fish fish-${f.dir}`} style={{ top:f.top, zIndex:10, animationDuration:f.duration, animationDelay:f.delay }}>
        {f.size > 36
          ? <FishSVG color={f.color} accent={f.accent} size={f.size}/>
          : <FishSmall color={f.color} size={f.size}/>
        }
      </div>
    ))}
    <div className="hero-text" style={{ zIndex:20 }}>
      <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.8px', color:'rgba(255,255,255,0.7)', marginBottom:'8px' }}>
        Tienda en línea
      </p>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4.5vw,2.8rem)', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:'20px', textShadow:'0 2px 12px rgba(0,0,0,0.35)' }}>
        Todo para tus<br/>peces y hámsters.
      </h1>
      <div style={{ position:'relative', maxWidth:'320px' }}>
        <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', opacity:0.55 }}>🔍</span>
        <input
          type="text" placeholder="Buscar productos…"
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ width:'100%', padding:'13px 18px 13px 40px', borderRadius:'99px', border:'none', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)', color:'#fff', fontFamily:'var(--font-body)', fontSize:'0.88rem', outline:'none' }}
        />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   STAR RATING COMPONENT
───────────────────────────────────────────── */
const StarRating = ({ productId, ratings, onRate, readonly = false, size = '1rem' }) => {
  const [hover, setHover] = useState(0);
  const current = ratings[productId] || 0;
  return (
    <div style={{ display:'flex', gap:'2px', alignItems:'center' }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={readonly ? '' : 'star'}
          style={{ fontSize:size, color: (hover || current) >= star ? 'var(--gold)' : 'var(--ink-3)', lineHeight:1, cursor: readonly ? 'default' : 'pointer' }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate(productId, star)}
        >★</span>
      ))}
      {current > 0 && !readonly && (
        <span style={{ fontSize:'0.7rem', color:'var(--ink-3)', marginLeft:'4px' }}>{current}/5</span>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   DESCRIPCIONES
───────────────────────────────────────────── */
const DESCRIPCIONES = {
  "Acuaprime 30ml":    { resumen:"Eliminador instantáneo de cloro y metales pesados.", cuerpo:"Ideal para acondicionar el agua de grifo de forma inmediata. Protege la mucosa de los peces y es perfecto para nano-acuarios o viajes.", uso:"Aplicar en cada cambio de agua." },
  "Acuaprime 120ml":   { resumen:"Protección total en cada cambio de agua.", cuerpo:"Acondicionador completo que neutraliza cloro, cloraminas y metales pesados. Reduce el estrés en peces nuevos.", uso:"Dosificar según litraje en cada recambio." },
  "Acuaprime 240ml":   { resumen:"Protección eficiente para acuarios medianos.", cuerpo:"Fórmula concentrada de alta eficiencia, apta para agua dulce y salada.", uso:"Añadir al agua nueva antes de ingresarla al tanque." },
  "Acuaprime Litro":   { resumen:"Máximo ahorro para grandes volúmenes.", cuerpo:"La opción preferida por criadores. Neutralización química inmediata al mejor costo por litro.", uso:"Ideal para cambios de agua masivos." },
  "Cycle 30ml":        { resumen:"Suplemento biológico para un inicio seguro.", cuerpo:"Bacterias vivas que establecen el ciclo del nitrógeno. Evita picos de amoníaco en acuarios nuevos.", uso:"Aplicar durante los primeros días del montaje." },
  "Cycle 120ml":       { resumen:"Ecosistema saludable de forma inmediata.", cuerpo:"Elimina amoníaco y nitritos tóxicos. Úsalo también después de limpiar el filtro.", uso:"Agitar bien y dosificar semanalmente." },
  "Cycle 240ml":       { resumen:"Control biológico para acuarios establecidos.", cuerpo:"Asegura filtración biológica robusta y agua cristalina. Ayuda a degradar restos orgánicos.", uso:"Dosificar proporcionalmente al volumen." },
  "Cycle Litro":       { resumen:"Rendimiento profesional para sistemas grandes.", cuerpo:"Millones de bacterias benéficas por ml. 100% natural, imposible de sobredosificar.", uso:"Ideal para reactivar filtros tras medicaciones." },
  "Test Plus Ultra PH":{ resumen:"Medidor de PH con máxima precisión.", cuerpo:"Monitorea el parámetro más crítico para la vida acuática. Escala de colores detallada para lecturas exactas.", uso:"Comparar la muestra con la tabla colorimétrica." },
  "Alga Clear 20ml":   { resumen:"Controla algas indeseadas de forma segura.", cuerpo:"Mantiene el cristal y decoraciones limpias. Actúa sobre algas en suspensión causadas por luz solar.", uso:"Usar preventivamente si el acuario recibe luz indirecta." },
  "Clarify 20ml":      { resumen:"Agua cristalina en minutos.", cuerpo:"Agrupa partículas en suspensión para que el filtro las atrape. No altera los parámetros químicos.", uso:"Aplicar cuando el agua se vea opaca o blanquecina." },
  "Clarify 60ml":      { resumen:"Tratamiento avanzado para claridad total.", cuerpo:"Elimina turbidez mecánica causada por sustrato o desechos. Resultados visibles muy rápido.", uso:"Asegurar buena oxigenación durante el proceso." },
  "Antihongos 30ml":   { resumen:"Previene y trata infecciones fúngicas.", cuerpo:"Evita que heridas físicas se conviertan en infecciones. Seguro para la mayoría de peces de ornato.", uso:"Aplicar ante los primeros síntomas visuales." },
  "Tratamiento de agua ICK 30 ml": { resumen:"Alivio contra el Punto Blanco.", cuerpo:"Combate el parásito causante del ICK. Alivia la irritación en piel y branquias.", uso:"Seguir el tratamiento completo aunque desaparezcan los puntos." },
  "Antihongos":        { resumen:"Protección fúngica reforzada.", cuerpo:"Detiene la propagación de esporas en el agua. Útil para desinfectar redes o accesorios.", uso:"Dosificación estándar para prevención general." },
};

/* ─────────────────────────────────────────────
   COLECCIONES
───────────────────────────────────────────── */
const COLECCIONES = [
  { label:'Líquidos',   val:'Líquidos vitales',             icon:'💧' },
  { label:'Comida',     val:'Alimentos',                    icon:'🫙' },
  { label:'Vacaciones', val:'Productos para tus vacaciones', icon:'🏖️' },
  { label:'Accesorios', val:'Accesorios',                   icon:'🎨' },
  { label:'Equipos',    val:'Equipos',                      icon:'⚙️' },
  { label:'Hámsters',   val:'Accesorios para hamsters',     icon:'🐹' },
];

/* IDs or names of best-seller products (top 5 for the special section) */
const BEST_SELLER_NAMES = [
  'Acuaprime 120ml', 'Cycle 120ml', 'Alga Clear 20ml',
  'Clarify 20ml', 'Test Plus Ultra PH',
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const BACKEND = "https://distriariza.onrender.com";

const moneda = (v) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits:0 }).format(v);

const imgSrc = (url) =>
  !url ? 'https://via.placeholder.com/300' : url.startsWith('http') ? url : `${BACKEND}/productos/${url}`;

const normaliza = (s) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();

/* ─────────────────────────────────────────────
   STEPPER
───────────────────────────────────────────── */
const Stepper = ({ value, onAdd, onRemove, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
    <button className="icon-btn" onClick={onRemove} aria-label="Restar">−</button>
    <input
      type="number" min="1" value={value}
      onChange={(e) => { const v=parseInt(e.target.value); if(!isNaN(v) && v>=0) onChange(v); }}
      style={{ width:'36px', textAlign:'center', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'5px 0', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.9rem', background:'transparent', color:'var(--ink)' }}
    />
    <button className="icon-btn" onClick={onAdd} aria-label="Sumar">+</button>
  </div>
);

/* ─────────────────────────────────────────────
   BEST SELLER CARD  (horizontal scroll)
───────────────────────────────────────────── */
const BestCard = ({ p, onAdd, onOpen, ratings, onRate, rank }) => (
  <div
    className="prod-card"
    style={{ background:'var(--card-bg)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow-sm)', flexShrink:0, width:'200px' }}
  >
    <div style={{ position:'relative' }}>
      <div
        onClick={() => onOpen(p)}
        style={{ background:'var(--bg)', height:'150px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:'16px', borderRadius:'20px 20px 0 0' }}
      >
        <img src={imgSrc(p.imagen_url)} alt={p.nombre} style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain', transition:'transform 0.3s ease' }}
          onMouseOver={e => e.currentTarget.style.transform='scale(1.08)'}
          onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
        />
      </div>
      {/* rank badge */}
      <div className="badge-best" style={{ position:'absolute', top:'10px', left:'10px', background: rank===1 ? '#f59e0b' : rank===2 ? '#94a3b8' : rank===3 ? '#cd7c3a' : 'var(--accent)', color:'#fff', borderRadius:'99px', padding:'3px 10px', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.5px', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
        #{rank} más vendido
      </div>
    </div>
    <div style={{ padding:'12px 14px 14px' }}>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'0.82rem', fontWeight:500, cursor:'pointer', marginBottom:'6px', lineHeight:1.3, color:'var(--ink)' }}>
        {p.nombre}
      </h4>
      <StarRating productId={p.id} ratings={ratings} onRate={onRate} size="0.85rem" />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px' }}>
        <span style={{ fontSize:'0.95rem', fontWeight:600, color:'var(--ink)' }}>{moneda(p.precio)}</span>
        <button className="pill-btn pill-btn--accent" onClick={() => onAdd(p)} style={{ padding:'6px 12px', fontSize:'0.72rem' }}>
          + Añadir
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
const ProductCard = ({ p, onAdd, onOpen, ratings, onRate, isBestSeller }) => (
  <div className="prod-card fade-up" style={{ background:'var(--card-bg)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow-sm)', position:'relative' }}>
    {isBestSeller && (
      <div className="badge-best" style={{ position:'absolute', top:'10px', right:'10px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'3px 9px', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.5px', zIndex:5, boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
        🔥 Top
      </div>
    )}
    <div
      onClick={() => onOpen(p)}
      style={{ background:'var(--bg)', height:'200px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:'20px', overflow:'hidden', borderRadius:'20px 20px 0 0', transition:'background 0.2s' }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--border)'}
      onMouseOut={e => e.currentTarget.style.background = 'var(--bg)'}
    >
      <img src={imgSrc(p.imagen_url)} alt={p.nombre}
        style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain', transition:'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onMouseOver={e => e.currentTarget.style.transform='scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
      />
    </div>
    <div style={{ padding:'16px 18px 18px' }}>
      <p style={{ fontSize:'0.68rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'4px' }}>
        {p.categoria_nombre}
      </p>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'0.95rem', fontWeight:500, color:'var(--ink)', cursor:'pointer', marginBottom:'8px', lineHeight:1.3 }}>
        {p.nombre}
      </h4>
      <div style={{ marginBottom:'12px' }}>
        <StarRating productId={p.id} ratings={ratings} onRate={onRate} size="0.9rem" />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'1.1rem', fontWeight:600, color:'var(--ink)' }}>{moneda(p.precio)}</span>
        <button className="pill-btn pill-btn--accent" onClick={() => onAdd(p)} style={{ padding:'8px 16px', fontSize:'0.78rem' }}>
          + Añadir
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PRODUCT MODAL
───────────────────────────────────────────── */
const ProductModal = ({ p, onClose, onAdd, ratings, onRate }) => {
  const desc = DESCRIPCIONES[p.nombre];
  const isBest = BEST_SELLER_NAMES.includes(p.nombre);
  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(10,10,10,0.6)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:3000 }} />
      <div className="modal" style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'90%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto', background:'var(--surface)', zIndex:3001, borderRadius:'28px', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(128,128,128,0.15)', border:'none', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'0.85rem', color:'var(--ink-2)', zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background='rgba(128,128,128,0.25)'}
          onMouseOut={e => e.currentTarget.style.background='rgba(128,128,128,0.15)'}
        >✕</button>

        <div style={{ background:'var(--bg)', borderRadius:'28px 28px 0 0', padding:'36px 28px 28px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'220px', overflow:'hidden', position:'relative' }}>
          {isBest && (
            <div style={{ position:'absolute', top:'14px', left:'14px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'4px 12px', fontSize:'0.66rem', fontWeight:700, letterSpacing:'0.5px' }}>
              🔥 Más vendido
            </div>
          )}
          <img className="modal-img" src={imgSrc(p.imagen_url)} alt={p.nombre} style={{ maxHeight:'200px', maxWidth:'100%', objectFit:'contain', display:'block' }} />
        </div>

        <div style={{ padding:'24px 28px 28px' }}>
          <p className="modal-content-1" style={{ fontSize:'0.68rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:'6px' }}>
            {p.categoria_nombre}
          </p>
          <h2 className="modal-content-2" style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', marginBottom:'10px', lineHeight:1.2 }}>
            {p.nombre}
          </h2>

          {/* Stars in modal */}
          <div className="modal-content-2" style={{ marginBottom:'18px' }}>
            <p style={{ fontSize:'0.7rem', color:'var(--ink-3)', fontWeight:600, marginBottom:'6px' }}>TU VALORACIÓN</p>
            <StarRating productId={p.id} ratings={ratings} onRate={onRate} size="1.3rem" />
          </div>

          <div className="modal-content-3" style={{ color:'var(--ink-2)', fontSize:'0.9rem', lineHeight:1.75, marginBottom:'28px' }}>
            {desc ? (
              <>
                <p style={{ color:'var(--ink)', fontWeight:500, marginBottom:'10px' }}>{desc.resumen}</p>
                <p style={{ marginBottom:'14px' }}>{desc.cuerpo}</p>
                <div style={{ background:'var(--bg)', borderRadius:'12px', padding:'12px 16px', fontSize:'0.82rem' }}>
                  <span style={{ color:'var(--ink-2)', fontWeight:600 }}>Modo de uso: </span>
                  <span style={{ color:'var(--ink-2)' }}>{desc.uso}</span>
                </div>
              </>
            ) : (
              <p>{p.descripcion || 'Calidad garantizada para tu mascota.'}</p>
            )}
          </div>

          <div className="modal-content-4" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'20px' }}>
            <div>
              <p style={{ fontSize:'0.68rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'3px' }}>Precio</p>
              <span style={{ fontSize:'1.6rem', fontWeight:600, color:'var(--ink)', letterSpacing:'-0.5px' }}>{moneda(p.precio)}</span>
            </div>
            <button className="pill-btn pill-btn--accent" onClick={() => { onAdd(p); onClose(); }} style={{ padding:'14px 28px', fontSize:'0.9rem' }}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   CART PANEL
───────────────────────────────────────────── */
const CartPanel = ({ carrito, onClose, onAdd, onRemove, onChangeQty, totalCompra, totalItems }) => {
  const [paso, setPaso] = useState('lista');
  const [datos, setDatos] = useState({ nombre:'', direccion:'', ciudad:'', telefono:'' });

  const enviarWhatsApp = () => {
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad})`).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n*Cliente:* ${datos.nombre}\n*Dirección:* ${datos.direccion}\n*Ciudad:* ${datos.ciudad}\n*Teléfono:* ${datos.telefono}\n\n*Productos:*\n${lista}\n\n*Total: ${moneda(totalCompra)}*`;
    window.open(`https://wa.me/573219627376?text=${encodeURIComponent(msg)}`, '_blank');
    setPaso('confirmado');
  };

  return (
    <>
      <div onClick={() => { onClose(); setPaso('lista'); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1500 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'400px', height:'100%', background:'var(--surface)', zIndex:2000, display:'flex', flexDirection:'column' }}>
        {/* header */}
        <div style={{ display:'flex', alignItems:'center', padding:'24px 28px', borderBottom:'1px solid var(--border)' }}>
          {paso === 'envio' && (
            <button onClick={() => setPaso('lista')} style={{ background:'none', border:'none', cursor:'pointer', marginRight:'14px', fontSize:'1.1rem', color:'var(--ink-2)' }}>←</button>
          )}
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:700, color:'var(--ink)', flex:1 }}>
            {paso === 'lista' ? 'Carrito' : paso === 'envio' ? 'Datos de entrega' : '¡Listo!'}
          </h2>
          {totalItems > 0 && paso === 'lista' && (
            <span style={{ fontSize:'0.75rem', color:'var(--ink-3)', marginRight:'12px' }}>{totalItems} {totalItems===1?'producto':'productos'}</span>
          )}
          <button onClick={() => { onClose(); setPaso('lista'); }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'var(--ink-2)' }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          {paso === 'lista' && (
            carrito.length === 0
              ? <div style={{ textAlign:'center', marginTop:'60px' }}><p style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🛒</p><p style={{ color:'var(--ink-3)', fontSize:'0.9rem' }}>Tu carrito está vacío.</p></div>
              : carrito.map(item => (
                <div key={item.id} style={{ display:'flex', gap:'14px', alignItems:'center', paddingBlock:'16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ background:'var(--bg)', borderRadius:'12px', padding:'8px', flexShrink:0 }}>
                    <img src={imgSrc(item.imagen_url)} alt={item.nombre} style={{ width:'52px', height:'52px', objectFit:'contain' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'0.85rem', fontWeight:500, marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--ink)' }}>{item.nombre}</p>
                    <p style={{ fontSize:'0.82rem', color:'var(--ink-2)' }}>{moneda(item.precio * item.cantidad)}</p>
                  </div>
                  <Stepper value={item.cantidad} onAdd={() => onAdd(item)} onRemove={() => onRemove(item.id)} onChange={(v) => onChangeQty(item.id, v)} />
                </div>
              ))
          )}

          {paso === 'envio' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'4px' }}>
              {[{key:'nombre',ph:'Nombre completo'},{key:'direccion',ph:'Dirección'},{key:'ciudad',ph:'Ciudad'},{key:'telefono',ph:'Teléfono'}].map(({ key, ph }) => (
                <input key={key} className="form-input" placeholder={ph} value={datos[key]} onChange={e => setDatos(d => ({...d,[key]:e.target.value}))} />
              ))}
            </div>
          )}

          {paso === 'confirmado' && (
            <div style={{ textAlign:'center', padding:'60px 16px' }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>✅</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:'8px', color:'var(--ink)' }}>Pedido enviado</h3>
              <p style={{ color:'var(--ink-3)', fontSize:'0.9rem', marginBottom:'28px' }}>Te contactaremos pronto por WhatsApp.</p>
              <button className="pill-btn pill-btn--ghost" onClick={() => { onClose(); setPaso('lista'); }} style={{ width:'100%', justifyContent:'center', padding:'14px' }}>
                Volver a la tienda
              </button>
            </div>
          )}
        </div>

        {carrito.length > 0 && paso !== 'confirmado' && (
          <div style={{ padding:'20px 28px', borderTop:'1px solid var(--border)', background:'var(--surface)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'16px' }}>
              <span style={{ fontSize:'0.82rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>Total</span>
              <span style={{ fontSize:'1.4rem', fontWeight:600, color:'var(--ink)' }}>{moneda(totalCompra)}</span>
            </div>
            <button
              className={`pill-btn ${paso==='lista'?'pill-btn--accent':'pill-btn--green'}`}
              onClick={paso==='lista' ? () => setPaso('envio') : enviarWhatsApp}
              style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:'0.9rem' }}
            >
              {paso==='lista' ? 'Continuar' : 'Pedir por WhatsApp →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   RESEÑAS INICIALES (pre-cargadas)
───────────────────────────────────────────── */
const REVIEWS_INICIALES = [
  {
    id: 'r1', nombre: 'Valentina Ospina', avatar: '🐠', estrellas: 5,
    fecha: 'hace 2 días',
    texto: 'Llevo 3 años comprando en Distribuciones Ariza y nunca me han fallado. El Acuaprime es increíble, mis peces nunca han estado tan saludables. El envío fue súper rápido y el empaque llegó perfecto. ¡100% recomendado!',
    producto: 'Acuaprime 120ml',
  },
  {
    id: 'r2', nombre: 'Carlos Mendoza', avatar: '🐡', estrellas: 5,
    fecha: 'hace 5 días',
    texto: 'Compré el Cycle para iniciar mi primer acuario plantado y los resultados son sorprendentes. El agua cristalina desde la primera semana, sin pico de amoniaco. El asesoramiento que dan por WhatsApp también es excelente.',
    producto: 'Cycle 120ml',
  },
  {
    id: 'r3', nombre: 'Mariana Ríos', avatar: '🐹', estrellas: 5,
    fecha: 'hace 1 semana',
    texto: 'Los accesorios para mi hámster son de muy buena calidad, se nota que son productos pensados en el bienestar del animal. Mi Coco está feliz desde que llegó su nueva rueda. El precio es justo y la atención al cliente es de primera.',
    producto: 'Accesorios para hamsters',
  },
  {
    id: 'r4', nombre: 'Andrés Castaño', avatar: '🐟', estrellas: 5,
    fecha: 'hace 2 semanas',
    texto: 'El Alga Clear salvó mi acuario. Tenía una plaga de algas horrible por el sol de la ventana y en menos de 4 días desapareció completamente sin afectar a mis peces. Definitivamente el mejor producto para ese problema.',
    producto: 'Alga Clear 20ml',
  },
  {
    id: 'r5', nombre: 'Luisa Fernanda Torres', avatar: '🦈', estrellas: 5,
    fecha: 'hace 3 semanas',
    texto: 'Excelente tienda. Tienen todo lo que necesito en un solo lugar, desde tratamientos hasta comida especializada. Los productos son originales y de marcas confiables. Mi acuario marino lleva 2 años perfecto gracias a Ariza.',
    producto: 'Clarify 60ml',
  },
  {
    id: 'r6', nombre: 'Santiago Gómez', avatar: '🐠', estrellas: 5,
    fecha: 'hace 1 mes',
    texto: 'Pedí por WhatsApp y me respondieron en minutos. El proceso de compra fue muy fácil, el pago seguro y el producto llegó bien sellado y en perfecto estado. El Clarify hace exactamente lo que promete, agua como vidrio.',
    producto: 'Clarify 20ml',
  },
];

/* ─────────────────────────────────────────────
   REVIEWS SECTION COMPONENT
───────────────────────────────────────────── */
const ReviewsSection = ({ dark }) => {
  const STORAGE_KEY = 'ariza_reviews_v1';

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge: user reviews first, then any initial ones not already present
        const userIds = new Set(parsed.map(r => r.id));
        const missing = REVIEWS_INICIALES.filter(r => !userIds.has(r.id));
        return [...parsed, ...missing];
      }
    } catch (_) {}
    return REVIEWS_INICIALES;
  });

  const [nombre, setNombre]       = useState('');
  const [texto, setTexto]         = useState('');
  const [producto, setProducto]   = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [enviado, setEnviado]     = useState(false);
  const [error, setError]         = useState('');

  const avatares = ['🐠','🐡','🐟','🦈','🐙','🐬','🦑','🐹','🐾'];

  // Persist to localStorage whenever reviews change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); } catch (_) {}
  }, [reviews]);

  const handleSubmit = () => {
    if (!nombre.trim())  return setError('Por favor ingresa tu nombre.');
    if (estrellas === 0) return setError('Por favor selecciona una calificación.');
    if (texto.trim().length < 10) return setError('Escribe un comentario más detallado (mínimo 10 caracteres).');
    setError('');
    const nueva = {
      id: `r${Date.now()}`,
      nombre: nombre.trim(),
      avatar: avatares[Math.floor(Math.random() * avatares.length)],
      estrellas,
      fecha: 'justo ahora',
      texto: texto.trim(),
      producto: producto.trim() || 'Producto general',
    };
    setReviews(prev => [nueva, ...prev]);
    setNombre(''); setTexto(''); setProducto(''); setEstrellas(0);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
  };

  const promedioEstrellas = (reviews.reduce((s, r) => s + r.estrellas, 0) / reviews.length).toFixed(1);

  return (
    <section style={{ marginTop: '72px', marginBottom: '80px' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
        <span style={{ fontSize:'1.3rem' }}>💬</span>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:700, color:'var(--ink)' }}>
          Reseñas de clientes
        </h2>
        <div style={{ flex:1, height:'1px', background:'var(--border)', marginLeft:'8px' }} />
      </div>

      {/* ── Rating summary ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'20px', background:'var(--card-bg)', borderRadius:'20px', padding:'24px 28px', marginBottom:'32px', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ textAlign:'center', flexShrink:0 }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'3.2rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>{promedioEstrellas}</p>
          <div style={{ display:'flex', gap:'2px', justifyContent:'center', margin:'6px 0' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize:'1.1rem', color: s <= Math.round(promedioEstrellas) ? 'var(--gold)' : 'var(--ink-3)' }}>★</span>
            ))}
          </div>
          <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600 }}>{reviews.length} reseñas</p>
        </div>
        <div style={{ flex:1 }}>
          {[5,4,3,2,1].map(s => {
            const count = reviews.filter(r => r.estrellas === s).length;
            const pct   = Math.round((count / reviews.length) * 100);
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px' }}>
                <span style={{ fontSize:'0.72rem', color:'var(--ink-3)', width:'8px', textAlign:'right' }}>{s}</span>
                <span style={{ fontSize:'0.7rem', color:'var(--gold)' }}>★</span>
                <div style={{ flex:1, height:'6px', background:'var(--bg)', borderRadius:'99px', overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'var(--gold)', borderRadius:'99px', transition:'width 0.6s ease' }} />
                </div>
                <span style={{ fontSize:'0.68rem', color:'var(--ink-3)', width:'28px' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FORM ── */}
      <div style={{ background:'var(--card-bg)', borderRadius:'20px', padding:'28px', marginBottom:'36px', boxShadow:'var(--shadow-sm)', border:`1px solid var(--border)` }}>
        <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)', marginBottom:'18px' }}>Deja tu reseña</h3>

        {/* Star picker */}
        <div style={{ marginBottom:'16px' }}>
          <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'8px' }}>Tu calificación *</p>
          <div style={{ display:'flex', gap:'6px' }}>
            {[1,2,3,4,5].map(s => (
              <span
                key={s}
                className="star"
                style={{ fontSize:'1.8rem', color:(hoverStar||estrellas) >= s ? 'var(--gold)' : 'var(--ink-3)', cursor:'pointer', lineHeight:1, transition:'color 0.15s, transform 0.15s' }}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setEstrellas(s)}
              >★</span>
            ))}
            {estrellas > 0 && (
              <span style={{ fontSize:'0.8rem', color:'var(--ink-3)', alignSelf:'center', marginLeft:'6px' }}>
                {['','Malo 😕','Regular 😐','Bueno 🙂','Muy bueno 😊','¡Excelente! 🤩'][estrellas]}
              </span>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
          <div>
            <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Tu nombre *</p>
            <input className="form-input" placeholder="Ej: María González" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Producto (opcional)</p>
            <input className="form-input" placeholder="Ej: Acuaprime 120ml" value={producto} onChange={e => setProducto(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom:'16px' }}>
          <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Tu comentario *</p>
          <textarea
            className="form-input"
            placeholder="Cuéntanos tu experiencia con el producto o la tienda..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            rows={4}
            style={{ resize:'vertical', minHeight:'100px', lineHeight:1.6 }}
          />
          <p style={{ fontSize:'0.68rem', color: texto.length < 10 && texto.length > 0 ? '#ef4444' : 'var(--ink-3)', marginTop:'4px', textAlign:'right' }}>
            {texto.length} / mínimo 10 caracteres
          </p>
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', fontSize:'0.82rem', color:'#ef4444' }}>
            {error}
          </div>
        )}

        {enviado && (
          <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', fontSize:'0.82rem', color:'#16a34a', display:'flex', alignItems:'center', gap:'8px' }}>
            ✅ ¡Gracias por tu reseña! Ya está publicada.
          </div>
        )}

        <button className="pill-btn pill-btn--accent" onClick={handleSubmit} style={{ padding:'12px 28px', fontSize:'0.88rem' }}>
          Publicar reseña
        </button>
      </div>

      {/* ── REVIEW CARDS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px' }}>
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className="fade-up"
            style={{ background:'var(--card-bg)', borderRadius:'18px', padding:'22px 24px', boxShadow:'var(--shadow-sm)', border:`1px solid var(--border)`, animationDelay:`${i * 0.04}s` }}
          >
            {/* Header de la reseña */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'50%', background: dark ? 'rgba(255,255,255,0.08)' : '#f0f0ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                {r.avatar}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.nombre}</p>
                <p style={{ fontSize:'0.68rem', color:'var(--ink-3)', marginTop:'1px' }}>{r.fecha}</p>
              </div>
              {/* Stars */}
              <div style={{ display:'flex', gap:'1px', flexShrink:0 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize:'0.78rem', color: s <= r.estrellas ? 'var(--gold)' : 'var(--ink-3)' }}>★</span>
                ))}
              </div>
            </div>

            {/* Texto */}
            <p style={{ fontSize:'0.86rem', color:'var(--ink-2)', lineHeight:1.7, marginBottom:'12px' }}>
              "{r.texto}"
            </p>

            {/* Producto */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background: dark ? 'rgba(26,92,255,0.15)' : 'rgba(26,92,255,0.07)', borderRadius:'99px', padding:'4px 10px' }}>
              <span style={{ fontSize:'0.6rem' }}>🛒</span>
              <span style={{ fontSize:'0.68rem', fontWeight:600, color:'var(--accent)' }}>{r.producto}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default function App() {
  const [productos, setProductos]   = useState([]);
  const [carrito, setCarrito]       = useState([]);
  const [error, setError]           = useState(null);
  const [cartOpen, setCartOpen]     = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda]     = useState('');
  const [categoria, setCategoria]   = useState('Todos');
  const [cargando, setCargando]     = useState(true);
  const [dark, setDark]             = useState(false);
  const [ratings, setRatings]       = useState({});   // { [productId]: 1-5 }

  useEffect(() => {
    axios.get(`${BACKEND}/api/productos`)
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setTimeout(() => setCargando(false), 1600));
  }, []);

  /* helpers */
  const addItem = useCallback((p) =>
    setCarrito(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id===p.id ? {...i, cantidad:i.cantidad+1} : i) : [...prev, {...p, cantidad:1}];
    }), []);

  const removeOne = (id) =>
    setCarrito(prev => prev.map(i => i.id===id ? {...i, cantidad:i.cantidad-1} : i).filter(i => i.cantidad>0));

  const setQty = (id, v) =>
    setCarrito(prev => prev.map(i => i.id===id ? {...i, cantidad:v} : i).filter(i => i.cantidad>0));

  const handleRate = (productId, stars) =>
    setRatings(prev => ({...prev, [productId]: stars}));

  const totalItems  = carrito.reduce((s,i) => s+i.cantidad, 0);
  const totalCompra = carrito.reduce((s,i) => s+Math.round(Number(i.precio))*i.cantidad, 0);

  /* best sellers */
  const bestSellers = BEST_SELLER_NAMES
    .map(name => productos.find(p => p.nombre === name))
    .filter(Boolean)
    .slice(0, 5);

  /* filter */
  const visibles = productos.filter(p => {
    const matchBusq = normaliza(p.nombre).includes(normaliza(busqueda));
    if (categoria === 'Todos') return matchBusq;
    const cat = normaliza(p.categoria_nombre);
    const flt = normaliza(categoria);
    return matchBusq && (cat === flt || cat.includes(flt) || flt.includes(cat));
  });

  if (cargando) return (<><GlobalStyles dark={dark}/><Loader /></>);

  return (
    <>
      <GlobalStyles dark={dark}/>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'sticky', top:0, zIndex:1000,
        background: dark ? 'rgba(17,17,21,0.9)' : 'rgba(245,244,241,0.88)',
        backdropFilter:'blur(16px)',
        borderBottom:`1px solid var(--border)`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 28px', height:'64px'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <img src="/Logo.jpeg" alt="Logo" style={{ height:'38px', width:'38px', borderRadius:'10px', objectFit:'cover' }} onError={e => e.target.src='https://via.placeholder.com/38?text=A'} />
          <div>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>Distribuciones Ariza</p>
            <p style={{ fontSize:'0.58rem', color:'var(--accent)', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginTop:'2px' }}>Fish Accessories</p>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          {/* Dark mode toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'0.75rem', color:'var(--ink-3)' }}>{dark ? '🌙' : '☀️'}</span>
            <button className="dark-toggle" onClick={() => setDark(d => !d)} aria-label="Modo oscuro" />
          </div>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} style={{ position:'relative', background:'none', border:'none', cursor:'pointer', padding:'8px', borderRadius:'12px' }}>
            <span style={{ fontSize:'1.25rem' }}>🛒</span>
            {totalItems > 0 && (
              <span style={{ position:'absolute', top:'2px', right:'2px', background:'var(--accent)', color:'#fff', fontSize:'0.6rem', fontWeight:700, width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid var(--bg)` }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 24px 120px' }}>

        {/* ── AQUARIUM HERO ── */}
        <AquariumHero busqueda={busqueda} setBusqueda={setBusqueda} />

        {/* ── BEST SELLERS ── */}
        {bestSellers.length > 0 && (
          <section style={{ marginBottom:'48px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
              <span style={{ fontSize:'1.3rem' }}>🔥</span>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:700, color:'var(--ink)' }}>Más vendidos</h2>
              <div style={{ flex:1, height:'1px', background:'var(--border)', marginLeft:'8px' }} />
            </div>
            <div className="best-scroll">
              {bestSellers.map((p, i) => (
                <BestCard key={p.id} p={p} onAdd={addItem} onOpen={setSeleccionado} ratings={ratings} onRate={handleRate} rank={i+1} />
              ))}
            </div>
          </section>
        )}

        {/* ── CATEGORIES ── */}
        <section style={{ marginBottom:'40px' }}>
          <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'6px', scrollbarWidth:'none' }}>
            <button className={`cat-pill ${categoria==='Todos'?'cat-pill--on':'cat-pill--off'}`} onClick={() => { setCategoria('Todos'); setBusqueda(''); }}>
              Todos
            </button>
            {COLECCIONES.map((c) => (
              <button key={c.val} className={`cat-pill ${categoria===c.val?'cat-pill--on':'cat-pill--off'}`} onClick={() => setCategoria(c.val)}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS GRID ── */}
        <section>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'24px' }}>
            <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)' }}>
              {categoria === 'Todos' ? 'Todos los productos' : categoria}
            </h2>
            <span style={{ fontSize:'0.8rem', color:'var(--ink-3)' }}>{visibles.length} resultado{visibles.length!==1&&'s'}</span>
          </div>

          {error && <p style={{ color:'#ef4444', textAlign:'center', padding:'40px' }}>{error}</p>}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
            {visibles.map(p => (
              <ProductCard
                key={p.id} p={p} onAdd={addItem} onOpen={setSeleccionado}
                ratings={ratings} onRate={handleRate}
                isBestSeller={BEST_SELLER_NAMES.includes(p.nombre)}
              />
            ))}
          </div>

          {visibles.length === 0 && !error && (
            <div style={{ textAlign:'center', padding:'80px 20px' }}>
              <p style={{ fontSize:'2rem', marginBottom:'12px' }}>🔍</p>
              <p style={{ color:'var(--ink-3)' }}>No se encontraron productos.</p>
            </div>
          )}
        </section>

        {/* ── REVIEWS ── */}
        <ReviewsSection dark={dark} />

      </main>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)',
        background: dark ? 'rgba(26,26,30,0.95)' : 'rgba(255,255,255,0.92)',
        backdropFilter:'blur(14px)', borderRadius:'99px', padding:'10px 28px',
        display:'flex', gap:'32px', alignItems:'center',
        boxShadow:'0 4px 24px rgba(0,0,0,0.15)', zIndex:900,
        border:`1px solid var(--border)`
      }}>
        <button onClick={() => { setCategoria('Todos'); setBusqueda(''); }} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
          <span style={{ fontSize:'1.2rem' }}>🏪</span>
          <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color:categoria==='Todos'?'var(--accent)':'var(--ink-3)' }}>Tienda</span>
        </button>
        <button onClick={() => setCartOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', position:'relative' }}>
          <span style={{ fontSize:'1.2rem' }}>🛒</span>
          {totalItems > 0 && (
            <span style={{ position:'absolute', top:'-4px', right:'-10px', background:'#ef4444', color:'#fff', fontSize:'0.58rem', width:'17px', height:'17px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, border:'2px solid var(--surface)' }}>
              {totalItems}
            </span>
          )}
          <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-3)' }}>Carrito</span>
        </button>
      </div>

      {/* ── MODALS ── */}
      {seleccionado && (
        <ProductModal p={seleccionado} onClose={() => setSeleccionado(null)} onAdd={addItem} ratings={ratings} onRate={handleRate} />
      )}
      {cartOpen && (
        <CartPanel carrito={carrito} onClose={() => setCartOpen(false)} onAdd={addItem} onRemove={removeOne} onChangeQty={setQty} totalCompra={totalCompra} totalItems={totalItems} />
      )}
    </>
  );
}