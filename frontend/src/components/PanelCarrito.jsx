import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { imgSrc, moneda } from '../utils/helpers.js';
import { BACKEND } from '../constants/index.js';
import { Contador } from './Contador.jsx';
import { generarPDF } from '../utils/generarPDF.js';
export const PanelCarrito = ({ carrito, onClose, onAdd, onRemove, onChangeQty, onClear, totalCompra, totalItems }) => {
  const [paso, setPaso] = useState('lista');
  const [datos, setDatos] = useState({ nombre:'', direccion:'', ciudad:'', telefono:'' });
  const [enviando, setEnviando] = useState(false);

  const enviarPedido = async () => {
    setEnviando(true);
    let pedidoId = Date.now(); // fallback si falla la BD

    // 1. Guardar en BD
    try {
      const res = await axios.post(`${BACKEND}/api/pedidos`, {
        cliente_nombre: datos.nombre,
        cliente_telefono: datos.telefono,
        cliente_direccion: datos.direccion,
        cliente_ciudad: datos.ciudad,
        total: totalCompra,
        items: carrito.map(p => ({
          id: p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
          color: p.colorSeleccionado || null,
        })),
      });
      pedidoId = res.data.pedidoId;
    } catch (e) {
      console.error('Error al guardar pedido:', e);
    }

    // 2. Descontar stock
    try {
      await axios.post(`${BACKEND}/api/productos/descontar-stock`, {
        items: carrito.map(p => ({ id: p.id, cantidad: p.cantidad }))
      });
    } catch (e) {
      console.error('Error al descontar stock:', e);
    }

    // 3. Generar PDF
    try {
      await generarPDF(datos, carrito, totalCompra, pedidoId);

    } catch (e) {
      console.error('Error al generar PDF:', e);
    }

    // 4. Abrir WhatsApp
    const lista = carrito.map(p =>
      `• ${p.nombre}${p.colorSeleccionado ? ` [Color: ${p.colorSeleccionado}]` : ''} (x${p.cantidad})`
    ).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n*Pedido #:* ${String(pedidoId).padStart(5,'0')}\n*Cliente:* ${datos.nombre}\n*Dirección:* ${datos.direccion}\n*Ciudad:* ${datos.ciudad}\n*Teléfono:* ${datos.telefono}\n\n*Productos:*\n${lista}\n\n*Total: ${moneda(totalCompra)}*`;
    window.open(`https://wa.me/573219627376?text=${encodeURIComponent(msg)}`, '_blank');

    setEnviando(false);
    setPaso('confirmado');
  };

  return (
    <>
      <div onClick={() => { onClose(); setPaso('lista'); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1500 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'400px', height:'100%', background:'var(--surface)', zIndex:2000, display:'flex', flexDirection:'column' }}>
        
        {/* ── HEADER ── */}
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
          <button onClick={() => { onClose(); setPaso('lista'); }} className="close-btn-custom" style={{ marginLeft:'12px' }}>✕</button>
        </div>

        {/* ── CONTENIDO ── */}
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
                  <Contador value={item.cantidad} onAdd={() => onAdd(item)} onRemove={() => onRemove(item.id, item.colorSeleccionado)} onChange={(v) => onChangeQty(item.id, item.colorSeleccionado, v)} />
                </div>
              ))
          )}

          {paso === 'envio' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'4px' }}>
              {[
                { key:'nombre', ph:'Nombre completo' },
                { key:'telefono', ph:'Teléfono' },
                { key:'direccion', ph:'Dirección' },
                { key:'ciudad', ph:'Ciudad' },
              ].map(({ key, ph }) => (
                <input key={key} className="form-input" placeholder={ph} value={datos[key]} onChange={e => setDatos(d => ({...d,[key]:e.target.value}))} />
              ))}
              <div style={{ background:'rgba(26,92,255,0.06)', border:'1px solid rgba(26,92,255,0.15)', borderRadius:'12px', padding:'12px 14px', fontSize:'0.8rem', color:'var(--accent)', marginTop:'4px' }}>
                📄 Se descargará una factura PDF al confirmar el pedido.
              </div>
            </div>
          )}

          {paso === 'confirmado' && (
            <div style={{ textAlign:'center', padding:'60px 16px' }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>✅</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:'8px', color:'var(--ink)' }}>Pedido enviado</h3>
              <p style={{ color:'var(--ink-3)', fontSize:'0.9rem', marginBottom:'8px' }}>Tu factura PDF fue descargada.</p>
              <p style={{ color:'var(--ink-3)', fontSize:'0.9rem', marginBottom:'28px' }}>Te contactaremos pronto por WhatsApp.</p>
              <button className="pill-btn pill-btn--ghost" onClick={() => { onClose(); setPaso('lista'); onClear(); }} style={{ width:'100%', justifyContent:'center', padding:'14px' }}>
                Volver a la tienda
              </button>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        {carrito.length > 0 && paso !== 'confirmado' && (
          <div style={{ padding:'20px 28px', borderTop:'1px solid var(--border)', background:'var(--surface)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'16px' }}>
              <span style={{ fontSize:'0.82rem', color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>Total</span>
              <span style={{ fontSize:'1.4rem', fontWeight:600, color:'var(--ink)' }}>{moneda(totalCompra)}</span>
            </div>
            <button
              className={`pill-btn ${paso==='lista' ? 'pill-btn--accent' : 'pill-btn--green'}`}
              onClick={paso==='lista' ? () => setPaso('envio') : enviarPedido}
              disabled={enviando || (paso==='envio' && (!datos.nombre.trim() || !datos.telefono.trim() || !datos.ciudad.trim()))}
              style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:'0.9rem', opacity: enviando ? 0.7 : 1 }}
            >
              {paso==='lista' ? 'Continuar' : enviando ? 'Procesando...' : '📄 Confirmar y descargar factura'}
            </button>
            {paso === 'lista' && (
              <button onClick={onClear} style={{ width:'100%', marginTop:'12px', background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer', fontSize:'0.85rem', textDecoration:'underline' }}>
                Vaciar carrito
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};