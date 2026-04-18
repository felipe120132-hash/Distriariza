import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const BACKEND_URL = "https://distriariza.onrender.com";

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = (p) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === p.id);
      return existe 
        ? prev.map((item) => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...prev, { ...p, cantidad: 1 }];
    });
  };

  const restarCantidad = (id) => {
    setCarrito((prev) => 
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i).filter((i) => i.cantidad > 0)
    );
  };

  const totalCompra = carrito.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0);
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  const enviarWhatsApp = () => {
    const numero = "573219627376";
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad})`).join('\n');
    const msg = `¡Hola! Me interesa este pedido:\n\n${lista}\n\n*Total: $${totalCompra.toLocaleString()}*`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const obtenerRutaImagen = (url) => {
    if (!url) return 'https://via.placeholder.com/300';
    return url.startsWith('http') ? url : `${BACKEND_URL}/productos/${url}`;
  };

  return (
    <div id="root" style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5' }}>
      
      {/* NAVBAR MEJORADA */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '15px 30px', backgroundColor: 'white', 
        position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem', color: '#1A73E8' }}>☰</span>
          <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.5px' }}>
            Distribuciones Ariza
          </h1>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-10px',
              backgroundColor: '#1A73E8', color: 'white', fontSize: '0.65rem',
              borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold', border: '2px solid white'
            }}>
              {totalItems}
            </span>
          )}
        </div>
      </nav>

      {/* HERO SECTION - TÍTULO PREMIUM */}
      <div style={{ padding: '40px 30px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 25px 0', lineHeight: '1.05', color: '#111827' }}>
          Curating the World's<br />
          <span style={{ color: '#1A73E8' }}>Finest Aquatics.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
          <input 
            type="text" 
            placeholder="Search premium species and tech..." 
            style={{ 
              width: '100%', padding: '16px 20px 16px 50px', borderRadius: '16px', 
              border: 'none', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              fontSize: '1rem', outline: 'none'
            }} 
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      <div style={{ padding: '0 30px' }}>
        
        {/* COLECCIONES REDISEÑADAS */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Collections</h3>
            <span style={{ color: '#1A73E8', fontSize: '0.85rem', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {[
              { t: 'Freshwater', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
              { t: 'Saltwater', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400' },
              { t: 'Coral Reef', img: 'https://images.unsplash.com/photo-1546024077-c4b626955eef?w=400' }
            ].map((col, i) => (
              <div key={i} style={{ minWidth: '130px', textAlign: 'left' }}>
                <img src={col.img} alt={col.t} style={{ width: '130px', height: '130px', borderRadius: '20px', objectFit: 'cover', border: '4px solid white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <p style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{col.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ARTEFACTOS DESTACADOS - GRID DE TARJETAS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '1.3rem', fontWeight: 700 }}>Featured Artifacts</h3>
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {productos.map(p => (
              <div key={p.id} style={{ 
                backgroundColor: 'white', borderRadius: '24px', padding: '15px', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s'
              }}>
                <div style={{ 
                  backgroundColor: '#F9FAFB', borderRadius: '18px', height: '220px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', overflow: 'hidden'
                }}>
                  <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                </div>
                
                <p style={{ margin: '0', fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {p.categoria_nombre || 'Premium Tech'}
                </p>
                <h4 style={{ margin: '4px 0 12px 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{p.nombre}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A73E8' }}>${Number(p.precio).toLocaleString()}</span>
                  <button 
                    onClick={() => agregarAlCarrito(p)}
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '10px', 
                      backgroundColor: '#1A73E8', color: 'white', border: 'none', 
                      cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold'
                    }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN INFERIOR (FLOTANTE) */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '12px 0',
        display: 'flex', justifyContent: 'space-around', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 1000
      }}>
        {['GALLERY', 'SEARCH', 'CART', 'PROFILE'].map((label, idx) => (
          <div key={label} onClick={label === 'CART' ? () => setCarritoAbierto(true) : null} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', color: idx === 0 ? '#1A73E8' : '#9CA3AF' }}>
              {idx === 0 ? '⊞' : idx === 1 ? '🔍' : idx === 2 ? '🛒' : '👤'}
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: idx === 0 ? '#1A73E8' : '#9CA3AF' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* MODAL DEL CARRITO - DISEÑO LIMPIO */}
      {carritoAbierto && (
        <>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1500, backdropFilter: 'blur(4px)' }}></div>
          <div style={{ 
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '400px', height: '100%', 
            backgroundColor: 'white', zIndex: 2000, padding: '40px 30px', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Your Cart</h2>
              <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>Tu carrito está vacío.</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ width: '65px', height: '65px', borderRadius: '14px', backgroundColor: '#F3F4F6', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                      <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{item.nombre}</p>
                      <p style={{ color: '#1A73E8', fontWeight: 700, fontSize: '0.9rem' }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: '10px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 800, marginBottom: '25px' }}>
                  <span>Total</span>
                  <span>${totalCompra.toLocaleString()}</span>
                </div>
                <button 
                  onClick={enviarWhatsApp}
                  style={{ 
                    width: '100%', padding: '20px', backgroundColor: '#1A73E8', color: 'white', 
                    border: 'none', borderRadius: '18px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >Checkout via WhatsApp 🚀</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;