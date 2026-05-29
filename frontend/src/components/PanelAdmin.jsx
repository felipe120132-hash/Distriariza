import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { imgSrc, moneda, normaliza } from '../utils/helpers.js';
import { BACKEND } from '../constants/index.js';

export const PanelAdmin = ({ onClose, productos, onRefresh }) => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  const [pass, setPass] = useState('');
  const [modo, setModo] = useState('lista'); 
  const [selected, setSelected] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [busquedaAdmin, setBusquedaAdmin] = useState(''); 
  
  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [cat, setCat] = useState('1');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Restaurar sesión existente al montar
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${BACKEND}/api/auth/login`, { password: pass });
      const jwt = res.data.token;
      setToken(jwt);
      sessionStorage.setItem('admin_token', jwt);
      setAuth(true);
      setPass('');
    } catch (err) {
      const data = err.response?.data;
      if (data?.code === 'RATE_LIMITED') {
        setError('🔒 Demasiados intentos. Intenta de nuevo en 15 minutos.');
      } else if (err.response?.status === 401) {
        setError('❌ Contraseña incorrecta.');
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth(false);
    setToken('');
    setPass('');
    sessionStorage.removeItem('admin_token');
    setModo('lista');
  };

  // Helper para headers con JWT
  const authHeaders = () => ({ 'Authorization': `Bearer ${token}` });

  // Manejar errores de autenticación (sesión expirada, etc.)
  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      const code = err.response?.data?.code;
      if (code === 'TOKEN_EXPIRED') {
        setError('⏰ Tu sesión ha expirado. Inicia sesión nuevamente.');
      } else {
        setError('🔒 Sesión inválida. Inicia sesión nuevamente.');
      }
      handleLogout();
      return true;
    }
    return false;
  };

  const handleEdit = (p) => {
    setSelected(p);
    setNombre(p.nombre);
    setDesc(p.descripcion);
    setPrecio(p.precio);
    setStock(p.stock !== undefined ? p.stock : 0);
    setCat(p.categoria_id);
    setImagen(null);
    setModo('editar');
  };

  const handleNew = () => {
    setSelected(null);
    setNombre('');
    setDesc('');
    setPrecio('');
    setStock('0');
    setCat('1');
    setImagen(null);
    setModo('nuevo');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', desc);
    formData.append('precio', precio.toString().replace(',', '.'));
    formData.append('stock', stock);
    formData.append('categoria_id', cat);
    if (imagen) formData.append('imagen', imagen);

    try {
      if (modo === 'nuevo') {
        await axios.post(`${BACKEND}/api/productos`, formData, {
          headers: authHeaders()
        });
        setSuccessMsg('¡Producto creado con éxito!');
      } else {
        await axios.put(`${BACKEND}/api/productos/${selected.id}`, formData, {
          headers: authHeaders()
        });
        setSuccessMsg('¡Producto actualizado con éxito!');
      }
      onRefresh();
      setModo('lista');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError('Error al guardar el producto');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres ocultar/eliminar este producto?')) return;
    try {
      await axios.delete(`${BACKEND}/api/productos/${id}`, {
        headers: authHeaders()
      });
      onRefresh();
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error al eliminar');
      }
    }
  };

  // 👇 PRODUCTOS FILTRADOS
  const productosFiltrados = productos.filter(p =>
    normaliza(p.nombre).includes(normaliza(busquedaAdmin))
  );

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:4000 }} />
      <div className="panel" style={{ position:'fixed', top:0, right:0, width:'100%', maxWidth:'600px', height:'100%', background:'var(--surface)', zIndex:4001, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'24px 28px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--ink)' }}>Panel Admin</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {auth && (
              <button onClick={handleLogout} className="pill-btn pill-btn--ghost" style={{ padding:'6px 14px', fontSize:'0.7rem', color:'#ef4444' }}>
                Cerrar sesión
              </button>
            )}
            <button onClick={onClose} className="close-btn-custom">✕</button>
          </div>
        </div>

        <div style={{ padding:'24px 28px', flex:1 }}>
          {!auth ? (
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth:'320px', margin:'40px auto' }}>
              <div style={{ textAlign:'center', marginBottom:'8px' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🔐</div>
                <h3 style={{ color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:'1.2rem', marginBottom:'4px' }}>Acceso Administrativo</h3>
                <p style={{ color:'var(--ink-3)', fontSize:'0.78rem' }}>Ingresa tu contraseña para gestionar productos</p>
              </div>
              <div className="inputbox">
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" required />
                <span>Contraseña</span>
                <i />
              </div>
              {error && (
                <div style={{ background: error.includes('Demasiados') ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${error.includes('Demasiados') ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)'}`, borderRadius:'10px', padding:'10px 14px', fontSize:'0.8rem', color:'#ef4444', textAlign:'center' }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loginLoading || !pass.trim()} className="pill-btn pill-btn--accent" style={{ justifyContent:'center', padding:'13px', fontSize:'0.88rem', opacity: loginLoading || !pass.trim() ? 0.6 : 1 }}>
                {loginLoading ? 'Verificando...' : 'Ingresar'}
              </button>
              <p style={{ fontSize:'0.65rem', color:'var(--ink-3)', textAlign:'center', lineHeight:1.5 }}>
                🛡️ Conexión segura • Máximo 5 intentos cada 15 min
              </p>
            </form>
          ) : (
            modo === 'lista' ? (
              <div>
                {/* ── HEADER ── */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', alignItems:'center' }}>
                  <h3 style={{ color:'var(--ink)', fontFamily:'var(--font-display)' }}>
                    Productos ({productosFiltrados.length}{busquedaAdmin ? ` de ${productos.length}` : ''})
                  </h3>
                  <button onClick={handleNew} className="pill-btn pill-btn--green">+ Nuevo</button>
                </div>

                {/* ── BARRA DE BÚSQUEDA ── */}
                <div style={{ position:'relative', marginBottom:'20px' }}>
                  <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', opacity:0.45, pointerEvents:'none' }}>🔍</span>
                  <input
                    className="form-input"
                    placeholder="Buscar producto..."
                    value={busquedaAdmin}
                    onChange={e => setBusquedaAdmin(e.target.value)}
                    style={{ paddingLeft:'42px' }}
                  />
                  {busquedaAdmin && (
                    <button
                      onClick={() => setBusquedaAdmin('')}
                      style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'var(--ink-3)', lineHeight:1 }}
                    >✕</button>
                  )}
                </div>

                {successMsg && (
                  <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'0.85rem', color:'#16a34a', fontWeight:600 }}>
                    ✅ {successMsg}
                  </div>
                )}

                {/* ── LISTA DE PRODUCTOS ── */}
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {productosFiltrados.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'40px 20px' }}>
                      <p style={{ fontSize:'1.8rem', marginBottom:'10px' }}>🔍</p>
                      <p style={{ color:'var(--ink-3)', fontSize:'0.88rem' }}>
                        No se encontró ningún producto con "{busquedaAdmin}"
                      </p>
                    </div>
                  ) : (
                    productosFiltrados.map(p => (
                      <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background: 'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <img src={imgSrc(p.imagen_url)} style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'8px' }} />
                          <div>
                            <p style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--ink)', maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nombre}</p>
                            <p style={{ fontSize:'0.75rem', color:'var(--ink-2)' }}>{moneda(p.precio)} • Stock: <span style={{ color: p.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: 'bold' }}>{p.stock}</span></p>
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
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <h3 style={{ color:'var(--ink)', fontFamily:'var(--font-display)' }}>{modo === 'nuevo' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
                  <button type="button" onClick={() => setModo('lista')} className="pill-btn pill-btn--ghost">Volver</button>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Nombre del producto</label>
                  <input required className="form-input" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Descripción / Detalles</label>
                  <textarea className="form-input" placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} rows={3} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Precio (COP)</label>
                    <input required type="number" className="form-input" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Cantidad (Stock)</label>
                    <input required type="number" className="form-input" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px', display: 'block' }}>Categoría</label>
                  <select className="form-input" value={cat} onChange={e=>setCat(e.target.value)}>
                    <option value="1">Líquidos Vitales</option>
                    <option value="2">Alimentos</option>
                    <option value="3">Equipos</option>
                    <option value="4">Accesorios</option>
                    <option value="5">Plantas</option>
                    <option value="6">Jaulas para Hámster</option>
                  </select>
                </div>

                <div style={{ background:'var(--bg)', padding:'16px', borderRadius:'12px', border:'1px dashed var(--border)' }}>
                  <p style={{ fontSize:'0.8rem', color:'var(--ink-2)', marginBottom:'8px', fontWeight:600 }}>{modo === 'editar' ? 'Cambiar imagen (opcional)' : 'Subir imagen'}</p>
                  <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} style={{ color:'var(--ink)', fontSize:'0.8rem' }} />
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
            )
          )}
        </div>
      </div>
    </>
  );
};
