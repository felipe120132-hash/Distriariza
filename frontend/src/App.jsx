import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Utils & Constants
import { BACKEND } from './constants/index.js';
import { normaliza } from './utils/helpers.js';

// Global Styles & Layout
import { EstilosGlobales } from './components/EstilosGlobales.jsx';
import { Cargador } from './components/Cargador.jsx';
import { BarraNavegacion } from './components/BarraNavegacion.jsx';
import { NavegacionInferior } from './components/NavegacionInferior.jsx';

// Pages
import { Inicio } from './pages/Inicio.jsx';

// Modals & Panels
import { PanelCarrito } from './components/PanelCarrito.jsx';
import { PanelResenas } from './components/PanelResenas.jsx';
import { PanelAdmin } from './components/PanelAdmin.jsx';
import { ModalProducto } from './components/ModalProducto.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [productos, setProductos]       = useState([]);
  const [carrito, setCarrito]           = useState([]);
  const [error, setError]               = useState(null);
  const [busqueda, setBusqueda]         = useState('');
  const [categoria, setCategoria]       = useState('Todos'); // Para compatibilidad con BottomNav
  const [cargando, setCargando]         = useState(true);
  const [dark, setDark]                 = useState(() => { const h = new Date().getHours(); return h >= 18 || h < 6; });
  const [ratings, setRatings]           = useState({});
  const [scrollY, setScrollY]           = useState(0);

  const cartOpen      = location.pathname === '/carrito';
  const reviewsOpen   = location.pathname === '/resenas';
  const adminOpen     = location.pathname === '/admin';
  const productoRoute = location.pathname.startsWith('/producto/');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductos = () => {
    axios.get(`${BACKEND}/api/productos`)
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const addItem = useCallback((p) =>
    setCarrito(prev => {
      if (p.stock <= 0) return prev;
      const colorKey = p.colorSeleccionado || '';
      const ex = prev.find(i => i.id === p.id && (i.colorSeleccionado || '') === colorKey);
      if (ex && ex.cantidad >= p.stock) return prev;
      return ex 
        ? prev.map(i => (i.id===p.id && (i.colorSeleccionado || '') === colorKey) ? {...i, cantidad:i.cantidad+1} : i) 
        : [...prev, {...p, cantidad:1}];
    }), []);

  const removeOne  = (id, color) => {
    const colorKey = color || '';
    setCarrito(prev => prev.map(i => (i.id===id && (i.colorSeleccionado || '') === colorKey) ? {...i, cantidad:i.cantidad-1} : i).filter(i => i.cantidad>0));
  };

  const setQty     = (id, color, v) => {
    const colorKey = color || '';
    setCarrito(prev => prev.map(i => {
      if (i.id === id && (i.colorSeleccionado || '') === colorKey) {
        const prod = productos.find(p => p.id === id);
        return {...i, cantidad: prod ? Math.min(v, prod.stock) : v};
      }
      return i;
    }).filter(i => i.cantidad>0));
  };

  const handleRate = (productId, stars) => setRatings(prev => ({...prev, [productId]: stars}));

  const totalItems  = carrito.reduce((s,i) => s+i.cantidad, 0);
  const totalCompra = carrito.reduce((s,i) => s+Math.round(Number(i.precio))*i.cantidad, 0);

  if (cargando) return (<><EstilosGlobales dark={dark}/><Cargador /></>);

  return (
    <>
      <EstilosGlobales dark={dark}/>

      <BarraNavegacion dark={dark} setDark={setDark} totalItems={totalItems} />

      <Routes>
        <Route path="/" element={<Inicio productos={productos} busqueda={busqueda} setBusqueda={setBusqueda} scrollY={scrollY} addItem={addItem} ratings={ratings} handleRate={handleRate} />} />
        <Route path="/categoria/:cat" element={<Inicio productos={productos} busqueda={busqueda} setBusqueda={setBusqueda} scrollY={scrollY} addItem={addItem} ratings={ratings} handleRate={handleRate} />} />
        {/* Las demás rutas se manejan con los modales superpuestos para mantener el layout (por petición anterior) */}
        <Route path="*" element={<Inicio productos={productos} busqueda={busqueda} setBusqueda={setBusqueda} scrollY={scrollY} addItem={addItem} ratings={ratings} handleRate={handleRate} />} />
      </Routes>

      <NavegacionInferior dark={dark} categoria={categoria} setCategoria={setCategoria} setBusqueda={setBusqueda} totalItems={totalItems} />

      {/* ── MODALS / PANELS ── */}
      {productoRoute && (() => {
        const productId = location.pathname.split('/producto/')[1];
        const p = productos.find(x => String(x.id) === String(productId));
        return p ? <ModalProducto p={p} onClose={() => navigate(-1)} onAdd={addItem} ratings={ratings} onRate={handleRate} /> : null;
      })()}
      {cartOpen && (
        <PanelCarrito carrito={carrito} onClose={() => navigate(-1)} onAdd={addItem} onRemove={removeOne} onChangeQty={setQty} onClear={() => setCarrito([])} totalCompra={totalCompra} totalItems={totalItems} />
      )}
      {reviewsOpen && (
        <PanelResenas onClose={() => navigate(-1)} dark={dark} />
      )}
      {adminOpen && (
        <PanelAdmin onClose={() => navigate(-1)} productos={productos} onRefresh={fetchProductos} />
      )}
    </>
  );
}