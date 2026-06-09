import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PanelHistorial } from './PanelHistorial.jsx';
import Switch from './Switch.jsx';

export const BarraNavegacion = ({ dark, setDark, totalItems, categoria, setCategoria, setBusqueda }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [historialOpen, setHistorialOpen] = useState(false);

  const navegar = (ruta) => {
    setMenuOpen(false);
    if (ruta === '/' && setCategoria && setBusqueda) {
      setCategoria('Todos');
      setBusqueda('');
    }
    navigate(ruta);
  };

  const links = [
    { label: 'Tienda',      ruta: '/',        activo: location.pathname === '/' },
    { label: 'Mis Pedidos', ruta: null,        activo: false },
    { label: 'Reseñas',     ruta: '/resenas',  activo: location.pathname === '/resenas' },
    { label: 'Admin',       ruta: '/admin',    activo: location.pathname === '/admin' },
  ];

  const iconos = {
    'Tienda':      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    'Mis Pedidos': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    'Reseñas':     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    'Admin':       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };

  return (
    <>
      <style>{`
        .nav-link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--ink-2);
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--ink); background: var(--border); }
        .nav-link--active { color: var(--accent); }

        .mobile-menu {
          position: fixed;
          top: 0; left: 0;
          width: 280px;
          height: 100%;
          background: var(--surface);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.18);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu--open { transform: translateX(0); }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink);
          text-align: left;
          width: 100%;
          border-radius: 0;
          transition: background 0.15s;
          position: relative;
        }
        .mobile-menu-item:hover { background: var(--border); }
        .mobile-menu-item--active {
          color: var(--accent);
          background: rgba(26,92,255,0.06);
        }
        .mobile-menu-item--active::before {
          content: '';
          position: absolute;
          left: 0; top: 8px; bottom: 8px;
          width: 4px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
        }
        .mobile-menu-item svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #7D8590;
        }
        .mobile-menu-item--active svg { color: var(--accent); }
      `}</style>

      {historialOpen && <PanelHistorial onClose={() => setHistorialOpen(false)} />}

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1099, backdropFilter:'blur(2px)' }} />
      )}

      {/* ── MENÚ LATERAL MÓVIL ── */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <img src="/Logo.jpeg" alt="Logo" style={{ height:'32px', width:'32px', borderRadius:'8px', objectFit:'cover' }} />
            <p style={{ fontFamily:'var(--font-display)', fontSize:'0.88rem', fontWeight:700, color:'var(--ink)' }}>Distribuciones Ariza</p>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', color:'var(--ink-2)', padding:'4px' }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', paddingTop:'8px' }}>
          {links.map(({ label, ruta, activo }) => (
            <button key={label}
              onClick={() => {
                if (ruta === null) { setMenuOpen(false); setHistorialOpen(true); }
                else navegar(ruta);
              }}
              className={`mobile-menu-item${activo ? ' mobile-menu-item--active' : ''}`}
            >
              {iconos[label]}
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding:'20px 24px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'0.85rem', color:'var(--ink-3)' }}>{dark ? '🌙 Modo oscuro' : '☀️ Modo claro'}</span>
          <div style={{ marginLeft:'auto' }} onClick={() => setDark(d => !d)}>
            <Switch checked={dark} />
          </div>
        </div>
      </div>

      {/* ── NAVBAR PRINCIPAL ── */}
      <nav style={{
        position:'sticky', top:0, zIndex:1000,
        background: dark ? '#111115' : '#ffffff',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center',
        justifyContent:'space-between',
        padding:'0 20px', height:'64px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button className="nav-mobile-only" onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'none', cursor:'pointer', width:'36px', height:'36px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px', padding:'4px', borderRadius:'8px' }}
          >
            <span style={{ display:'block', width:'22px', height:'2.5px', background:'var(--ink)', borderRadius:'4px', transition:'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}/>
            <span style={{ display:'block', width:'22px', height:'2.5px', background:'var(--ink)', borderRadius:'4px', transition:'all 0.25s', opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ display:'block', width:'22px', height:'2.5px', background:'var(--ink)', borderRadius:'4px', transition:'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}/>
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navegar('/')}>
            <img src="/Logo.jpeg" alt="Logo" style={{ height:'38px', width:'38px', borderRadius:'10px', objectFit:'cover' }} onError={e => e.target.src='https://via.placeholder.com/38?text=A'} />
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>Distribuciones Ariza</p>
              <p style={{ fontSize:'0.58rem', color:'var(--accent)', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginTop:'2px' }}>Fish Accessories</p>
            </div>
          </div>
        </div>

        <div className="nav-desktop-only" style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          {links.map(({ label, ruta, activo }) => (
            <button key={label}
              onClick={() => {
                if (ruta === null) setHistorialOpen(true);
                else navegar(ruta);
              }}
              className={`nav-link${activo ? ' nav-link--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div className="nav-desktop-only" style={{ display:'flex', alignItems:'center', gap:'8px' }} onClick={() => setDark(d => !d)}>
            <Switch checked={dark} />
          </div>

          <button onClick={() => navigate('/carrito')}
            style={{ background:'none', border:'2px solid var(--border)', cursor:'pointer', position:'relative', width:'42px', height:'42px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', transition:'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            🛒
            {totalItems > 0 && (
              <span style={{ position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'#fff', fontSize:'0.55rem', fontWeight:700, width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--surface)' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};