import React, { useState } from 'react';
import axios from 'axios';
import { imgSrc, moneda } from '../utils/helpers.js';
import { BACKEND } from '../constants/index.js';
import { Contador } from './Contador.jsx';
import { generarPDF } from '../utils/generarPDF.js';
import { toast } from 'react-hot-toast';

export const PanelCarrito = ({ carrito, onClose, onAdd, onRemove, onChangeQty, onClear, totalCompra, totalItems }) => {
  const [paso, setPaso] = useState('lista');
  const [datos, setDatos] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('datos_cliente') || '{}');
      return {
        nombre: guardados.nombre || '',
        telefono: guardados.telefono || '',
        direccion: guardados.direccion || '',
        ciudad: guardados.ciudad || '',
      };
    } catch {
      return { nombre:'', direccion:'', ciudad:'', telefono:'' };
    }
  });
  const [enviando, setEnviando] = useState(false);

  const enviarPedido = async () => {
    setEnviando(true);
    let pedidoId = Date.now();

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
      toast.error('No se pudo procesar el pedido. Revisa tus datos e intenta de nuevo.');
      setEnviando(false);
      return;
    }

    try {
      const historial = JSON.parse(localStorage.getItem('mis_pedidos') || '[]');
      historial.push({
        pedidoId,
        fecha: new Date().toISOString(),
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
        total: totalCompra,
        estado: 'pendiente',
        items: carrito.map(p => ({
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
          color: p.colorSeleccionado || null,
        })),
      });
      localStorage.setItem('mis_pedidos', JSON.stringify(historial));
    } catch (e) {
      console.error('Error guardando historial:', e);
    }

    // Guardar datos del cliente para autocompletar
    try {
      localStorage.setItem('datos_cliente', JSON.stringify({
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
      }));
    } catch (e) {}

    try {
      await generarPDF(datos, carrito, totalCompra, pedidoId);
    } catch (e) {
      console.error('Error al generar PDF:', e);
    }

    const lista = carrito.map(p =>
      `• ${p.nombre}${p.colorSeleccionado ? ` [Color: ${p.colorSeleccionado}]` : ''} (x${p.cantidad})`
    ).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n*Pedido #:* ${String(pedidoId).padStart(5,'0')}\n*Cliente:* ${datos.nombre}\n*Dirección:* ${datos.direccion}\n*Ciudad:* ${datos.ciudad}\n*Teléfono:* ${datos.telefono}\n\n*Productos:*\n${lista}\n\n*Total: ${moneda(totalCompra)}*`;
    window.open(`https://wa.me/573219627376?text=${encodeURIComponent(msg)}`, '_blank');

    setEnviando(false);
    toast.success('¡Pedido procesado con éxito!');
    setPaso('confirmado');
  };

  const datosGuardados = (() => {
    try {
      const g = JSON.parse(localStorage.getItem('datos_cliente') || '{}');
      return g.nombre ? g : null;
    } catch { return null; }
  })();

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

          {/* ── LISTA ── */}
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

          {/* ── ENVIO ── */}
          {paso === 'envio' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'4px' }}>

              {/* Datos guardados */}
              {datosGuardados && (
                <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:'12px', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', marginBottom:'2px' }}>✓ Datos guardados</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>{datosGuardados.nombre} • {datosGuardados.ciudad}</p>
                  </div>
                  <button
                    onClick={() => setDatos({
                      nombre: datosGuardados.nombre,
                      telefono: datosGuardados.telefono,
                      direccion: datosGuardados.direccion,
                      ciudad: datosGuardados.ciudad,
                    })}
                    className="pill-btn pill-btn--ghost"
                    style={{ padding:'6px 14px', fontSize:'0.72rem', flexShrink:0 }}
                  >
                    Usar estos
                  </button>
                </div>
              )}

              {/* Inputs */}
              <input
                className="form-input"
                placeholder="Nombre completo"
                value={datos.nombre}
                onChange={e => setDatos(d => ({...d, nombre: e.target.value}))}
              />
              <input
                className="form-input"
                placeholder="Teléfono"
                type="tel"
                inputMode="numeric"
                value={datos.telefono}
                onChange={e => setDatos(d => ({...d, telefono: e.target.value.replace(/\D/g, '')}))}
              />

              <input
                className="form-input"
                placeholder="Dirección"
                value={datos.direccion}
                onChange={e => setDatos(d => ({...d, direccion: e.target.value}))}
              />
              <input
                className="form-input"
                placeholder="Ciudad"
                value={datos.ciudad}
                onChange={e => setDatos(d => ({...d, ciudad: e.target.value}))}
              />

              <div style={{ background:'rgba(26,92,255,0.06)', border:'1px solid rgba(26,92,255,0.15)', borderRadius:'12px', padding:'12px 14px', fontSize:'0.8rem', color:'var(--accent)', marginTop:'4px' }}>
                📄 Se descargará una factura PDF al confirmar el pedido.
              </div>
            </div>
          )}

          {/* ── CONFIRMADO ── */}
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