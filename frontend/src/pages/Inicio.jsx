import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeroAcuario } from '../components/HeroAcuario.jsx';
import { TarjetaDestacado } from '../components/TarjetaDestacado.jsx';
import { TarjetaProducto } from '../components/TarjetaProducto.jsx';
import { normaliza, slugify } from '../utils/helpers.js';
import { COLECCIONES, BEST_SELLER_NAMES } from '../constants/index.js';

export const Inicio = ({ productos, busqueda, setBusqueda, scrollY, addItem, ratings, handleRate }) => {
  const navigate = useNavigate();
  const { cat } = useParams();
  const [orden, setOrden] = useState('recomendado');

  const categoriaParam = cat ? cat.replace(/-/g, ' ') : 'Todos';
  const coleccionEncontrada = COLECCIONES.find(c => normaliza(c.val) === normaliza(categoriaParam));
  const categoriaActual = coleccionEncontrada ? coleccionEncontrada.val : (cat ? categoriaParam : 'Todos');

  const bestSellers = BEST_SELLER_NAMES.map(name => productos.find(p => p.nombre === name)).filter(Boolean).slice(0, 5);

  let visibles = productos.filter(p => {
    const matchBusq = normaliza(p.nombre).includes(normaliza(busqueda));
    if (categoriaActual === 'Todos') return matchBusq;
    const prodCat = normaliza(p.categoria_nombre || '');
    const flt = normaliza(categoriaActual);
    return matchBusq && (prodCat === flt || prodCat.includes(flt) || flt.includes(prodCat));
  });

  if (orden === 'stock') {
    visibles = visibles.filter(p => p.stock > 0);
  } else if (orden === 'precio_asc') {
    visibles = visibles.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'precio_desc') {
    visibles = visibles.sort((a, b) => b.precio - a.precio);
  }

  const handleCategoriaClick = (nuevaCat) => {
    setBusqueda('');
    if (nuevaCat === 'Todos') {
      navigate('/');
    } else {
      navigate(`/categoria/${normaliza(nuevaCat).replace(/\s+/g, '-')}`);
    }
  };

  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'sticky', top:64, zIndex:0, height:440, overflow:'hidden' }}>
        <HeroAcuario scrollY={scrollY} />
      </div>

      <main style={{ position:'relative', zIndex:1, background:'var(--bg)', borderRadius:'32px 32px 0 0', marginTop:-16, padding:'56px 24px 120px', boxShadow:'0 -16px 48px rgba(0,0,0,0.18)', maxWidth:'none' }}>
        <div key={categoriaActual} className="page-transition" style={{ maxWidth:1200, margin:'0 auto' }}>

          {bestSellers.length > 0 && !busqueda && (
            <section style={{ marginBottom:'48px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                <span style={{ fontSize:'1.3rem' }}>🔥</span>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:700, color:'var(--ink)' }}>Más vendidos</h2>
                <div style={{ flex:1, height:'1px', background:'var(--border)', marginLeft:'8px' }} />
              </div>
              <div className="best-scroll">
                {bestSellers.map((p, i) => (
                  <TarjetaDestacado key={p.id} p={p} onAdd={addItem} onOpen={(prod) => navigate('/producto/' + slugify(prod.nombre))} ratings={ratings} onRate={handleRate} rank={i+1} />
                ))}
              </div>
            </section>
          )}

          {!busqueda && (
            <section style={{ marginBottom:'48px', overflow:'visible' }}>
              <div className="story-scroll">
                <button
                  className={`story-highlight ${categoriaActual === 'Todos' ? 'story-highlight--on' : 'story-highlight--off'}`}
                  onClick={() => handleCategoriaClick('Todos')}
                >
                  <div className="story-ring">
                    <div className="story-icon">
                      <img src="/categories/todos.png" alt="Todos" onError={(e) => { e.target.style.display='none'; e.target.parentElement.textContent='🌈'; }} />
                    </div>
                  </div>
                  <span className="story-label">Todos</span>
                </button>
                {COLECCIONES.map((c) => (
                  <button
                    key={c.val}
                    className={`story-highlight ${categoriaActual === c.val ? 'story-highlight--on' : 'story-highlight--off'}`}
                    onClick={() => handleCategoriaClick(c.val)}
                  >
                    <div className="story-ring">
                      <div className="story-icon">
                        <img src={c.img} alt={c.label} onError={(e) => { e.target.style.display='none'; e.target.parentElement.textContent=c.icon; }} />
                      </div>
                    </div>
                    <span className="story-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <h2 style={{ fontSize:'1.2rem', fontWeight:600, color:'var(--ink)' }}>{categoriaActual === 'Todos' ? 'Todos los productos' : categoriaActual}</h2>
                <span style={{ fontSize:'0.85rem', color:'var(--ink-3)', background:'var(--border)', padding:'2px 8px', borderRadius:'12px' }}>{visibles.length}</span>
              </div>
              
              <select 
                value={orden} 
                onChange={(e) => setOrden(e.target.value)}
                style={{
                  padding: '8px 36px 8px 16px', borderRadius: '20px', border: '1px solid var(--border)',
                  background: `var(--surface) url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23a0a0a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 12px center / 16px auto`,
                  color: 'var(--ink)', fontSize: '0.95rem', fontWeight: 500,
                  cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-body)',
                  appearance: 'none', WebkitAppearance: 'none'
                }}
              >
                <option value="recomendado">Recomendados</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
                <option value="stock">Solo en stock</option>
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
              {visibles.map(p => (
                <TarjetaProducto key={p.id} p={p} onAdd={addItem} onOpen={(prod) => navigate('/producto/' + slugify(prod.nombre))} ratings={ratings} onRate={handleRate} isBestSeller={BEST_SELLER_NAMES.includes(p.nombre)} />
              ))}
            </div>
            {visibles.length === 0 && (
              <div style={{ textAlign:'center', padding:'80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '50%', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <path d="M8 11h6"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize:'1.4rem', fontWeight: 700, marginBottom:'8px', color: 'var(--ink)' }}>¡Ups! No hay resultados</h3>
                <p style={{ color:'var(--ink-3)', maxWidth: '400px', lineHeight: 1.5, marginBottom: '24px' }}>No encontramos productos que coincidan con <b>"{busqueda || categoriaActual}"</b>. Prueba buscando con otras palabras o revisa nuestras categorías.</p>
                <button 
                  onClick={() => { setBusqueda(''); setCategoriaActual('Todos'); }}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '99px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-h)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};