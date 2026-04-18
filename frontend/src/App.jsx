import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // --- LÓGICA INTACTA ---
  const BACKEND_URL = "https://distriariza.onrender.com";

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error(err);
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

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  // --- UI PREMIUM ---
  return (
    <div id="root" style={{ paddingBottom: '80px', position: 'relative' }}>
      
      {/* 1. NAVBAR MINIMALISTA */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 30px', backgroundColor: 'var(--bg)', 
        position: 'sticky', top: 0, zIndex: 1000 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--accent)' }}>☰</span>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-h)' }}>
            Distribuciones Ariza
          </h1>
        </div>
        <button 
          onClick={() => setCarritoAbierto(true)}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', position: 'relative', color: 'var(--accent)' }}
        >
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-10px',
              backgroundColor: '#ff4d4d', color: 'white', fontSize: '0.7rem',
              borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold'
            }}>
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      <div style={{ padding: '0 30px' }}>
        
        {/* 2. HERO Y BUSCADOR */}
        <div style={{ margin: '30px 0' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: '0 0 20px 0', lineHeight: '1.1', color: 'var(--text-h)' }}>
            Curating the World's<br />
            <span style={{ color: 'var(--accent)' }}>Finest Aquatics.</span>
          </h2>
          
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search premium species and products..." 
              style={{ 
                width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', 
                border: '1px solid var(--border)', backgroundColor: 'var(--bg)',
                color: 'var(--text-h)', fontSize: '1rem', boxSizing: 'border-box'
              }} 
            />
          </div>
        </div>

        {/* 3. COLECCIONES (Diseño estático de la referencia) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Collections</h3>
            <span style={{ color: 'var(--accent)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
            {/* Tarjeta estática 1 */}
            <div style={{ minWidth: '120px', textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&q=80" alt="Freshwater" style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Freshwater</p>
            </div>
            {/* Tarjeta estática 2 */}
            <div style={{ minWidth: '120px', textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&q=80" alt="Saltwater" style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Saltwater</p>
            </div>
          </div>
        </div>

        {/* 4. PRODUCTOS REALES DE TU BASE DE DATOS */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: 700 }}>Featured Artifacts</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {productos.map(p => (
              <div key={p.id} style={{ 
                backgroundColor: 'var(--bg)', borderRadius: '20px', padding: '15px', 
                boxShadow: 'var(--shadow)', border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column'
              }}>
                <img 
                  src={obtenerRutaImagen(p.imagen_url)} 
                  alt={p.nombre} 
                  style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '12px', marginBottom: '15px', backgroundColor: 'white' }}
                />
                <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {p.categoria_nombre || 'Equipment'}
                </p>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: 'var(--text-h)' }}>{p.nombre}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
                    ${Number(p.precio).toLocaleString()}
                  </span>
                  <button 
                    onClick={() => agregarAlCarrito(p)}
                    style={{ 
                      width: '35px', height: '35px', borderRadius: '10px', 
                      backgroundColor: 'var(--accent)', color: 'white', border: 'none', 
                      cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. NAVEGACIÓN INFERIOR (BOTTOM NAV) */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '1126px', backgroundColor: 'var(--bg)', 
        borderTop: '1px solid var(--border)', padding: '15px 0',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', color: 'var(--accent)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>⊞</div>
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>GALLERY</span>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>🔍</div>
          <span style={{ fontSize: '0.7rem' }}>SEARCH</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: 'var(--text)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem', position: 'relative' }}>
            🛒
            {totalItems > 0 && <div style={{ position: 'absolute', top: -5, right: -5, width: 8, height: 8, backgroundColor: '#ff4d4d', borderRadius: '50%' }}></div>}
          </div>
          <span style={{ fontSize: '0.7rem' }}>CART</span>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>👤</div>
          <span style={{ fontSize: '0.7rem' }}>PROFILE</span>
        </div>
      </div>

      {/* 6. CARRITO LATERAL (LÓGICA INTACTA) */}
      {carritoAbierto && (
        <>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1500 }}></div>
          <div style={{ 
            position: 'fixed', top: 0, right: 0, width: '380px', maxWidth: '90%', height: '100%', 
            backgroundColor: 'var(--bg)', zIndex: 2000, padding: '30px', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Tu Pedido</h2>
              <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text)' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.length === 0 ? <p style={{ textAlign: 'center', marginTop: '50px' }}>Carrito vacío</p> : 
                carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                    <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, margin: '0 0 5px 0' }}>{item.nombre}</p>
                      <p style={{ color: 'var(--accent)', fontWeight: 600, margin: 0 }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ width: '25px', height: '25px', borderRadius: '4px', border: '1px solid var(--border)', cursor: 'pointer' }}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ width: '25px', height: '25px', borderRadius: '4px', border: '1px solid var(--border)', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))
              }
            </div>

            {carrito.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--accent)' }}>${totalCompra.toLocaleString()}</span>
                </div>
                <button 
                  onClick={enviarWhatsApp}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirmar por WhatsApp 📱
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;