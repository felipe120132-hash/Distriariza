import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Outfit:wght@500;700;800;900&display=swap');

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
      --font-display: 'Outfit', sans-serif;
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

    .aquarium-hero {
      position: relative;
      width: 100%;
      height: 440px;
      background: linear-gradient(180deg, #0a3d6b 0%, #0d5fa0 40%, #1a8cb8 75%, #2db8c8 100%);
      overflow: hidden;
    }

    .hero-text {
      position: absolute; bottom: 52px; left: 36px; z-index: 20;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-ring {
      width: 40px; height: 40px;
      border: 2px solid var(--bg);
      border-top-color: var(--ink);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s ease both; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .prod-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .prod-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

    .img-container {
      position: relative;
      overflow: hidden;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    /* Efecto de mezcla para fondos blancos de JPGs */
    .img-blend {
      mix-blend-mode: multiply;
      filter: contrast(1.05);
    }

    /* Brillo sutil en el contenedor */
    .img-container::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .prod-card:hover .img-container::after { opacity: 1; }

    .zoom-img {
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .prod-card:hover .zoom-img {
      transform: scale(1.12);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .panel { animation: slideIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }

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

    .icon-btn {
      width: 36px; height: 36px; border-radius: 10px;
      border: none; background: ${dark ? 'rgba(255,255,255,0.1)' : '#ededea'}; color: var(--ink);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 0.9rem; transition: background 0.15s;
    }
    .icon-btn:hover { background: ${dark ? 'rgba(255,255,255,0.18)' : '#ddddd9'}; }

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

    .star { cursor: pointer; transition: transform 0.15s; font-size: 1rem; }
    .star:hover { transform: scale(1.2); }

    @keyframes badgePop {
      0%   { transform: scale(0.6) rotate(-12deg); opacity: 0; }
      60%  { transform: scale(1.1) rotate(2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .badge-best { animation: badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

    .best-scroll {
      display: flex; gap: 16px; overflow-x: auto;
      padding-bottom: 12px; scrollbar-width: none;
    }
    .best-scroll::-webkit-scrollbar { display: none; }

    * { transition-property: background-color, border-color, color; transition-duration: 0.25s; }
    .caustic-ray, .bubble, .seaweed { transition: none !important; }
    .parallax-layer { transition: none !important; }
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
   VIDEO ID
───────────────────────────────────────────── */
const VIDEO_ID = "V9v7jGqTx7E";

/* ─────────────────────────────────────────────
   AQUARIUM HERO
───────────────────────────────────────────── */
const AquariumHero = ({ busqueda, setBusqueda, scrollY = 0 }) => {
  const s = Math.max(0, Math.min(scrollY, 440));
  return (
    <div className="aquarium-hero">

      {/* ── VIDEO DE FONDO ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '177.78vh',
            minWidth: '100%',
            height: '56.25vw',
            minHeight: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── TEXTO Y BUSCADOR ── */}
      <div className="parallax-layer hero-text" style={{ zIndex:20, transform:`translateY(${s * -0.45}px)`, opacity:Math.max(0, 1 - s / 180), willChange:'transform, opacity' }}>
        <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.8px', color:'rgba(255,255,255,0.7)', marginBottom:'8px' }}>Tienda en línea</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,5vw,3.5rem)', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:'20px', textShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
          Todo para tus<br/>peces y hámsters.
        </h1>
        <div style={{ position:'relative', maxWidth:'320px' }}>
          <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', opacity:0.6, color:'#444' }}>🔍</span>
          <input type="text" placeholder="Buscar productos…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ 
              width:'100%', 
              padding:'13px 18px 13px 40px', 
              borderRadius:'99px', 
              border:'none', 
              background:'#ffffff', 
              color:'#333', 
              fontFamily:'var(--font-body)', 
              fontSize:'0.88rem', 
              outline:'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────── */
const StarRating = ({ productId, ratings, onRate, readonly = false, size = '1rem' }) => {
  const [hover, setHover] = useState(0);
  const current = ratings[productId] || 0;
  return (
    <div style={{ display:'flex', gap:'2px', alignItems:'center' }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} className={readonly ? '' : 'star'}
          style={{ fontSize:size, color:(hover || current) >= star ? 'var(--gold)' : 'var(--ink-3)', lineHeight:1, cursor:readonly ? 'default' : 'pointer' }}
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
  "Acuaprime 30ml":    { resumen:"Protección instantánea para tus peces en formato compacto.", cuerpo:"Convierte el agua del grifo en un paraíso seguro eliminando el cloro y neutralizando metales pesados en segundos. Ideal para nano-acuarios o kits de inicio.", uso:"Aplicar 1 gota por cada 2 litros de agua nueva." },
  "Acuaprime 120ml":   { resumen:"El aliado perfecto para cambios de agua seguros.", cuerpo:"Protege la mucosa natural de tus peces y reduce el estrés durante los cambios de agua. Su fórmula avanzada actúa inmediatamente garantizando un entorno saludable.", uso:"Dosificar según las indicaciones del envase en cada recambio de agua." },
  "Acuaprime 240ml":   { resumen:"Máxima seguridad y rendimiento para acuarios medianos.", cuerpo:"Fórmula concentrada que garantiza la eliminación total de tóxicos químicos del agua de grifo. Apto para acuarios de agua dulce y salada.", uso:"Añadir al agua nueva antes de ingresarla al tanque principal." },
  "Acuaprime Litro":   { resumen:"Rendimiento profesional al mejor precio.", cuerpo:"La opción preferida por criadores y expertos. Máxima eficiencia en la neutralización de cloro para grandes volúmenes de agua.", uso:"Ideal para mantenimientos masivos y baterías de acuarios." },
  "Cycle 30ml":        { resumen:"Activa la vida biológica de tu acuario al instante.", cuerpo:"Contiene millones de bacterias benéficas que establecen el ciclo del nitrógeno, eliminando amoníaco y nitritos tóxicos de forma natural.", uso:"Aplicar durante los primeros 7 días en montajes nuevos." },
  "Cycle 120ml":       { resumen:"Ecosistema saludable y agua cristalina siempre.", cuerpo:"Mantiene la filtración biológica robusta, ayudando a degradar restos orgánicos y prevenir enfermedades causadas por mala calidad de agua.", uso:"Agitar bien y aplicar semanalmente después de cada limpieza." },
  "Cycle 240ml":       { resumen:"Control biológico avanzado para acuarios establecidos.", cuerpo:"Garantiza una población bacteriana estable y fuerte, capaz de manejar cargas biológicas altas sin comprometer la salud de los peces.", uso:"Dosificar proporcionalmente al volumen total de tu acuario." },
  "Cycle Litro":       { resumen:"Poder biológico extremo para sistemas de gran escala.", cuerpo:"Ideal para reactivar filtros después de tratamientos con medicamentos o para estabilizar rápidamente acuarios de gran tamaño.", uso:"Dosificación recomendada para mantenimientos profesionales." },
  "Test Plus Ultra PH":{ resumen:"Precisión total para un agua siempre perfecta.", cuerpo:"Monitorea el parámetro más crítico de tu acuario con máxima exactitud. Escala de colores detallada para una lectura fácil y rápida.", uso:"Llenar el tubo de ensayo, aplicar las gotas y comparar con la tabla." },
  "Alga Clear 20ml":   { resumen:"Controla las algas indeseadas de forma segura y eficaz.", cuerpo:"Mantiene los cristales y decoraciones impecables, eliminando algas en suspensión causadas por el exceso de luz sin dañar a tus peces.", uso:"Usar como preventivo o ante los primeros signos de agua verde." },
  "Clarify 20ml":      { resumen:"Agua transparente como el cristal en pocos minutos.", cuerpo:"Agrupa las micropartículas de suciedad en suspensión para que el filtro las atrape fácilmente. Resultados visibles casi de inmediato.", uso:"Aplicar cuando el agua se vea opaca o después de remover el fondo." },
  "Clarify 60ml":      { resumen:"Tratamiento de claridad extrema para acuarios impecables.", cuerpo:"Elimina la turbidez mecánica y orgánica más difícil, devolviendo el brillo natural y la transparencia total a tu acuario.", uso:"Asegurar una buena oxigenación mientras el producto actúa." },
  "Antihongos 30ml":   { resumen:"Protección eficaz contra infecciones fúngicas externas.", cuerpo:"Previene que pequeñas heridas o el estrés se conviertan en infecciones graves. Ayuda a una recuperación rápida de la piel y aletas.", uso:"Aplicar ante la presencia de puntos blancos algodonosos." },
  "Tratamiento de agua ICK 30 ml": { resumen:"Alivio rápido y seguro contra el punto blanco.", cuerpo:"Combate directamente al parásito causante del ICK, aliviando la picazón y el estrés en la piel de tus peces de forma efectiva.", uso:"Seguir el tratamiento por 5-7 días consecutivos." },
  "Antihongos":        { resumen:"Desinfectante general para un entorno libre de hongos.", cuerpo:"Ideal para prevenir la propagación de esporas en el agua y mantener a raya las enfermedades fúngicas más comunes del acuario.", uso:"Dosificación estándar para prevención general." },
};

const OPCIONES_COLORES = {
  "Acuarios Importados": ["Azul", "Blanco", "Negro", "Rosado"],
  "Jaula para Hámster 257": ["Azul", "Verde", "Rosado", "Naranja"],
  "Jaula para Hámster S-11": ["Café", "Rosado", "Verde"],
  "Jaula para Hámster 268": ["Azul Claro", "Azul Oscuro", "Amarillo", "Rosado", "Gris"],
  "Jaula para Hámster 45": ["Azul", "Amarillo", "Rosado", "Naranja"]
};

/* ─────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────── */
const COLECCIONES = [
  { label:'Líquidos',   val:'Líquidos vitales',         icon:'💧' },
  { label:'Comida',     val:'Alimentos',                icon:'🫙' },
  { label:'Accesorios', val:'Accesorios',               icon:'🎨' },
  { label:'Equipos',    val:'Equipos',                  icon:'⚙️' },
  { label:'Hámsters',   val:'Jaulas para Hámster',      icon:'🐹' },
];

const BEST_SELLER_NAMES = [
  'Acuaprime 120ml', 'Cycle 120ml', 'Alga Clear 20ml',
  'Clarify 20ml', 'Test Plus Ultra PH',
];

const BACKEND = "https://distriariza.onrender.com";

const moneda = (v) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits:0 }).format(v);

const imgSrc = (url) =>
  !url ? 'https://via.placeholder.com/300' : url.startsWith('http') ? url : `${BACKEND}/productos/${url}`;

const normaliza = (s) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();

/* ─────────────────────────────────────────────
   HELPERS UI
───────────────────────────────────────────── */
const Stepper = ({ value, onAdd, onRemove, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
    <button className="icon-btn" onClick={onRemove} aria-label="Restar">−</button>
    <input type="number" min="1" value={value}
      onChange={(e) => { const v=parseInt(e.target.value); if(!isNaN(v) && v>=0) onChange(v); }}
      style={{ width:'36px', textAlign:'center', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'5px 0', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.9rem', background:'transparent', color:'var(--ink)' }}
    />
    <button className="icon-btn" onClick={onAdd} aria-label="Sumar">+</button>
  </div>
);

/* ─────────────────────────────────────────────
   BEST SELLER CARD
───────────────────────────────────────────── */
const BestCard = ({ p, onAdd, onOpen, ratings, onRate, rank }) => (
  <div className="prod-card" style={{ background:'var(--card-bg)', borderRadius:'24px', overflow:'hidden', boxShadow:'var(--shadow-sm)', flexShrink:0, width:'200px' }}>
    <div style={{ position:'relative' }}>
      <div onClick={() => onOpen(p)} className="img-container" style={{ height:'160px', cursor:'pointer', padding:'12px', borderRadius:'24px 24px 0 0' }}>
        <img src={imgSrc(p.imagen_url)} alt={p.nombre} className="zoom-img img-blend" style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain' }} />
      </div>
      <div className="badge-best" style={{ position:'absolute', top:'12px', left:'12px', background: rank===1 ? '#f59e0b' : rank===2 ? '#94a3b8' : rank===3 ? '#cd7c3a' : 'var(--accent)', color:'#fff', borderRadius:'99px', padding:'4px 12px', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.5px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', zIndex:10 }}>
        #{rank} más vendido
      </div>
    </div>
    <div style={{ padding:'14px 16px 16px' }}>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'0.85rem', fontWeight:500, cursor:'pointer', marginBottom:'6px', lineHeight:1.3, color:'var(--ink)', height:'2.6em', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.nombre}</h4>
      <div style={{ marginBottom:'10px' }}>
        <StarRating productId={p.id} ratings={ratings} onRate={onRate} size="0.8rem" />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--ink)' }}>{moneda(p.precio)}</span>
        <button className="pill-btn pill-btn--accent" onClick={() => onAdd(p)} disabled={p.stock <= 0} style={{ padding:'6px 10px', fontSize:'0.7rem', opacity: p.stock <= 0 ? 0.5 : 1 }}>
          {p.stock > 0 ? '+ Añadir' : 'Agotado'}
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
const ProductCard = ({ p, onAdd, onOpen, ratings, onRate, isBestSeller }) => (
  <div className="prod-card fade-up" style={{ background:'var(--card-bg)', borderRadius:'24px', overflow:'hidden', boxShadow:'var(--shadow-sm)', position:'relative' }}>
    {isBestSeller && (
      <div className="badge-best" style={{ position:'absolute', top:'12px', right:'12px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'4px 12px', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.5px', zIndex:5, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
        🔥 TOP
      </div>
    )}
    <div onClick={() => onOpen(p)} className="img-container"
      style={{ height:'220px', cursor:'pointer', padding:'24px', borderRadius:'24px 24px 0 0' }}
    >
      <img src={imgSrc(p.imagen_url)} alt={p.nombre} className="zoom-img img-blend"
        style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain' }}
      />
    </div>
    <div style={{ padding:'18px 20px 20px' }}>
      <p style={{ fontSize:'0.7rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>{p.categoria_nombre}</span>
        <span style={{ color: p.stock > 0 ? '#22c55e' : '#ef4444', background: p.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding:'2px 8px', borderRadius:'6px' }}>{p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}</span>
      </p>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)', cursor:'pointer', marginBottom:'10px', lineHeight:1.3, height:'2.6em', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.nombre}</h4>
      <div style={{ marginBottom:'16px' }}>
        <StarRating productId={p.id} ratings={ratings} onRate={onRate} size="0.95rem" />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'14px' }}>
        <span style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--ink)', letterSpacing:'-0.5px' }}>{moneda(p.precio)}</span>
        <button className="pill-btn pill-btn--accent" onClick={() => onAdd(p)} disabled={p.stock <= 0} style={{ padding:'10px 20px', fontSize:'0.82rem', opacity: p.stock <= 0 ? 0.5 : 1 }}>
          {p.stock > 0 ? '+ Añadir' : 'Agotado'}
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
  const colores = OPCIONES_COLORES[p.nombre];
  const [colorSel, setColorSel] = useState(colores ? colores[0] : null);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(10,10,10,0.6)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:3000 }} />
      <div className="modal" style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'90%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto', background:'var(--surface)', zIndex:3001, borderRadius:'28px', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(128,128,128,0.15)', border:'none', borderRadius:'50%', width:'42px', height:'42px', cursor:'pointer', fontSize:'1.1rem', color:'var(--ink-2)', zIndex:10, display:'flex', alignItems:'center', justifyContent:'center' }}
          onMouseOver={e => e.currentTarget.style.background='rgba(128,128,128,0.25)'}
          onMouseOut={e => e.currentTarget.style.background='rgba(128,128,128,0.15)'}
        >✕</button>
        <div style={{ background:'linear-gradient(180deg, #fff 0%, #f9f9f9 100%)', borderRadius:'28px 28px 0 0', padding:'40px 32px 32px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'280px', overflow:'hidden', position:'relative' }}>
          {isBest && (
            <div style={{ position:'absolute', top:'20px', left:'24px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'5px 14px', fontSize:'0.7rem', fontWeight:800, boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>🔥 Más vendido</div>
          )}
          <img className="modal-img img-blend" src={imgSrc(p.imagen_url)} alt={p.nombre} style={{ maxHeight:'240px', maxWidth:'100%', objectFit:'contain', display:'block', filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.08))' }} />
        </div>
        <div style={{ padding:'24px 28px 28px' }}>
          <p className="modal-content-1" style={{ fontSize:'0.68rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:'6px', display:'flex', justifyContent:'space-between' }}>
            <span>{p.categoria_nombre}</span>
            <span style={{ color: p.stock > 0 ? '#16a34a' : '#ef4444' }}>{p.stock > 0 ? `${p.stock} Disponibles` : 'Agotado'}</span>
          </p>
          <h2 className="modal-content-2" style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', marginBottom:'10px', lineHeight:1.2 }}>{p.nombre}</h2>
          
          {colores && (
            <div className="modal-content-2" style={{ marginBottom:'20px' }}>
              <p style={{ fontSize:'0.7rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'10px' }}>Elige un color:</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {colores.map(c => (
                  <button key={c} onClick={() => setColorSel(c)} 
                    style={{ 
                      padding:'6px 14px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:600, cursor:'pointer',
                      border: colorSel === c ? '2.5px solid var(--accent)' : '1.5px solid var(--border)',
                      background: colorSel === c ? 'var(--accent)' : 'transparent',
                      color: colorSel === c ? '#fff' : 'var(--ink)',
                      transition: 'all 0.2s'
                    }}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

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
            <button className="pill-btn pill-btn--accent" onClick={() => { onAdd({...p, colorSeleccionado: colorSel}); onClose(); }} disabled={p.stock <= 0} style={{ padding:'14px 28px', fontSize:'0.9rem', opacity: p.stock <= 0 ? 0.5 : 1 }}>
              {p.stock > 0 ? '+ Añadir al carrito' : 'Agotado'}
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

  const enviarWhatsApp = async () => {
    // Descontar stock en la base de datos
    try {
      await axios.post(`${BACKEND}/api/productos/descontar-stock`, {
        items: carrito.map(p => ({ id: p.id, cantidad: p.cantidad }))
      });
    } catch (e) {
      console.error('Error al descontar stock:', e);
    }

    const lista = carrito.map(p => `• ${p.nombre}${p.colorSeleccionado ? ` [Color: ${p.colorSeleccionado}]` : ''} (x${p.cantidad})`).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n*Cliente:* ${datos.nombre}\n*Dirección:* ${datos.direccion}\n*Ciudad:* ${datos.ciudad}\n*Teléfono:* ${datos.telefono}\n\n*Productos:*\n${lista}\n\n*Total: ${moneda(totalCompra)}*`;
    window.open(`https://wa.me/573219627376?text=${encodeURIComponent(msg)}`, '_blank');
    setPaso('confirmado');
  };

  return (
    <>
      <div onClick={() => { onClose(); setPaso('lista'); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1500 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'400px', height:'100%', background:'var(--surface)', zIndex:2000, display:'flex', flexDirection:'column' }}>
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
          <button onClick={() => { onClose(); setPaso('lista'); }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.3rem', color:'var(--ink-2)', padding:'4px' }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          {paso === 'lista' && (
            carrito.length === 0
              ? <div style={{ textAlign:'center', marginTop:'60px' }}><p style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🛒</p><p style={{ color:'var(--ink-3)', fontSize:'0.9rem' }}>Tu carrito está vacío.</p></div>
              : carrito.map(item => (
                <div key={`${item.id}-${item.colorSeleccionado || ''}`} style={{ display:'flex', gap:'14px', alignItems:'center', paddingBlock:'16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ background:'var(--bg)', borderRadius:'12px', padding:'8px', flexShrink:0 }}>
                    <img src={imgSrc(item.imagen_url)} alt={item.nombre} style={{ width:'52px', height:'52px', objectFit:'contain' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--ink)' }}>{item.nombre}</p>
                    {item.colorSeleccionado && (
                      <p style={{ fontSize:'0.72rem', color:'var(--accent)', fontWeight:700, marginBottom:'4px' }}>Color: {item.colorSeleccionado}</p>
                    )}
                    <p style={{ fontSize:'0.82rem', color:'var(--ink-2)' }}>{moneda(item.precio * item.cantidad)}</p>
                  </div>
                  <Stepper value={item.cantidad} onAdd={() => onAdd(item)} onRemove={() => onRemove(item.id, item.colorSeleccionado)} onChange={(v) => onChangeQty(item.id, item.colorSeleccionado, v)} />
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
              <button className="pill-btn pill-btn--ghost" onClick={() => { onClose(); setPaso('lista'); }} style={{ width:'100%', justifyContent:'center', padding:'14px' }}>Volver a la tienda</button>
            </div>
          )}
        </div>
        {carrito.length > 0 && paso !== 'confirmado' && (
          <div style={{ padding:'20px 28px', borderTop:'1px solid var(--border)', background:'var(--surface)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'16px' }}>
              <span style={{ fontSize:'0.82rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>Total</span>
              <span style={{ fontSize:'1.4rem', fontWeight:600, color:'var(--ink)' }}>{moneda(totalCompra)}</span>
            </div>
            <button className={`pill-btn ${paso==='lista'?'pill-btn--accent':'pill-btn--green'}`}
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
   REVIEWS INICIALES
───────────────────────────────────────────── */
const REVIEWS_INICIALES = [
  { id:'r1', nombre:'Valentina Ospina', avatar:'🐠', estrellas:5, fecha:'hace 2 días',    texto:'Llevo 3 años comprando en Distribuciones Ariza y nunca me han fallado. El Acuaprime es increíble, mis peces nunca han estado tan saludables. El envío fue súper rápido y el empaque llegó perfecto. ¡100% recomendado!', producto:'Acuaprime 120ml' },
  { id:'r2', nombre:'Carlos Mendoza',   avatar:'🐡', estrellas:5, fecha:'hace 5 días',    texto:'Compré el Cycle para iniciar mi primer acuario plantado y los resultados son sorprendentes. El agua cristalina desde la primera semana, sin pico de amoniaco. El asesoramiento por WhatsApp también es excelente.', producto:'Cycle 120ml' },
  { id:'r3', nombre:'Mariana Ríos',     avatar:'🐹', estrellas:5, fecha:'hace 1 semana',  texto:'Los accesorios para mi hámster son de muy buena calidad, se nota que son productos pensados en el bienestar del animal. Mi Coco está feliz desde que llegó su nueva jaula. El precio es justo y la atención al cliente es de primera.', producto:'Accesorios para hamsters' },
  { id:'r4', nombre:'Andrés Castaño',   avatar:'🐟', estrellas:5, fecha:'hace 2 semanas', texto:'El Alga Clear salvó mi acuario. Tenía una plaga de algas horrible por el sol de la ventana y en menos de 4 días desapareció completamente sin afectar a mis peces. Definitivamente el mejor producto para ese problema.', producto:'Alga Clear 20ml' },
  { id:'r5', nombre:'Luisa Torres',     avatar:'🦈', estrellas:5, fecha:'hace 3 semanas', texto:'Excelente tienda. Tienen todo lo que necesito en un solo lugar, desde tratamientos hasta comida especializada. Los productos son originales y de marcas confiables. Mi acuario marino lleva 2 años perfecto gracias a Ariza.', producto:'Clarify 60ml' },
  { id:'r6', nombre:'Santiago Gómez',   avatar:'🐠', estrellas:5, fecha:'hace 1 mes',     texto:'Pedí por WhatsApp y me respondieron en minutos. El proceso de compra fue muy fácil, el pago seguro y el producto llegó bien sellado y en perfecto estado. El Clarify hace exactamente lo que promete, agua como vidrio.', producto:'Clarify 20ml' },
];

/* ─────────────────────────────────────────────
   REVIEWS PANEL
───────────────────────────────────────────── */
const ReviewsPanel = ({ onClose, dark }) => {
  const avatares = ['🐠','🐡','🐟','🦈','🐙','🐬','🦑','🐹','🐾'];
  const [reviews, setReviews]     = useState(REVIEWS_INICIALES);
  const [cargando, setCargando]   = useState(true);
  const [tab, setTab]             = useState('ver');
  const [nombre, setNombre]       = useState('');
  const [texto, setTexto]         = useState('');
  const [producto, setProducto]   = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [enviado, setEnviado]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    setCargando(true);
    axios.get(`${BACKEND}/api/resenas`)
      .then(r => {
        const backendIds = new Set(r.data.map(rev => String(rev.id)));
        const sinDup = REVIEWS_INICIALES.filter(rev => !backendIds.has(String(rev.id)));
        const backendFormateadas = r.data.map(rev => ({
          id:        String(rev.id),
          nombre:    rev.autor,
          avatar:    avatares[Math.floor(Math.random() * avatares.length)],
          estrellas: rev.calificacion,
          fecha:     new Date(rev.creado_en).toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' }),
          texto:     rev.comentario,
          producto:  rev.producto_nombre || 'Producto general',
        }));
        setReviews([...backendFormateadas, ...sinDup]);
      })
      .catch(() => { setReviews(REVIEWS_INICIALES); })
      .finally(() => setCargando(false));
  }, []);

  const handleSubmit = async () => {
    if (!nombre.trim())           return setError('Por favor ingresa tu nombre.');
    if (estrellas === 0)          return setError('Por favor selecciona una calificación.');
    if (texto.trim().length < 10) return setError('Escribe un comentario más detallado (mínimo 10 caracteres).');
    setError('');
    try {
      const res = await axios.post(`${BACKEND}/api/resenas`, {
        producto_id:     1,
        producto_nombre: producto.trim() || 'Producto general',
        autor:           nombre.trim(),
        calificacion:    estrellas,
        comentario:      texto.trim(),
      });
      const nueva = {
        id:        String(res.data.id),
        nombre:    nombre.trim(),
        avatar:    avatares[Math.floor(Math.random() * avatares.length)],
        estrellas,
        fecha:     'justo ahora',
        texto:     texto.trim(),
        producto:  producto.trim() || 'Producto general',
      };
      setReviews(prev => [nueva, ...prev]);
      setNombre(''); setTexto(''); setProducto(''); setEstrellas(0);
      setEnviado(true);
      setTab('ver');
      setTimeout(() => setEnviado(false), 4000);
    } catch {
      setError('No se pudo publicar la reseña. Verificá tu conexión.');
    }
  };

  const promedio = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.estrellas, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1500 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'420px', height:'100%', background:'var(--surface)', zIndex:2000, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'24px 28px 0', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:700, color:'var(--ink)', flex:1 }}>Reseñas</h2>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginRight:'16px' }}>
              <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--ink)' }}>{promedio}</span>
              <span style={{ fontSize:'0.9rem', color:'var(--gold)' }}>★</span>
              <span style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>({reviews.length})</span>
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.3rem', color:'var(--ink-2)', padding:'4px' }}>✕</button>
          </div>
          <div style={{ display:'flex', gap:'4px', marginBottom:'-1px' }}>
            {[{ key:'ver', label:`💬 Leer (${reviews.length})` }, { key:'escribir', label:'✏️ Escribir' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:'10px 18px', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:600, background:'none', color: tab===t.key ? 'var(--accent)' : 'var(--ink-3)', borderBottom: tab===t.key ? '2px solid var(--accent)' : '2px solid transparent', transition:'color 0.2s, border-color 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          {tab === 'ver' && (
            <>
              <div style={{ background:'var(--bg)', borderRadius:'16px', padding:'18px 20px', marginBottom:'20px', display:'flex', gap:'20px', alignItems:'center' }}>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'2.6rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>{promedio}</p>
                  <div style={{ display:'flex', gap:'2px', justifyContent:'center', margin:'5px 0' }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize:'0.9rem', color: s <= Math.round(promedio) ? 'var(--gold)' : 'var(--ink-3)' }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize:'0.65rem', color:'var(--ink-3)', fontWeight:600 }}>{reviews.length} reseñas</p>
                </div>
                <div style={{ flex:1 }}>
                  {[5,4,3,2,1].map(s => {
                    const count = reviews.filter(r => r.estrellas === s).length;
                    const pct   = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'0.68rem', color:'var(--ink-3)', width:'7px', textAlign:'right' }}>{s}</span>
                        <span style={{ fontSize:'0.65rem', color:'var(--gold)' }}>★</span>
                        <div style={{ flex:1, height:'5px', background:'var(--border)', borderRadius:'99px', overflow:'hidden' }}>
                          <div style={{ width:`${pct}%`, height:'100%', background:'var(--gold)', borderRadius:'99px' }} />
                        </div>
                        <span style={{ fontSize:'0.62rem', color:'var(--ink-3)', width:'22px' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {enviado && (
                <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'0.82rem', color:'#16a34a', display:'flex', alignItems:'center', gap:'8px' }}>
                  ✅ ¡Gracias! Tu reseña ya está publicada y visible para todos.
                </div>
              )}
              {cargando ? (
                <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}>
                  <div className="loader-ring" />
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  {reviews.map((r, i) => (
                    <div key={r.id} className="fade-up" style={{ background:'var(--card-bg)', borderRadius:'16px', padding:'18px 20px', border:'1px solid var(--border)', animationDelay:`${i * 0.04}s` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                        <div style={{ width:'38px', height:'38px', borderRadius:'50%', background: dark ? 'rgba(255,255,255,0.08)' : '#f0f0ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', flexShrink:0 }}>
                          {r.avatar}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.nombre}</p>
                          <p style={{ fontSize:'0.64rem', color:'var(--ink-3)', marginTop:'1px' }}>{r.fecha}</p>
                        </div>
                        <div style={{ display:'flex', gap:'1px', flexShrink:0 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ fontSize:'0.72rem', color: s <= r.estrellas ? 'var(--gold)' : 'var(--ink-3)' }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize:'0.83rem', color:'var(--ink-2)', lineHeight:1.65, marginBottom:'10px' }}>"{r.texto}"</p>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:'4px', background: dark ? 'rgba(26,92,255,0.15)' : 'rgba(26,92,255,0.07)', borderRadius:'99px', padding:'3px 9px' }}>
                        <span style={{ fontSize:'0.55rem' }}>🛒</span>
                        <span style={{ fontSize:'0.64rem', fontWeight:600, color:'var(--accent)' }}>{r.producto}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {tab === 'escribir' && (
            <div>
              <div style={{ marginBottom:'20px' }}>
                <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px' }}>Tu calificación *</p>
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="star"
                      style={{ fontSize:'2rem', color:(hoverStar||estrellas) >= s ? 'var(--gold)' : 'var(--ink-3)', cursor:'pointer', lineHeight:1 }}
                      onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setEstrellas(s)}
                    >★</span>
                  ))}
                  {estrellas > 0 && (
                    <span style={{ fontSize:'0.78rem', color:'var(--ink-3)', marginLeft:'4px' }}>
                      {['','Malo 😕','Regular 😐','Bueno 🙂','Muy bueno 😊','¡Excelente! 🤩'][estrellas]}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'16px' }}>
                <div>
                  <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Tu nombre *</p>
                  <input className="form-input" placeholder="Ej: María González" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div>
                  <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Producto (opcional)</p>
                  <input className="form-input" placeholder="Ej: Acuaprime 120ml" value={producto} onChange={e => setProducto(e.target.value)} />
                </div>
                <div>
                  <p style={{ fontSize:'0.72rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'6px' }}>Tu comentario *</p>
                  <textarea className="form-input" placeholder="Cuéntanos tu experiencia con el producto o la tienda..."
                    value={texto} onChange={e => setTexto(e.target.value)} rows={5}
                    style={{ resize:'vertical', minHeight:'110px', lineHeight:1.6 }}
                  />
                  <p style={{ fontSize:'0.65rem', color: texto.length < 10 && texto.length > 0 ? '#ef4444' : 'var(--ink-3)', marginTop:'4px', textAlign:'right' }}>
                    {texto.length} / mínimo 10 caracteres
                  </p>
                </div>
              </div>
              {error && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', fontSize:'0.82rem', color:'#ef4444' }}>
                  {error}
                </div>
              )}
              <button className="pill-btn pill-btn--accent" onClick={handleSubmit} style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.9rem' }}>
                Publicar reseña
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   ADMIN PANEL
───────────────────────────────────────────── */
const AdminPanel = ({ onClose, productos, onRefresh }) => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [modo, setModo] = useState('lista'); 
  const [selected, setSelected] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [cat, setCat] = useState('1');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === '80153017') {
      setAuth(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleEdit = (p) => {
    setSelected(p);
    setNombre(p.nombre);
    setDesc(p.descripcion);
    setPrecio(p.precio);
    setStock(p.stock !== undefined ? p.stock : 0);
    setCat(p.categoria_id);
    setImagen(null);
    setModo('editar');
  };

  const handleNew = () => {
    setSelected(null);
    setNombre('');
    setDesc('');
    setPrecio('');
    setStock('0');
    setCat('1');
    setImagen(null);
    setModo('nuevo');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', desc);
    formData.append('precio', precio.toString().replace(',', '.'));
    formData.append('stock', stock);
    formData.append('categoria_id', cat);
    if (imagen) formData.append('imagen', imagen);

    try {
      if (modo === 'nuevo') {
        await axios.post(`${BACKEND}/api/productos`, formData, {
          headers: { 'x-admin-password': pass }
        });
        setSuccessMsg('¡Producto creado con éxito!');
      } else {
        await axios.put(`${BACKEND}/api/productos/${selected.id}`, formData, {
          headers: { 'x-admin-password': pass }
        });
        setSuccessMsg('¡Producto actualizado con éxito!');
      }
      onRefresh();
      setModo('lista');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Error al guardar el producto');
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres ocultar/eliminar este producto?')) return;
    try {
      await axios.delete(`${BACKEND}/api/productos/${id}`, {
        headers: { 'x-admin-password': pass }
      });
      onRefresh();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:4000 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'600px', height:'100%', background:'var(--surface)', zIndex:4001, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'24px 28px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--ink)' }}>Panel Admin</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'var(--ink)', padding:'4px' }}>✕</button>
        </div>

        <div style={{ padding:'24px 28px', flex:1 }}>
          {!auth ? (
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth:'300px', margin:'40px auto' }}>
              <h3 style={{ textAlign:'center', color:'var(--ink)', fontFamily:'var(--font-display)' }}>Contraseña de acceso</h3>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} className="form-input" placeholder="Escribe aquí..." />
              {error && <p style={{ color:'#ef4444', fontSize:'0.8rem', textAlign:'center' }}>{error}</p>}
              <button type="submit" className="pill-btn pill-btn--accent" style={{ justifyContent:'center', padding:'12px' }}>Ingresar</button>
            </form>
          ) : (
            modo === 'lista' ? (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center' }}>
                  <h3 style={{ color:'var(--ink)', fontFamily:'var(--font-display)' }}>Productos ({productos.length})</h3>
                  <button onClick={handleNew} className="pill-btn pill-btn--green">+ Nuevo</button>
                </div>
                {successMsg && (
                  <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'0.85rem', color:'#16a34a', fontWeight:600 }}>
                    ✅ {successMsg}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {productos.map(p => (
                    <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background: 'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <img src={imgSrc(p.imagen_url)} style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'8px' }} />
                        <div>
                          <p style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--ink)', maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nombre}</p>
                          <p style={{ fontSize:'0.75rem', color:'var(--ink-2)' }}>{moneda(p.precio)} • Stock: <span style={{ color: p.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: 'bold' }}>{p.stock}</span></p>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => handleEdit(p)} className="pill-btn pill-btn--ghost" style={{ padding:'6px 12px', fontSize:'0.7rem' }}>Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="pill-btn" style={{ background:'#ef4444', color:'white', padding:'6px 12px', fontSize:'0.7rem' }}>Borrar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <h3 style={{ color:'var(--ink)', fontFamily:'var(--font-display)' }}>{modo === 'nuevo' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
                  <button type="button" onClick={() => setModo('lista')} className="pill-btn pill-btn--ghost">Volver</button>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Nombre del producto</label>
                  <input required className="form-input" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Descripción / Detalles</label>
                  <textarea className="form-input" placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} rows={3} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Precio (COP)</label>
                    <input required type="number" className="form-input" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Cantidad (Stock)</label>
                    <input required type="number" className="form-input" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Categoría</label>
                  <select className="form-input" value={cat} onChange={e=>setCat(e.target.value)}>
                    <option value="1">Líquidos Vitales</option>
                    <option value="2">Alimentos</option>
                    <option value="3">Equipos</option>
                    <option value="4">Accesorios</option>
                    <option value="5">Plantas</option>
                    <option value="6">Jaulas para Hámster</option>
                  </select>
                </div>

                <div style={{ background:'var(--bg)', padding:'16px', borderRadius:'12px', border:'1px dashed var(--border)' }}>
                  <p style={{ fontSize:'0.8rem', color:'var(--ink-2)', marginBottom:'8px', fontWeight:600 }}>{modo === 'editar' ? 'Cambiar imagen (opcional)' : 'Subir imagen'}</p>
                  <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} style={{ color:'var(--ink)', fontSize:'0.8rem' }} />
                </div>

                <button type="submit" disabled={cargando} className="pill-btn pill-btn--accent" style={{ justifyContent:'center', padding:'14px', marginTop:'10px', fontSize:'0.9rem' }}>
                  {cargando ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [productos, setProductos]       = useState([]);
  const [carrito, setCarrito]           = useState([]);
  const [error, setError]               = useState(null);
  const [cartOpen, setCartOpen]         = useState(false);
  const [reviewsOpen, setReviewsOpen]   = useState(false);
  const [adminOpen, setAdminOpen]       = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda]         = useState('');
  const [categoria, setCategoria]       = useState('Todos');
  const [cargando, setCargando]         = useState(true);
  const [dark, setDark]                 = useState(false);
  const [ratings, setRatings]           = useState({});
  const [scrollY, setScrollY]           = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductos = () => {
    axios.get(`${BACKEND}/api/productos`)
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setTimeout(() => setCargando(false), 1600));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const addItem = useCallback((p) =>
    setCarrito(prev => {
      if (p.stock <= 0) return prev;
      const colorKey = p.colorSeleccionado || '';
      const ex = prev.find(i => i.id === p.id && (i.colorSeleccionado || '') === colorKey);
      if (ex && ex.cantidad >= p.stock) return prev;
      return ex 
        ? prev.map(i => (i.id===p.id && (i.colorSeleccionado || '') === colorKey) ? {...i, cantidad:i.cantidad+1} : i) 
        : [...prev, {...p, cantidad:1}];
    }), []);

  const removeOne  = (id, color) => {
    const colorKey = color || '';
    setCarrito(prev => prev.map(i => (i.id===id && (i.colorSeleccionado || '') === colorKey) ? {...i, cantidad:i.cantidad-1} : i).filter(i => i.cantidad>0));
  };
  const setQty     = (id, color, v) => {
    const colorKey = color || '';
    setCarrito(prev => prev.map(i => {
      if (i.id === id && (i.colorSeleccionado || '') === colorKey) {
        const prod = productos.find(p => p.id === id);
        return {...i, cantidad: prod ? Math.min(v, prod.stock) : v};
      }
      return i;
    }).filter(i => i.cantidad>0));
  };
  const handleRate = (productId, stars) => setRatings(prev => ({...prev, [productId]: stars}));

  const totalItems  = carrito.reduce((s,i) => s+i.cantidad, 0);
  const totalCompra = carrito.reduce((s,i) => s+Math.round(Number(i.precio))*i.cantidad, 0);

  const bestSellers = BEST_SELLER_NAMES.map(name => productos.find(p => p.nombre === name)).filter(Boolean).slice(0, 5);

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
      <nav style={{ position:'sticky', top:0, zIndex:1000, background: dark ? '#111115' : '#ffffff', borderBottom:`1px solid var(--border)`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'64px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <img src="/Logo.jpeg" alt="Logo" style={{ height:'38px', width:'38px', borderRadius:'10px', objectFit:'cover' }} onError={e => e.target.src='https://via.placeholder.com/38?text=A'} />
          <div>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>Distribuciones Ariza</p>
            <p style={{ fontSize:'0.58rem', color:'var(--accent)', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginTop:'2px' }}>Fish Accessories</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'0.75rem', color:'var(--ink-3)' }}>{dark ? '🌙' : '☀️'}</span>
            <button className="dark-toggle" onClick={() => setDark(d => !d)} aria-label="Modo oscuro" />
          </div>
          <button onClick={() => setAdminOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', color:'var(--ink-2)', opacity:0.6 }} title="Panel Admin">
            🔒
          </button>
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

      {/* ── HERO + MAIN ── */}
      <div style={{ position:'relative' }}>
        <div style={{ position:'sticky', top:64, zIndex:0, height:440, overflow:'hidden' }}>
          <AquariumHero busqueda={busqueda} setBusqueda={setBusqueda} scrollY={scrollY} />
        </div>

        <main style={{ position:'relative', zIndex:1, background:'var(--bg)', borderRadius:'32px 32px 0 0', marginTop:-16, padding:'56px 24px 120px', boxShadow:'0 -16px 48px rgba(0,0,0,0.18)', maxWidth:'none' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>

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

            <section style={{ marginBottom:'40px' }}>
              <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'6px', scrollbarWidth:'none' }}>
                <button className={`cat-pill ${categoria==='Todos'?'cat-pill--on':'cat-pill--off'}`} onClick={() => { setCategoria('Todos'); setBusqueda(''); }}>Todos</button>
                {COLECCIONES.map((c) => (
                  <button key={c.val} className={`cat-pill ${categoria===c.val?'cat-pill--on':'cat-pill--off'}`} onClick={() => setCategoria(c.val)}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'24px' }}>
                <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)' }}>{categoria === 'Todos' ? 'Todos los productos' : categoria}</h2>
                <span style={{ fontSize:'0.8rem', color:'var(--ink-3)' }}>{visibles.length} resultado{visibles.length!==1&&'s'}</span>
              </div>
              {error && <p style={{ color:'#ef4444', textAlign:'center', padding:'40px' }}>{error}</p>}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
                {visibles.map(p => (
                  <ProductCard key={p.id} p={p} onAdd={addItem} onOpen={setSeleccionado} ratings={ratings} onRate={handleRate} isBestSeller={BEST_SELLER_NAMES.includes(p.nombre)} />
                ))}
              </div>
              {visibles.length === 0 && !error && (
                <div style={{ textAlign:'center', padding:'80px 20px' }}>
                  <p style={{ fontSize:'2rem', marginBottom:'12px' }}>🔍</p>
                  <p style={{ color:'var(--ink-3)' }}>No se encontraron productos.</p>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)', background: dark ? '#1a1a1e' : '#ffffff', borderRadius:'99px', padding:'10px 32px', display:'flex', gap:'36px', alignItems:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.15)', zIndex:900, border:`1px solid var(--border)` }}>
        <button onClick={() => { setCategoria('Todos'); setBusqueda(''); }} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
          <span style={{ fontSize:'1.2rem' }}>🏪</span>
          <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color:categoria==='Todos'?'var(--accent)':'var(--ink-3)' }}>Tienda</span>
        </button>
        <button onClick={() => setReviewsOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
          <span style={{ fontSize:'1.2rem' }}>💬</span>
          <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color: reviewsOpen ? 'var(--accent)' : 'var(--ink-3)' }}>Reseñas</span>
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

      {/* ── MODALS / PANELS ── */}
      {seleccionado && (
        <ProductModal p={seleccionado} onClose={() => setSeleccionado(null)} onAdd={addItem} ratings={ratings} onRate={handleRate} />
      )}
      {cartOpen && (
        <CartPanel carrito={carrito} onClose={() => setCartOpen(false)} onAdd={addItem} onRemove={removeOne} onChangeQty={setQty} totalCompra={totalCompra} totalItems={totalItems} />
      )}
      {reviewsOpen && (
        <ReviewsPanel onClose={() => setReviewsOpen(false)} dark={dark} />
      )}
      {adminOpen && (
        <AdminPanel onClose={() => setAdminOpen(false)} productos={productos} onRefresh={fetchProductos} />
      )}
    </>
  );
}