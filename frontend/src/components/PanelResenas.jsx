import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND } from '../constants/index.js';

export const REVIEWS_INICIALES = [
  { id:'r1', nombre:'Valentina Ospina', avatar:'🐠', estrellas:5, fecha:'hace 2 días',    texto:'Llevo 3 años comprando en Distribuciones Ariza y nunca me han fallado. El Acuaprime es increíble, mis peces nunca han estado tan saludables. El envío fue súper rápido y el empaque llegó perfecto. ¡100% recomendado!', producto:'Acuaprime 120ml' },
  { id:'r2', nombre:'Carlos Mendoza',   avatar:'🐡', estrellas:5, fecha:'hace 5 días',    texto:'Compré el Cycle para iniciar mi primer acuario plantado y los resultados son sorprendentes. El agua cristalina desde la primera semana, sin pico de amoniaco. El asesoramiento por WhatsApp también es excelente.', producto:'Cycle 120ml' },
  { id:'r3', nombre:'Mariana Ríos',     avatar:'🐹', estrellas:5, fecha:'hace 1 semana',  texto:'Los accesorios para mi hámster son de muy buena calidad, se nota que son productos pensados en el bienestar del animal. Mi Coco está feliz desde que llegó su nueva jaula. El precio es justo y la atención al cliente es de primera.', producto:'Accesorios para hamsters' },
  { id:'r4', nombre:'Andrés Castaño',   avatar:'🐟', estrellas:5, fecha:'hace 2 semanas', texto:'El Alga Clear salvó mi acuario. Tenía una plaga de algas horrible por el sol de la ventana y en menos de 4 días desapareció completamente sin afectar a mis peces. Definitivamente el mejor producto para ese problema.', producto:'Alga Clear 20ml' },
  { id:'r5', nombre:'Luisa Torres',     avatar:'🦈', estrellas:5, fecha:'hace 3 semanas', texto:'Excelente tienda. Tienen todo lo que necesito en un solo lugar, desde tratamientos hasta comida especializada. Los productos son originales y de marcas confiables. Mi acuario marino lleva 2 años perfecto gracias a Ariza.', producto:'Clarify 60ml' },
  { id:'r6', nombre:'Santiago Gómez',   avatar:'🐠', estrellas:5, fecha:'hace 1 mes',     texto:'Pedí por WhatsApp y me respondieron en minutos. El proceso de compra fue muy fácil, el pago seguro y el producto llegó bien sellado y en perfecto estado. El Clarify hace exactamente lo que promete, agua como vidrio.', producto:'Clarify 20ml' },
];

export const PanelResenas = ({ onClose, dark }) => {
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
            <button onClick={onClose} className="close-btn-custom">✕</button>
          </div>
          <div style={{ display:'flex', gap:'4px', marginBottom:'-1px' }}>
            {[{ key:'ver', label:`💬 Leer (${reviews.length})` }, { key:'escribir', label:'✏️ Escribir' }].map(t => (
              <button key={t.key} className="review-tab" onClick={() => setTab(t.key)} style={{ padding:'10px 18px', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:600, background:'none', color: tab===t.key ? 'var(--accent)' : 'var(--ink-3)', borderBottom: tab===t.key ? '2px solid var(--accent)' : '2px solid transparent' }}>
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
