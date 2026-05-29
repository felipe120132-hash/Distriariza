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
        <div className="form-control" style={{ width: '100%', maxWidth: '320px', margin: '20px 0 0' }}>
          <input 
            type="text" 
            required 
            value={busqueda} 
            onChange={e => setBusqueda(e.target.value)} 
          />
          <label>
            {"Buscar productos…".split("").map((char, index) => (
              <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </label>
        </div>
      </div>

    </div>
  );
};
