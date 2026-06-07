import { generarPDF } from '../utils/generarPDF.js';
import * as XLSX from 'xlsx';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { imgSrc, moneda, normaliza } from '../utils/helpers.js';
import { BACKEND } from '../constants/index.js';

export const PanelAdmin = ({ onClose, productos, onRefresh }) => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [modo, setModo] = useState('lista');
  const [selected, setSelected] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [seccion, setSeccion] = useState('dashboard');
  const [pedidos, setPedidos] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [stats, setStats] = useState(null);
  const [cargandoStats, setCargandoStats] = useState(false);

  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [cat, setCat] = useState('1');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      axios.get(`${BACKEND}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      }).then(() => {
        setToken(savedToken);
        setAuth(true);
      }).catch(() => {
        sessionStorage.removeItem('admin_token');
      });
    }
  }, []);

  useEffect(() => {
    if (auth && seccion === 'pedidos') fetchPedidos();
    if (auth && seccion === 'dashboard') fetchStats();
  }, [auth, seccion]);

  const fetchStats = async () => {
    setCargandoStats(true);
    try {
      const res = await axios.get(`${BACKEND}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (e) {
      console.error('Error al cargar stats:', e);
    } finally {
      setCargandoStats(false);
    }
  };

  const fetchPedidos = async () => {
    setCargandoPedidos(true);
    try {
      const res = await axios.get(`${BACKEND}/api/pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPedidos(res.data);
    } catch (e) {
      console.error('Error al cargar pedidos:', e);
    } finally {
      setCargandoPedidos(false);
    }
  };

  const exportarExcel = () => {
    const filas = pedidos.map(p => {
      const items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items;
      return {
        'Pedido #': String(p.id).padStart(5, '0'),
        'Fecha': new Date(p.creado_en).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        'Cliente': p.cliente_nombre,
        'Teléfono': p.cliente_telefono || '-',
        'Ciudad': p.cliente_ciudad || '-',
        'Dirección': p.cliente_direccion || '-',
        'Productos': items.map(i => `${i.nombre} x${i.cantidad}`).join(' | '),
        'Total': p.total,
        'Estado': p.estado,
      };
    });
    const hoja = XLSX.utils.json_to_sheet(filas);
    hoja['!cols'] = [{ wch:10 },{ wch:18 },{ wch:20 },{ wch:14 },{ wch:14 },{ wch:24 },{ wch:50 },{ wch:12 },{ wch:12 }];
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Pedidos');
    XLSX.writeFile(libro, `pedidos-ariza-${new Date().toLocaleDateString('es-CO').replace(/\//g,'-')}.xlsx`);
  };

  const actualizarEstado = async (id, estado) => {
    try {
      await axios.put(`${BACKEND}/api/pedidos/${id}/estado`, { estado }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    } catch (e) { console.error('Error al actualizar estado:', e); }
  };

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este pedido?')) return;
    try {
      await axios.delete(`${BACKEND}/api/pedidos/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      setPedidos(prev => prev.filter(p => p.id !== id));
      setPedidoExpandido(null);
    } catch (e) { alert('No se pudo eliminar el pedido.'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); setError('');
    try {
      const res = await axios.post(`${BACKEND}/api/auth/login`, { username: user, password: pass });
      const jwt = res.data.token;
      setToken(jwt);
      sessionStorage.setItem('admin_token', jwt);
      setAuth(true);
      setUser(''); setPass('');
    } catch (err) {
      const data = err.response?.data;
      if (data?.code === 'RATE_LIMITED') setError('🔒 Demasiados intentos. Intenta de nuevo en 15 minutos.');
      else if (err.response?.status === 401) setError('❌ Credenciales incorrectas.');
      else setError('Error de conexión. Intenta de nuevo.');
    } finally { setLoginLoading(false); }
  };

  const handleLogout = () => {
    setAuth(false); setToken(''); setUser(''); setPass('');
    sessionStorage.removeItem('admin_token');
    setModo('lista'); setSeccion('dashboard');
  };

  const authHeaders = () => ({ 'Authorization': `Bearer ${token}` });

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      const code = err.response?.data?.code;
      setError(code === 'TOKEN_EXPIRED' ? '⏰ Tu sesión ha expirado.' : '🔒 Sesión inválida.');
      handleLogout(); return true;
    }
    return false;
  };

  const handleEdit = (p) => {
    setSelected(p); setNombre(p.nombre); setDesc(p.descripcion);
    setPrecio(p.precio); setStock(p.stock !== undefined ? p.stock : 0);
    setCat(p.categoria_id); setImagen(null); setModo('editar');
  };

  const handleNew = () => {
    setSelected(null); setNombre(''); setDesc(''); setPrecio('');
    setStock('0'); setCat('1'); setImagen(null); setModo('nuevo');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true); setError('');
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', desc);
    formData.append('precio', precio.toString().replace(',', '.'));
    formData.append('stock', stock);
    formData.append('categoria_id', cat);
    if (imagen) formData.append('imagen', imagen);
    try {
      if (modo === 'nuevo') {
        await axios.post(`${BACKEND}/api/productos`, formData, { headers: authHeaders() });
        setSuccessMsg('¡Producto creado con éxito!');
      } else {
        await axios.put(`${BACKEND}/api/productos/${selected.id}`, formData, { headers: authHeaders() });
        setSuccessMsg('¡Producto actualizado con éxito!');
      }
      onRefresh(); setModo('lista');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      if (!handleAuthError(err)) setError('Error al guardar el producto');
    } finally { setCargando(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await axios.delete(`${BACKEND}/api/productos/${id}`, { headers: authHeaders() });
      onRefresh();
    } catch (err) {
      if (!handleAuthError(err)) alert('Error al eliminar');
    }
  };

  const productosFiltrados = productos.filter(p =>
    normaliza(p.nombre).includes(normaliza(busquedaAdmin))
  );

  const colorEstado = (estado) => {
    if (estado === 'pendiente')  return { bg: 'rgba(245,158,11,0.12)',  color: '#d97706' };
    if (estado === 'enviado')    return { bg: 'rgba(26,92,255,0.12)',   color: '#1a5cff' };
    if (estado === 'entregado')  return { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' };
    if (estado === 'cancelado')  return { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' };
    return { bg: 'var(--border)', color: 'var(--ink-3)' };
  };
  const Variacion = ({ valor, montoComparacion, labelComparacion }) => {
    if (valor !== null && valor !== undefined) {
      const positivo = valor >= 0;
      return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        background: positivo ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        color: positivo ? '#16a34a' : '#ef4444',
        fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
        borderRadius: '99px', marginTop: '8px'
        }}>
          {positivo ? '↑' : '↓'} {Math.abs(valor)}% vs. {labelComparacion}
          </span>
          );
        }
        if (montoComparacion > 0) {
          return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--ink-3)',
            fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px',
            borderRadius: '99px', marginTop: '8px'
            }}>
              {labelComparacion}: {moneda(montoComparacion)}
              </span>
              );
            }
            return null;
          };
          return (
          <>
          <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:4000 }} />
          <div className="panel panel-admin" style={{
            position:'fixed', top:0, right:0, width:'100%', maxWidth:'min(600px, 100vw)',
            height:'100%', background:'var(--bg)', zIndex:4001,
            display:'flex', flexDirection:'column', overflow:'hidden'
            }}>

        {/* ── HEADER ── */}
        <div style={{
          padding:'20px 24px', background:'var(--surface)',
          borderBottom:'1px solid var(--border)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexShrink: 0,
        }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)' }}>
            Panel Admin
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {auth && (
              <button onClick={handleLogout} className="pill-btn pill-btn--ghost" style={{ padding:'6px 14px', fontSize:'0.7rem', color:'#ef4444' }}>
                Cerrar sesión
              </button>
            )}
            <button onClick={onClose} className="close-btn-custom">✕</button>
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px', paddingBottom: auth ? '80px' : '24px' }}>

          {/* ── LOGIN ── */}
          {!auth ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:'40px' }}>
              <form onSubmit={handleLogin} style={{
                display:'flex', flexDirection:'column', gap:'10px',
                paddingLeft:'2em', paddingRight:'2em', paddingBottom:'1.5em',
                backgroundColor:'#171717', borderRadius:'25px',
                transition:'.4s ease-in-out', minWidth:'280px', border:'1px solid transparent',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.border='1px solid #333'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.border='1px solid transparent'; }}
              >
                <p style={{ textAlign:'center', margin:'2em 0 0.5em', color:'#fff', fontSize:'1.2em' }}>LOGIN</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5em', borderRadius:'25px', padding:'0.6em', backgroundColor:'#171717', boxShadow:'inset 2px 5px 10px rgb(5,5,5)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="white" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  <input placeholder="Usuario" type="text" value={user} onChange={e => setUser(e.target.value)} autoComplete="username" required
                    style={{ background:'none', border:'none', outline:'none', width:'100%', color:'#d3d3d3', fontSize:'0.9rem' }} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5em', borderRadius:'25px', padding:'0.6em', backgroundColor:'#171717', boxShadow:'inset 2px 5px 10px rgb(5,5,5)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="white" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                  <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" required
                    style={{ background:'none', border:'none', outline:'none', width:'100%', color:'#d3d3d3', fontSize:'0.9rem' }} />
                </div>
                {error && (
                  <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'8px 12px', fontSize:'0.78rem', color:'#ef4444', textAlign:'center' }}>
                    {error}
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'center', marginTop:'1.5em' }}>
                  <button type="submit" disabled={loginLoading || !pass.trim() || !user.trim()}
                    style={{ padding:'0.5em 2.5em', borderRadius:'5px', border:'none', outline:'none', transition:'.4s ease-in-out', backgroundColor:'#252525', color:'white', cursor: loginLoading || !pass.trim() || !user.trim() ? 'not-allowed' : 'pointer', opacity: loginLoading || !pass.trim() || !user.trim() ? 0.6 : 1, fontSize:'0.9rem' }}
                    onMouseEnter={e => { if (!loginLoading && pass.trim() && user.trim()) e.currentTarget.style.backgroundColor='black'; }}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor='#252525'}
                  >
                    {loginLoading ? 'Verificando...' : 'Ingresar'}
                  </button>
                </div>
                <p style={{ fontSize:'0.65rem', color:'#666', textAlign:'center', marginBottom:'1em', lineHeight:1.5 }}>🛡️ Máximo 5 intentos cada 15 min</p>
              </form>
            </div>

          ) : (
            <>
              {/* ── DASHBOARD ── */}
              {seccion === 'dashboard' && modo === 'lista' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>Resumen de Actividad</h3>

                  {cargandoStats ? (
                    <div style={{ textAlign:'center', padding:'40px' }}>
                      <p style={{ color:'var(--ink-3)', fontSize:'0.9rem' }}>Cargando estadísticas...</p>
                    </div>
                  ) : stats ? (
                    <>
                      {/* MÉTRICAS */}
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'18px' }}>
                          <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.6px' }}>Ventas de Hoy</p>
                          <p style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--ink)', marginTop:'6px', lineHeight:1 }}>{moneda(stats.ventas_dia)}</p>
                          <Variacion valor={stats.variacion_dia} montoComparacion={stats.ventas_ayer} labelComparacion="ayer" />
                          </div>
                          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'18px' }}>
                            <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.6px' }}>Ingresos del Mes</p>
                            <p style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--ink)', marginTop:'6px', lineHeight:1 }}>{moneda(stats.ventas_mes)}</p>
                            <Variacion valor={stats.variacion_mes} montoComparacion={stats.ventas_mes_anterior} labelComparacion="mes ant." />
                            </div>
                        </div>
                        
                      {/* PEDIDOS PENDIENTES */}
                      {stats.pedidos_pendientes > 0 && (
                        <div style={{
                          background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
                          borderRadius:'14px', padding:'14px 18px',
                          display:'flex', alignItems:'center', justifyContent:'space-between'
                        }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <span style={{ fontSize:'1.2rem' }}>⏳</span>
                            <div>
                              <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#d97706' }}>Pedidos pendientes</p>
                              <p style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>Requieren atención</p>
                            </div>
                          </div>
                          <span style={{ background:'rgba(245,158,11,0.2)', color:'#d97706', fontWeight:800, fontSize:'1.1rem', padding:'4px 14px', borderRadius:'99px' }}>
                            {stats.pedidos_pendientes}
                          </span>
                        </div>
                      )}

                      {/* TOP PRODUCTOS */}
                      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'18px' }}>
                        <p style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--ink)', marginBottom:'14px' }}>🔥 Top Productos Más Vendidos</p>
                        {stats.productos_top && stats.productos_top.length > 0 ? (
                          <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
                            {stats.productos_top.map((prod, idx) => {
                              const prodData = productos.find(p => String(p.id) === String(prod.id));
                              return (
                                <div key={prod.id} style={{
                                  display:'flex', alignItems:'center', gap:'12px',
                                  padding:'10px 0',
                                  borderBottom: idx < stats.productos_top.length - 1 ? '1px solid var(--border)' : 'none'
                                }}>
                                  <span style={{ fontSize:'0.75rem', fontWeight:800, color:'var(--ink-3)', minWidth:'24px' }}>#{idx+1}</span>
                                  {prodData && (
                                    <img src={imgSrc(prodData.imagen_url)} style={{ width:'36px', height:'36px', objectFit:'cover', borderRadius:'8px', flexShrink:0 }} />
                                  )}
                                  <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--ink)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                    {prod.nombre}
                                  </span>
                                  <span style={{ background:'rgba(34,197,94,0.12)', color:'#16a34a', padding:'3px 10px', borderRadius:'99px', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>
                                    {prod.cantidad_vendida} ud.
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ fontSize:'0.8rem', color:'var(--ink-3)' }}>No hay datos de ventas aún.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign:'center', padding:'40px' }}>
                      <p style={{ color:'var(--ink-3)', fontSize:'0.9rem' }}>No se pudieron cargar las estadísticas.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── PRODUCTOS ── */}
              {seccion === 'productos' && modo === 'lista' && (
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', alignItems:'center' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>
                      Productos ({productosFiltrados.length}{busquedaAdmin ? ` de ${productos.length}` : ''})
                    </h3>
                    <button onClick={handleNew} className="pill-btn pill-btn--green">+ Nuevo</button>
                  </div>
                  <div style={{ position:'relative', marginBottom:'20px' }}>
                    <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', opacity:0.45, pointerEvents:'none' }}>🔍</span>
                    <input className="form-input" placeholder="Buscar producto..." value={busquedaAdmin} onChange={e => setBusquedaAdmin(e.target.value)} style={{ paddingLeft:'42px' }} />
                    {busquedaAdmin && (
                      <button onClick={() => setBusquedaAdmin('')} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'var(--ink-3)', lineHeight:1 }}>✕</button>
                    )}
                  </div>
                  {successMsg && (
                    <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'0.85rem', color:'#16a34a', fontWeight:600 }}>
                      ✅ {successMsg}
                    </div>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {productosFiltrados.length === 0 ? (
                      <div style={{ textAlign:'center', padding:'40px 20px' }}>
                        <p style={{ fontSize:'1.8rem', marginBottom:'10px' }}>🔍</p>
                        <p style={{ color:'var(--ink-3)', fontSize:'0.88rem' }}>No se encontró "{busquedaAdmin}"</p>
                      </div>
                    ) : (
                      productosFiltrados.map(p => (
                        <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background:'var(--surface)', borderRadius:'12px', border:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                            <img src={imgSrc(p.imagen_url)} style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'8px' }} />
                            <div>
                              <p style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--ink)', maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nombre}</p>
                              <p style={{ fontSize:'0.75rem', color:'var(--ink-2)' }}>{moneda(p.precio)} • Stock: <span style={{ color: p.stock > 0 ? '#16a34a' : '#ef4444', fontWeight:'bold' }}>{p.stock}</span></p>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:'8px' }}>
                            <button onClick={() => handleEdit(p)} className="pill-btn pill-btn--ghost" style={{ padding:'6px 12px', fontSize:'0.7rem' }}>Editar</button>
                            <button onClick={() => handleDelete(p.id)} className="pill-btn" style={{ background:'#ef4444', color:'white', padding:'6px 12px', fontSize:'0.7rem' }}>Borrar</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── PEDIDOS ── */}
              {seccion === 'pedidos' && modo === 'lista' && (
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', alignItems:'center' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>
                      Pedidos ({pedidos.length})
                    </h3>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={fetchPedidos} className="pill-btn pill-btn--ghost" style={{ padding:'6px 14px', fontSize:'0.7rem' }}>🔄</button>
                      <button onClick={exportarExcel} disabled={pedidos.length === 0} className="pill-btn pill-btn--green" style={{ padding:'6px 14px', fontSize:'0.7rem', opacity: pedidos.length === 0 ? 0.5 : 1 }}>📊 Excel</button>
                    </div>
                  </div>

                  {cargandoPedidos ? (
                    <div style={{ textAlign:'center', padding:'40px' }}>
                      <p style={{ color:'var(--ink-3)', fontSize:'0.9rem' }}>Cargando pedidos...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'40px 20px' }}>
                      <p style={{ fontSize:'2rem', marginBottom:'10px' }}>🧾</p>
                      <p style={{ color:'var(--ink-3)', fontSize:'0.88rem' }}>No hay pedidos aún.</p>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      {pedidos.map(p => {
                        const items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items;
                        const { bg, color } = colorEstado(p.estado);
                        const expandido = pedidoExpandido === p.id;
                        return (
                          <div key={p.id} style={{ background:'var(--surface)', borderRadius:'14px', border:'1px solid var(--border)', overflow:'hidden' }}>
                            <div onClick={() => setPedidoExpandido(expandido ? null : p.id)}
                              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', cursor:'pointer' }}>
                              <div>
                                <p style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink)', marginBottom:'2px' }}>
                                  #{String(p.id).padStart(5,'0')} — {p.cliente_nombre}
                                </p>
                                <p style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>
                                  {new Date(p.creado_en).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                </p>
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                <span style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink)' }}>{moneda(p.total)}</span>
                                <span style={{ background:bg, color, fontSize:'0.62rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', padding:'4px 10px', borderRadius:'99px', whiteSpace:'nowrap' }}>{p.estado}</span>
                                <span style={{ color:'var(--ink-3)', fontSize:'0.75rem' }}>{expandido ? '▲' : '▼'}</span>
                              </div>
                            </div>
                            {expandido && (
                              <div style={{ padding:'0 16px 16px', borderTop:'1px solid var(--border)' }}>
                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px', marginBottom:'16px' }}>
                                  {[['📞 Teléfono', p.cliente_telefono], ['🏙️ Ciudad', p.cliente_ciudad], ['📍 Dirección', p.cliente_direccion]].map(([label, val]) => (
                                    <div key={label}>
                                      <p style={{ fontSize:'0.62rem', color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'2px' }}>{label}</p>
                                      <p style={{ fontSize:'0.82rem', color:'var(--ink)' }}>{val || '-'}</p>
                                    </div>
                                  ))}
                                </div>
                                <p style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>Productos</p>
                                <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
                                  {items.map((item, i) => (
                                    <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', color:'var(--ink)', padding:'8px 12px', background:'var(--bg)', borderRadius:'8px' }}>
                                      <span>{item.nombre}{item.color ? ` [${item.color}]` : ''} × {item.cantidad}</span>
                                      <span style={{ fontWeight:600, flexShrink:0, marginLeft:'8px' }}>{moneda(item.precio * item.cantidad)}</span>
                                    </div>
                                  ))}
                                  <div style={{ display:'flex', justifyContent:'flex-end', padding:'8px 12px' }}>
                                    <span style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--ink)' }}>Total: {moneda(p.total)}</span>
                                  </div>
                                </div>
                                <p style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>Cambiar estado</p>
                                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'4px' }}>
                                  {['pendiente', 'enviado', 'entregado', 'cancelado'].map(estado => {
                                    const { bg: b, color: c } = colorEstado(estado);
                                    const activo = p.estado === estado;
                                    return (
                                      <button key={estado} onClick={() => actualizarEstado(p.id, estado)}
                                        style={{ padding:'6px 14px', borderRadius:'99px', border: activo ? 'none' : '1px solid var(--border)', cursor:'pointer', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', background: activo ? b : 'transparent', color: activo ? c : 'var(--ink-3)', transition:'all 0.2s' }}>
                                        {estado}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                                  <button onClick={async () => await generarPDF(p, items, p.total, p.id)} className="pill-btn pill-btn--ghost" style={{ flex:1, justifyContent:'center', fontSize:'0.8rem' }}>
                                    📄 Descargar PDF
                                  </button>
                                  <button onClick={() => eliminarPedido(p.id)} className="pill-btn" style={{ flex:1, justifyContent:'center', fontSize:'0.8rem', background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)' }}>
                                    🗑️ Eliminar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── FORMULARIO NUEVO / EDITAR ── */}
              {(modo === 'nuevo' || modo === 'editar') && (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>{modo === 'nuevo' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
                    <button type="button" onClick={() => setModo('lista')} className="pill-btn pill-btn--ghost">Volver</button>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>Nombre del producto</label>
                    <input required className="form-input" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>Descripción / Detalles</label>
                    <textarea className="form-input" placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} rows={3} />
                  </div>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>Precio (COP)</label>
                      <input required type="number" className="form-input" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>Stock</label>
                      <input required type="number" className="form-input" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>Categoría</label>
                    <select className="form-input" value={cat} onChange={e => setCat(e.target.value)}>
                      <option value="1">Líquidos Vitales</option>
                      <option value="2">Alimentos</option>
                      <option value="3">Equipos</option>
                      <option value="4">Accesorios</option>
                      <option value="5">Plantas</option>
                      <option value="6">Jaulas para Hámster</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink-2)', marginBottom:'6px', display:'block' }}>
                      {modo === 'editar' ? 'Cambiar imagen (opcional)' : 'Subir imagen'}
                    </label>
                    <label htmlFor="file-upload"
                      style={{ height:'160px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', cursor:'pointer', border:'2px dashed var(--border)', background:'var(--bg)', borderRadius:'12px', transition:'border-color 0.2s', boxSizing:'border-box' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                    >
                      {imagen ? (
                        <>
                          <img src={URL.createObjectURL(imagen)} alt="preview" style={{ maxHeight:'100px', maxWidth:'100%', objectFit:'contain', borderRadius:'8px' }} />
                          <span style={{ fontSize:'0.72rem', color:'var(--ink-3)' }}>{imagen.name}</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width:'40px', height:'40px', color:'var(--ink-3)' }}>
                            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" />
                          </svg>
                          <span style={{ fontSize:'0.78rem', color:'var(--ink-3)', fontWeight:500 }}>Click para subir imagen</span>
                        </>
                      )}
                      <input id="file-upload" type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} style={{ display:'none' }} />
                    </label>
                  </div>
                  {error && (
                    <div style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:'10px', padding:'10px 14px', fontSize:'0.8rem', color:'#ef4444', textAlign:'center' }}>
                      {error}
                    </div>
                  )}
                  <button type="submit" disabled={cargando} className="pill-btn pill-btn--accent" style={{ justifyContent:'center', padding:'14px', marginTop:'10px', fontSize:'0.9rem' }}>
                    {cargando ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* ── BARRA INFERIOR ── */}
        {auth && modo === 'lista' && (
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            background:'var(--surface)', borderTop:'1px solid var(--border)',
            display:'flex', padding:'8px 16px 12px',
            gap:'4px',
          }}>
            {[
              { key:'dashboard', label:'Dashboard', icon:(
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              )},
              { key:'productos', label:'Productos', icon:(
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              )},
              { key:'pedidos', label:`Pedidos${pedidos.length > 0 ? ` (${pedidos.length})` : ''}`, icon:(
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              )},
            ].map(tab => (
              <button key={tab.key} onClick={() => setSeccion(tab.key)}
                style={{
                  flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
                  padding:'8px 4px', border:'none', cursor:'pointer', borderRadius:'12px',
                  background: seccion === tab.key ? 'rgba(26,92,255,0.1)' : 'transparent',
                  color: seccion === tab.key ? 'var(--accent)' : 'var(--ink-3)',
                  transition:'all 0.2s',
                }}>
                {tab.icon}
                <span style={{ fontSize:'0.62rem', fontWeight:600 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};