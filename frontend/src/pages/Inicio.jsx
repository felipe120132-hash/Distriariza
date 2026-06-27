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

  const categoriaParam = cat ? cat.replace(/-/g, ' ') : 'Todos';
  const coleccionEncontrada = COLECCIONES.find(c => normaliza(c.val) === normaliza(categoriaParam));
  const categoriaActual = coleccionEncontrada ? coleccionEncontrada.val : (cat ? categoriaParam : 'Todos');

  const bestSellers = BEST_SELLER_NAMES.map(name => productos.find(p => p.nombre === name)).filter(Boolean).slice(0, 5);

  const visibles = productos.filter(p => {
    const matchBusq = normaliza(p.nombre).includes(normaliza(busqueda));
    if (categoriaActual === 'Todos') return matchBusq;
    const prodCat = normaliza(p.categoria_nombre);
    const flt = normaliza(categoriaActual);
    return matchBusq && (prodCat === flt || prodCat.includes(flt) || flt.includes(prodCat));
  });

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
        <HeroAcuario busqueda={busqueda} setBusqueda={setBusqueda} scrollY={scrollY} />
      </div>

      <main style={{ position:'relative', zIndex:1, background:'var(--bg)', borderRadius:'32px 32px 0 0', marginTop:-16, padding:'56px 24px 120px', boxShadow:'0 -16px 48px rgba(0,0,0,0.18)', maxWidth:'none' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>

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

          <section>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--ink)' }}>{categoriaActual === 'Todos' ? 'Todos los productos' : categoriaActual}</h2>
              <span style={{ fontSize:'0.8rem', color:'var(--ink-3)' }}>{visibles.length} resultado{visibles.length!==1&&'s'}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
              {visibles.map(p => (
                <TarjetaProducto key={p.id} p={p} onAdd={addItem} onOpen={(prod) => navigate('/producto/' + slugify(prod.nombre))} ratings={ratings} onRate={handleRate} isBestSeller={BEST_SELLER_NAMES.includes(p.nombre)} />
              ))}
            </div>
            {visibles.length === 0 && (
              <div style={{ textAlign:'center', padding:'80px 20px' }}>
                <p style={{ fontSize:'2rem', marginBottom:'12px' }}>🔍</p>
                <p style={{ color:'var(--ink-3)' }}>No se encontraron productos.</p>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};