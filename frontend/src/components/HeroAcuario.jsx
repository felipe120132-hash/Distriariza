import React from 'react';

export const HeroAcuario = ({ busqueda, setBusqueda, scrollY = 0 }) => {
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
        <div style={{
          display:'flex', alignItems:'center',
          background:'rgba(255,255,255,0.92)',
          borderRadius:'99px',
          padding:'12px 20px',
          gap:'10px',
          boxShadow:'0 8px 32px rgba(0,0,0,0.2)',
          backdropFilter:'blur(8px)',
          maxWidth:'420px',
          width:'100%'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/>
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar productos…"
            style={{
              border:'none',
              outline:'none',
              background:'transparent',
              fontSize:'0.95rem',
              color:'#222',
              width:'100%',
              fontFamily:'inherit'
            }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'1.1rem', padding:'0', lineHeight:1 }}>✕</button>
          )}
        </div>
      </div>

    </div>
  );
};