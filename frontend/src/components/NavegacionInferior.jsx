import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PanelHistorial } from './PanelHistorial.jsx';

export const NavegacionInferior = ({ dark, categoria, setCategoria, setBusqueda, totalItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [historialOpen, setHistorialOpen] = useState(false);

  const cartOpen    = location.pathname === '/carrito';
  const reviewsOpen = location.pathname === '/resenas';

  const navegar = (ruta) => {
    setOpen(false);
    if (ruta === '/') { setCategoria('Todos'); setBusqueda(''); }
    navigate(ruta);
  };

  const tabs = [
    {
      label: 'Tienda', ruta: '/',
      activo: categoria === 'Todos' && location.pathname === '/',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      label: 'Mis Pedidos', ruta: null,
      activo: false,
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    },
    {
      label: 'Reseñas', ruta: '/resenas',
      activo: reviewsOpen,
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    },
    {
      label: 'Carrito', ruta: '/carrito',
      activo: cartOpen, badge: totalItems,
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    },
    {
      label: 'Admin', ruta: '/admin',
      activo: location.pathname === '/admin',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
  ];

  return (
    <>
      <style>{`
        .nav-menu-item {
          background-color: transparent;
          border: none;
          padding: 10px 14px;
          color: var(--ink-3);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border-radius: 4px;
          width: 100%;
          font-size: 0.58rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          position: relative;
          transition: background 0.15s;
        }
        .nav-menu-item:not(:active):hover { background-color: var(--border); }
        .nav-menu-item:focus, .nav-menu-item:active { background-color: var(--border); outline: none; }
        .nav-menu-item::before {
          content: "";
          position: absolute;
          top: 5px;
          left: 0px;
          width: 4px;
          height: 80%;
          background-color: var(--accent);
          border-radius: 5px;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .nav-menu-item:focus::before,
        .nav-menu-item:active::before,
        .nav-menu-item--active::before { opacity: 1; }
        .nav-menu-item--active { background-color: var(--border); color: var(--accent); }
        .nav-menu-item svg { width: 16px; height: 16px; flex-shrink: 0; color: #7D8590; }
        .nav-menu-item--active svg { color: var(--accent); }
      `}</style>

      {/* ── PANEL HISTORIAL ── */}
      {historialOpen && <PanelHistorial onClose={() => setHistorialOpen(false)} />}

      {/* ── OVERLAY ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:898, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(2px)' }}
        />
      )}

      {/* ── MENÚ EXPANDIDO ── */}
      <div style={{
        position: 'fixed', bottom: '74px', left: '50%',
        transform: `translateX(-50%) scaleY(${open ? 1 : 0})`,
        transformOrigin: 'bottom center',
        opacity: open ? 1 : 0,
        transition: 'transform 0.25s ease, opacity 0.2s ease',
        background: dark ? '#0D1117' : '#ffffff',
        borderRadius: '12px',
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        border: '1px solid var(--border)',
        zIndex: 899,
        minWidth: '200px',
        pointerEvents: open ? 'all' : 'none',
        overflow: 'hidden',
      }}>
        {tabs.map(({ icon, label, ruta, activo, badge }) => (
          <button
            key={label}
            onClick={() => {
              if (ruta === null) {
                setOpen(false);
                setHistorialOpen(true);
              } else {
                navegar(ruta);
              }
            }}
            className={`nav-menu-item${activo ? ' nav-menu-item--active' : ''}`}
          >
            {icon}
            {label}
            {badge > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#ef4444', color: '#fff',
                fontSize: '0.6rem', minWidth: '18px', height: '18px',
                borderRadius: '99px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, padding: '0 5px',
              }}>{badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── BOTÓN HAMBURGUESA ── */}
      <div style={{
        position: 'fixed', bottom: '16px', left: '50%',
        transform: 'translateX(-50%)',
        background: dark ? '#1a1a1e' : '#ffffff',
        borderRadius: '99px', padding: '12px 28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        border: '1px solid var(--border)',
        zIndex: 900, display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {!open && totalItems > 0 && (
          <span style={{
            background: '#ef4444', color: '#fff', fontSize: '0.65rem',
            padding: '2px 8px', borderRadius: '99px', fontWeight: 700,
          }}>{totalItems}</span>
        )}

        <label htmlFor="burger-menu" style={{ width:40, height:30, position:'relative', cursor:'pointer', display:'block' }}>
          <input
            type="checkbox"
            id="burger-menu"
            checked={open}
            onChange={e => setOpen(e.target.checked)}
            style={{ display:'none' }}
          />
          <span style={{
            display:'block', position:'absolute', height:'4px', width:'100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out', transformOrigin:'left center',
            top:'0px', left: open ? '5px' : '0',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}/>
          <span style={{
            display:'block', position:'absolute', height:'4px',
            width: open ? '0%' : '100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out', transformOrigin:'left center',
            top:'50%', transform:'translateY(-50%)',
            opacity: open ? 0 : 1,
          }}/>
          <span style={{
            display:'block', position:'absolute', height:'4px', width:'100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out', transformOrigin:'left center',
            top: open ? '28px' : '100%',
            left: open ? '5px' : '0',
            transform: open ? 'rotate(-45deg)' : 'translateY(-100%)',
          }}/>
        </label>
      </div>
    </>
  );
};