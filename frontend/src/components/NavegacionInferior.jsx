import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavegacionInferior = ({ dark, categoria, setCategoria, setBusqueda, totalItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const cartOpen    = location.pathname === '/carrito';
  const reviewsOpen = location.pathname === '/resenas';

  const navegar = (ruta) => {
    setOpen(false);
    if (ruta === '/') { setCategoria('Todos'); setBusqueda(''); }
    navigate(ruta);
  };

  const tabs = [
    { icon: '🏪', label: 'Tienda',  ruta: '/',        activo: categoria === 'Todos' && location.pathname === '/' },
    { icon: '💬', label: 'Reseñas', ruta: '/resenas', activo: reviewsOpen },
    { icon: '🛒', label: 'Carrito', ruta: '/carrito', activo: cartOpen, badge: totalItems },
    { icon: '👤', label: 'Admin',   ruta: '/admin',   activo: location.pathname === '/admin' },
  ];

  return (
    <>
      {/* ── OVERLAY ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:898, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(2px)' }}
        />
      )}

      {/* ── MENÚ EXPANDIDO ── */}
      <div style={{
        position: 'fixed', bottom: '80px', left: '50%',
        transform: `translateX(-50%) scaleY(${open ? 1 : 0})`,
        transformOrigin: 'bottom center',
        opacity: open ? 1 : 0,
        transition: 'transform 0.25s ease, opacity 0.2s ease',
        background: dark ? '#1a1a1e' : '#ffffff',
        borderRadius: '24px',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        border: '1px solid var(--border)',
        zIndex: 899,
        minWidth: '180px',
        pointerEvents: open ? 'all' : 'none',
      }}>
        {tabs.map(({ icon, label, ruta, activo, badge }) => (
          <button
            key={ruta}
            onClick={() => navegar(ruta)}
            style={{
              background: activo ? 'var(--accent)' : 'none',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 20px', borderRadius: '16px',
              transition: 'background 0.15s',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{icon}</span>
            <span style={{
              fontSize: '0.85rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.6px',
              color: activo ? '#fff' : 'var(--ink)',
            }}>{label}</span>
            {badge > 0 && (
              <span style={{
                position: 'absolute', top: '8px', left: '34px',
                background: '#ef4444', color: '#fff',
                fontSize: '0.55rem', width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700,
                border: '2px solid var(--surface)',
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
          {/* Línea 1 */}
          <span style={{
            display:'block', position:'absolute',
            height:'4px', width:'100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out',
            transformOrigin:'left center',
            top: open ? '0px' : '0px',
            left: open ? '5px' : '0',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}/>
          {/* Línea 2 */}
          <span style={{
            display:'block', position:'absolute',
            height:'4px', width: open ? '0%' : '100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out',
            transformOrigin:'left center',
            top:'50%', transform:'translateY(-50%)',
            opacity: open ? 0 : 1,
          }}/>
          {/* Línea 3 */}
          <span style={{
            display:'block', position:'absolute',
            height:'4px', width:'100%',
            background:'var(--ink)', borderRadius:'9px',
            transition:'.25s ease-in-out',
            transformOrigin:'left center',
            top: open ? '28px' : '100%',
            left: open ? '5px' : '0',
            transform: open ? 'rotate(-45deg)' : 'translateY(-100%)',
          }}/>
        </label>
      </div>
    </>
  );
};