import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavegacionInferior = ({ dark, categoria, setCategoria, setBusqueda, totalItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartOpen = location.pathname === '/carrito';
  const reviewsOpen = location.pathname === '/resenas';

  return (
    <div style={{ position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)', background: dark ? '#1a1a1e' : '#ffffff', borderRadius:'99px', padding:'10px 32px', display:'flex', gap:'36px', alignItems:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.15)', zIndex:900, border:`1px solid var(--border)` }}>
      <button className="nav-tab" onClick={() => { setCategoria('Todos'); setBusqueda(''); navigate('/'); }} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
        <span className="nav-tab-icon" style={{ fontSize:'1.2rem' }}>🏪</span>
        <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color:categoria==='Todos' && location.pathname === '/' ?'var(--accent)':'var(--ink-3)' }}>Tienda</span>
      </button>
      <button className="nav-tab" onClick={() => navigate('/resenas')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
        <span className="nav-tab-icon" style={{ fontSize:'1.2rem' }}>💬</span>
        <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color: reviewsOpen ? 'var(--accent)' : 'var(--ink-3)' }}>Reseñas</span>
      </button>
      <button className="nav-tab" onClick={() => navigate('/carrito')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', position:'relative' }}>
        <span className="nav-tab-icon" style={{ fontSize:'1.2rem' }}>🛒</span>
        {totalItems > 0 && (
          <span className="nav-tab-badge" style={{ position:'absolute', top:'-4px', right:'-10px', background:'#ef4444', color:'#fff', fontSize:'0.58rem', width:'17px', height:'17px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, border:'2px solid var(--surface)' }}>
            {totalItems}
          </span>
        )}
        <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color: cartOpen ? 'var(--accent)' : 'var(--ink-3)' }}>Carrito</span>
      </button>
    </div>
  );
};
