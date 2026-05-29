import React, { memo } from 'react';
import { imgSrc, moneda } from '../utils/helpers.js';

export const TarjetaProducto = memo(({ p, onAdd, onOpen, ratings, onRate, isBestSeller }) => (
  <div className="prod-card fade-up" style={{ background:'var(--card-bg)', borderRadius:'24px', overflow:'hidden', boxShadow:'var(--shadow-sm)', position:'relative' }}>
    {isBestSeller && (
      <div className="badge-best" style={{ position:'absolute', top:'12px', right:'12px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'4px 12px', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.5px', zIndex:5, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
        🔥 TOP
      </div>
    )}
    <div onClick={() => onOpen(p)} className="img-container"
      style={{ height:'220px', cursor:'pointer', padding:'24px', borderRadius:'24px 24px 0 0' }}
    >
      <img src={imgSrc(p.imagen_url)} alt={p.nombre} loading="lazy" decoding="async" className="zoom-img img-blend"
        style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain' }}
      />
    </div>
    <div style={{ padding:'18px 20px 20px' }}>
      <p style={{ fontSize:'0.7rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>{p.categoria_nombre}</span>
      </p>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)', cursor:'pointer', marginBottom:'10px', lineHeight:1.3, height:'2.6em', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.nombre}</h4>
      <div style={{ marginBottom:'16px' }}>
        <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color: p.stock > 0 ? '#22c55e' : '#ef4444', background: p.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding:'4px 10px', borderRadius:'8px', display:'inline-block' }}>{p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'14px' }}>
        <span style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--ink)', letterSpacing:'-0.5px' }}>{moneda(p.precio)}</span>
        <button className="send-btn" onClick={() => onAdd(p)} disabled={p.stock <= 0}>
          <div className="svg-wrapper-1"><div className="svg-wrapper">
            <span className="plus-icon">+</span>
          </div></div>
          <span className="btn-label">{p.stock > 0 ? 'Añadir' : 'Agotado'}</span>
        </button>
      </div>
    </div>
  </div>
));
