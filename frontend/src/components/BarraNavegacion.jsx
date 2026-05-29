import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BarraNavegacion = ({ dark, setDark, totalItems }) => {
  const navigate = useNavigate();
  return (
    <nav style={{ position:'sticky', top:0, zIndex:1000, background: dark ? '#111115' : '#ffffff', borderBottom:`1px solid var(--border)`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'64px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <img src="/Logo.jpeg" alt="Logo" style={{ height:'38px', width:'38px', borderRadius:'10px', objectFit:'cover' }} onError={e => e.target.src='https://via.placeholder.com/38?text=A'} />
        <div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>Distribuciones Ariza</p>
          <p style={{ fontSize:'0.58rem', color:'var(--accent)', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginTop:'2px' }}>Fish Accessories</p>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontSize:'0.75rem', color:'var(--ink-3)' }}>{dark ? '🌙' : '☀️'}</span>
          <button className="dark-toggle" onClick={() => setDark(d => !d)} aria-label="Modo oscuro" />
        </div>
        <button className="pill-btn pill-btn--ghost" onClick={() => navigate('/admin')} style={{ padding: '8px 14px' }}>
          <span style={{ fontSize: '1.1rem' }}>👤</span> Iniciar Sesión
        </button>
        <button className="cart-btn-custom" onClick={() => navigate('/carrito')} style={{ position:'relative' }}>
          <span style={{ fontSize: '1.1rem' }}>🛒</span> Carrito
          {totalItems > 0 && (
            <span style={{ position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'#fff', fontSize:'0.6rem', fontWeight:700, width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid var(--surface)` }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
