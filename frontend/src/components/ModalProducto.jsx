import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imgSrc, moneda, slugify } from '../utils/helpers.js';
import { DESCRIPCIONES, BEST_SELLER_NAMES, OPCIONES_COLORES } from '../constants/index.js';
import { BACKEND } from '../constants/index.js';
import axios from 'axios';

export const ModalProducto = ({ p, onClose, onAdd, ratings, onRate, productos = [] }) => {
  const navigate = useNavigate();
  const desc = DESCRIPCIONES[p.nombre];
  const isBest = BEST_SELLER_NAMES.includes(p.nombre);
  const colores = OPCIONES_COLORES[p.nombre];
  const [colorSel, setColorSel] = useState(colores ? colores[0] : null);
  const [imagenesExtra, setImagenesExtra] = useState([]);
  const [imgActiva, setImgActiva] = useState(imgSrc(p.imagen_url));

  useEffect(() => {
    axios.get(`${BACKEND}/api/productos/${p.id}/imagenes`)
      .then(r => setImagenesExtra(r.data))
      .catch(() => {});
  }, [p.id]);

  const todasLasImagenes = [
    { id: 'principal', imagen_url: p.imagen_url },
    ...imagenesExtra,
  ];

  const relacionados = productos
    .filter(x => x.id !== p.id && x.categoria_id === p.categoria_id && x.stock > 0)
    .slice(0, 6);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(10,10,10,0.6)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:3000 }} />
      <div className="modal modal-sheet" style={{ position:'fixed', zIndex:3001, background:'var(--surface)', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} className="close-btn-custom" style={{ position:'absolute', top:'16px', right:'16px', zIndex:10 }} aria-label="Cerrar">✕</button>

        {/* ── GALERÍA ── */}
        <div style={{ background:'#fff', borderRadius:'28px 28px 0 0', overflow:'hidden', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'20px' }}>
          {isBest && (
            <div style={{ position:'absolute', top:'20px', left:'24px', background:'var(--gold)', color:'#000', borderRadius:'99px', padding:'5px 14px', fontSize:'0.7rem', fontWeight:800, boxShadow:'0 4px 12px rgba(0,0,0,0.1)', zIndex:2 }}>🔥 Más vendido</div>
          )}

          <div style={{ width:'100%', height:'280px', borderRadius:'28px 28px 20px 20px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 24px', boxSizing:'border-box' }}>
            <img
              className="modal-img img-blend"
              src={imgActiva}
              alt={p.nombre}
              style={{ maxWidth:'85%', maxHeight:'85%', objectFit:'contain', display:'block', filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.12))', transition:'opacity 0.2s', borderRadius:'16px' }}
            />
          </div>

          {todasLasImagenes.length > 1 && (
            <div style={{ display:'flex', gap:'8px', marginTop:'16px', overflowX:'auto', paddingBottom:'4px', scrollbarWidth:'none', width:'100%', justifyContent:'center', paddingLeft:'16px', paddingRight:'16px' }}>
              {todasLasImagenes.map((img, i) => {
                const url = imgSrc(img.imagen_url);
                const activa = imgActiva === url;
                return (
                  <div
                    key={img.id}
                    onClick={() => setImgActiva(url)}
                    style={{ width:'60px', height:'60px', borderRadius:'10px', flexShrink:0, background:'#fff', padding:'4px', cursor:'pointer', border: activa ? '2.5px solid var(--accent)' : '2px solid var(--border)', transition:'border-color 0.2s, transform 0.15s', transform: activa ? 'scale(1.05)' : 'scale(1)', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >
                    <img src={url} alt={`Vista ${i + 1}`} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:'6px' }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── INFO ── */}
        <div style={{ padding:'24px 28px 28px' }}>
          <p className="modal-content-1" style={{ fontSize:'0.68rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:'6px' }}>
            {p.categoria_nombre}
          </p>
          <h2 className="modal-content-2" style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', marginBottom:'10px', lineHeight:1.2 }}>{p.nombre}</h2>

          {colores && (
            <div className="modal-content-2" style={{ marginBottom:'20px' }}>
              <p style={{ fontSize:'0.7rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'10px' }}>Elige un color:</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {colores.map(c => (
                  <button key={c} onClick={() => setColorSel(c)}
                    style={{ padding:'6px 14px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', border: colorSel === c ? '2.5px solid var(--accent)' : '1.5px solid var(--border)', background: colorSel === c ? 'var(--accent)' : 'transparent', color: colorSel === c ? '#fff' : 'var(--ink)', transition: 'all 0.2s' }}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-content-2" style={{ marginBottom:'18px' }}>
            <span style={{ fontSize:'0.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color: p.stock > 0 ? '#16a34a' : '#ef4444', background: p.stock > 0 ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', padding:'6px 14px', borderRadius:'10px', display:'inline-block' }}>
              {p.stock > 0 ? `STOCK: ${p.stock}` : 'AGOTADO'}
            </span>
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
            <button className="send-btn send-btn--lg" onClick={() => { onAdd({...p, colorSeleccionado: colorSel}); onClose(); }} disabled={p.stock <= 0}>
              <div className="svg-wrapper-1"><div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/></svg>
              </div></div>
              <span>{p.stock > 0 ? 'Añadir al carrito' : 'Agotado'}</span>
            </button>
          </div>

          {/* ── PRODUCTOS RELACIONADOS ── */}
          {relacionados.length > 0 && (
            <div style={{ marginTop:'32px', paddingTop:'24px', borderTop:'1px solid var(--border)' }}>
              <p style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'16px' }}>
                También en {p.categoria_nombre}
              </p>
              <div style={{ display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'8px', scrollbarWidth:'none' }}>
                {relacionados.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/producto/${slugify(rel.nombre)}`)}
                    style={{ background:'var(--bg)', borderRadius:'12px', padding:'12px', cursor:'pointer', border:'1px solid var(--border)', transition:'transform 0.2s', display:'flex', flexDirection:'column', gap:'8px', flexShrink:0, width:'140px' }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                  >
                    <div style={{ borderRadius:'8px', overflow:'hidden', height:'90px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src={imgSrc(rel.imagen_url)} alt={rel.nombre} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                    </div>
                    <p style={{ fontSize:'0.73rem', fontWeight:600, color:'var(--ink)', lineHeight:1.3, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {rel.nombre}
                    </p>
                    <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--accent)' }}>{moneda(rel.precio)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};