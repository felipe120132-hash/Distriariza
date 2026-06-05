import React, { useState, useEffect } from 'react';
import { moneda } from '../utils/helpers.js';

export const PanelHistorial = ({ onClose }) => {
  const [pedidos, setPedidos] = useState([]);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('mis_pedidos') || '[]');
    setPedidos(guardados.reverse());
  }, []);

  const colorEstado = (estado) => {
    if (estado === 'pendiente')  return { bg: 'rgba(245,158,11,0.12)', color: '#d97706' };
    if (estado === 'enviado')    return { bg: 'rgba(26,92,255,0.12)',  color: '#1a5cff' };
    if (estado === 'entregado')  return { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' };
    if (estado === 'cancelado')  return { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' };
    return { bg: 'var(--border)', color: 'var(--ink-3)' };
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1500 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'400px', height:'100%', background:'var(--surface)', zIndex:2000, display:'flex', flexDirection:'column' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'center', padding:'24px 28px', borderBottom:'1px solid var(--border)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:700, color:'var(--ink)', flex:1 }}>
            Mis Pedidos
          </h2>
          <button onClick={onClose} className="close-btn-custom">✕</button>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          {pedidos.length === 0 ? (
            <div style={{ textAlign:'center', marginTop:'60px' }}>
              <p style={{ fontSize:'2.5rem', marginBottom:'12px' }}>📦</p>
              <p style={{ color:'var(--ink-3)', fontSize:'0.9rem', marginBottom:'6px' }}>No tienes pedidos aún.</p>
              <p style={{ color:'var(--ink-3)', fontSize:'0.8rem' }}>Tus pedidos aparecerán aquí después de confirmarlos.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {pedidos.map((p, i) => {
                const { bg, color } = colorEstado(p.estado);
                const isOpen = expandido === i;
                return (
                  <div key={i} style={{ background:'var(--card-bg)', borderRadius:'14px', border:'1px solid var(--border)', overflow:'hidden' }}>

                    {/* Cabecera */}
                    <div
                      onClick={() => setExpandido(isOpen ? null : i)}
                      style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', cursor:'pointer' }}
                    >
                      <div>
                        <p style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink)', marginBottom:'2px' }}>
                          Pedido #{String(p.pedidoId).padStart(5,'0')}
                        </p>
                        <p style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>
                          {new Date(p.fecha).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <span style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink)' }}>{moneda(p.total)}</span>
                        <span style={{ background:bg, color, fontSize:'0.62rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', padding:'4px 10px', borderRadius:'99px' }}>
                          {p.estado}
                        </span>
                        <span style={{ color:'var(--ink-3)', fontSize:'0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Detalle */}
                    {isOpen && (
                      <div style={{ padding:'0 16px 16px', borderTop:'1px solid var(--border)' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px', marginBottom:'14px' }}>
                          {[
                            ['📍 Dirección', p.direccion],
                            ['🏙️ Ciudad', p.ciudad],
                            ['📞 Teléfono', p.telefono],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <p style={{ fontSize:'0.62rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'2px' }}>{label}</p>
                              <p style={{ fontSize:'0.82rem', color:'var(--ink)' }}>{val || '-'}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>Productos</p>
                        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                          {p.items.map((item, j) => (
                            <div key={j} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', color:'var(--ink)', padding:'8px 12px', background:'var(--bg)', borderRadius:'8px' }}>
                              <span>{item.nombre}{item.color ? ` [${item.color}]` : ''} × {item.cantidad}</span>
                              <span style={{ fontWeight:600, flexShrink:0, marginLeft:'8px' }}>{moneda(item.precio * item.cantidad)}</span>
                            </div>
                          ))}
                          <div style={{ display:'flex', justifyContent:'flex-end', padding:'6px 12px' }}>
                            <span style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--ink)' }}>Total: {moneda(p.total)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};