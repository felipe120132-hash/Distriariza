import React, { memo } from 'react';
import { imgSrc, moneda } from '../utils/helpers.js';

export const TarjetaDestacado = memo(({ p, onAdd, onOpen, ratings, onRate, rank }) => (
  <div className="prod-card" style={{ background:'var(--card-bg)', borderRadius:'24px', overflow:'hidden', boxShadow:'var(--shadow-sm)', flexShrink:0, width:'200px' }}>
    <div style={{ position:'relative' }}>
      <div onClick={() => onOpen(p)} className="img-container"
        style={{ minHeight:'160px', height:'40vw', maxHeight:'200px', cursor:'pointer', padding:'12px', borderRadius:'24px 24px 0 0', overflow:'hidden', background:'var(--card-img-bg, #f0f4f8)', display:'flex', alignItems:'center', justifyContent:'center' }}
      >
        <img src={imgSrc(p.imagen_url)} alt={p.nombre} decoding="async" className="zoom-img img-blend"
          style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }}
        />
      </div>
      <div className="badge-best" style={{ position:'absolute', top:'12px', left:'12px', background: rank===1 ? '#f59e0b' : rank===2 ? '#94a3b8' : rank===3 ? '#cd7c3a' : 'var(--accent)', color:'#fff', borderRadius:'99px', padding:'4px 12px', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.5px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', zIndex:10 }}>
        #{rank} más vendido
      </div>
    </div>
    <div style={{ padding:'14px 16px 16px' }}>
      <h4 onClick={() => onOpen(p)} style={{ fontSize:'0.85rem', fontWeight:500, cursor:'pointer', marginBottom:'6px', lineHeight:1.3, color:'var(--ink)', height:'2.6em', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.nombre}</h4>
      <div style={{ marginBottom:'10px' }}>
        <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color: p.stock > 0 ? '#22c55e' : '#ef4444', background: p.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding:'4px 10px', borderRadius:'8px', display:'inline-block' }}>{p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--ink)' }}>{moneda(p.precio)}</span>
        <button className="send-btn send-btn--sm" onClick={() => onAdd(p)} disabled={p.stock <= 0}>
          <div className="svg-wrapper-1"><div className="svg-wrapper">
            <span className="plus-icon">+</span>
          </div></div>
          <span className="btn-label">{p.stock > 0 ? 'Añadir' : 'Agotado'}</span>
        </button>
      </div>
    </div>
  </div>
));