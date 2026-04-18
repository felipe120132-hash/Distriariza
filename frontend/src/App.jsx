import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // --- CONFIGURACIÓN DE BACKEND ---
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

  // --- LÓGICA DEL CARRITO ---
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

  return (
    <div id="root" style={{ paddingBottom: '100px', position: 'relative' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 30px', backgroundColor: 'var(--bg)', 
        position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--accent)' }}>☰</span>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-h)' }}>
            Distribuciones Ariza
          </h1>
        </div>
        <button 
          onClick={() => setCarritoAbierto(true)}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', position: 'relative', color: 'var(--text-h)' }}
        >
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-10px',
              backgroundColor: 'var(--accent)', color: 'white', fontSize: '0.7rem',
              borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold'
            }}>
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      <div style={{ padding: '0 30px' }}>
        
        {/* HERO */}
        <div style={{ margin: '40px 0' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: '0 0 20px 0', lineHeight: '1.1', color: 'var(--text-h)' }}>
            Seleccionando los mejores<br />
            <span style={{ color: 'var(--accent)' }}>ejemplares del mundo.</span>
          </h2>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Busca especies y productos premium..." 
              style={{ 
                width: '100%', padding: '15px 15px 15px 45px', borderRadius: '50px', 
                border: '1px solid var(--border)', backgroundColor: '#f9f9f9',
                color: 'var(--text-h)', fontSize: '1rem', boxSizing: 'border-box', outline: 'none'
              }} 
            />
          </div>
        </div>

        {/* COLECCIONES */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Colecciones</h3>
            <span style={{ color: 'var(--accent)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Ver todo</span>
          </div>
          <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ minWidth: '140px', textAlign: 'left' }}>
              <img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&q=80" alt="Agua Dulce" style={{ width: '140px', height: '140px', borderRadius: '24px', objectFit: 'cover', marginBottom: '10px' }} />
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Agua Dulce</p>
            </div>
            <div style={{ minWidth: '140px', textAlign: 'left' }}>
              <img src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&q=80" alt="Agua Salada" style={{ width: '140px', height: '140px', borderRadius: '24px', objectFit: 'cover', marginBottom: '10px' }} />
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Agua Salada</p>
            </div>
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div>
          <h3 style={{ margin: '0 0 30px 0', fontSize: '1.5rem', fontWeight: 700 }}>Artefactos destacados</h3>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '30px',
            marginBottom: '50px'
          }}>
            {productos.map(p => (
              <div key={p.id} className="product-card" style={{ 
                display: 'flex', flexDirection: 'column', 
                textAlign: 'left', position: 'relative'
              }}>
                <div style={{ 
                  backgroundColor: '#fcfcfc', 
                  borderRadius: '28px', 
                  padding: '20px', 
                  marginBottom: '15px',
                  border: '1px solid var(--border)',
                  height: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={obtenerRutaImagen(p.imagen_url)} 
                    alt={p.nombre} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                
                <p style={{ margin: '0 0 5px 0', fontSize: '0.75rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>
                  {p.categoria_nombre || 'Equipamiento'}
                </p>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: 'var(--text-h)', fontWeight: 600 }}>{p.nombre}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)' }}>
                    ${Number(p.precio).toLocaleString()}
                  </span>
                  
                  {/* BOTÓN DE AÑADIR AL CARRITO - AHORA SIEMPRE VISIBLE */}
                  <button 
                    onClick={() => agregarAlCarrito(p)}
                    title="Añadir al carrito"
                    style={{ 
                      width: '42px', height: '42px', borderRadius: '12px', 
                      backgroundColor: 'var(--accent)', color: 'white', border: 'none', 
                      cursor: 'pointer', fontSize: '1.4rem', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(15, 98, 254, 0.2)'
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

      {/* NAVEGACIÓN INFERIOR ESTILO APP */}
      <div style={{
        position: 'fixed', bottom: 0, left: '0', right: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border)', padding: '15px 0',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', color: 'var(--accent)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem' }}>⊞</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>GALERÍA</span>
        </div>
        <div style={{ textAlign: 'center', color: '#888', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem' }}>🔍</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>BUSCAR</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: '#888', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem', position: 'relative' }}>
            🛒
            {totalItems > 0 && <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--accent)', borderRadius: '50%' }}></div>}
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>CARRO</span>
        </div>
        <div style={{ textAlign: 'center', color: '#888', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem' }}>👤</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>PERFIL</span>
        </div>
      </div>

      {/* MODAL DEL CARRITO */}
      {carritoAbierto && (
        <>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1500 }}></div>
          <div style={{ 
            position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '100%', height: '100%', 
            backgroundColor: 'var(--bg)', zIndex: 2000, padding: '30px', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Tu Pedido</h2>
              <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-h)' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text)' }}>
                  <p style={{ fontSize: '1.2rem' }}>Tu carrito está vacío</p>
                  <button onClick={() => setCarritoAbierto(false)} style={{ color: 'var(--accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Seguir explorando</button>
                </div>
              ) : 
                carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '12px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                       <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-h)' }}>{item.nombre}</p>
                      <p style={{ color: 'var(--accent)', fontWeight: 700, margin: 0 }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f5f5f5', padding: '5px 10px', borderRadius: '8px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>-</button>
                      <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>+</button>
                    </div>
                  </div>
                ))
              }
            </div>

            {carrito.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700, marginBottom: '25px', color: 'var(--text-h)' }}>
                  <span>Total estimado:</span>
                  <span>${totalCompra.toLocaleString()}</span>
                </div>
                <button 
                  onClick={enviarWhatsApp}
                  style={{ 
                    width: '100%', padding: '18px', backgroundColor: '#25D366', color: 'white', 
                    border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, 
                    cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' 
                  }}
                >
                  Confirmar pedido vía WhatsApp 📱
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