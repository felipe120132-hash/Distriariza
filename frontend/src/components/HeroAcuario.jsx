import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { normaliza, slugify, moneda, imgSrc } from '../utils/helpers.js';

export const HeroAcuario = ({ productos = [], busqueda, setBusqueda, scrollY = 0 }) => {
  const navigate = useNavigate();
  const [showSugerencias, setShowSugerencias] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSugerencias(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sugerencias = busqueda.trim() 
    ? productos.filter(p => normaliza(p.nombre).includes(normaliza(busqueda))).slice(0, 5) 
    : [];

  const handleSelect = (p) => {
    setBusqueda('');
    setShowSugerencias(false);
    navigate('/producto/' + slugify(p.nombre));
  };

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
        <div ref={containerRef} style={{
          position: 'relative',
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
            onChange={e => {
              setBusqueda(e.target.value);
              setShowSugerencias(true);
            }}
            onFocus={() => setShowSugerencias(true)}
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
            <button onClick={() => { setBusqueda(''); setShowSugerencias(false); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'1.1rem', padding:'0', lineHeight:1 }}>✕</button>
          )}

          {/* Suggstions Dropdown */}
          {showSugerencias && busqueda.trim() !== '' && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100
            }}>
              {sugerencias.length > 0 ? (
                sugerencias.map((p, i) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px',
                      cursor: 'pointer', borderBottom: i < sugerencias.length - 1 ? '1px solid #f0f0f0' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={imgSrc(p.imagen_url)} alt={p.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{moneda(p.precio)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  No se encontraron resultados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};