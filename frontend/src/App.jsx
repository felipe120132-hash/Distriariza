import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // URL de tu Backend en Render
  const BACKEND_URL = "https://distriariza.onrender.com";

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error("Error:", err);
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
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)
          .filter((i) => i.cantidad > 0)
    );
  };

  const totalCompra = carrito.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0);

  const enviarWhatsApp = () => {
    const numero = "573219627376";
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad})`).join('\n');
    const msg = `¡Hola! 🌊 Me interesa este pedido:\n\n${lista}\n\n*Total: $${totalCompra.toLocaleString()}*`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const obtenerRutaImagen = (url) => {
    if (!url) return 'https://via.placeholder.com/300';
    return url.startsWith('http') ? url : `${BACKEND_URL}/productos/${url}`;
  };

  return (
    <div id="root">
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg)', position: 'sticky', top: 0, zIndex: 1000 
      }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>🌊 Distribuciones Ariza</h2>
        <button 
          onClick={() => setCarritoAbierto(true)}
          style={{ 
            background: 'var(--accent-bg)', color: 'var(--accent)', 
            border: '1px solid var(--accent-border)', padding: '10px 20px', 
            borderRadius: '12px', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          🛒 <span className="counter">{carrito.reduce((acc, p) => acc + p.cantidad, 0)}</span>
        </button>
      </nav>

      {/* HEADER / HERO */}
      <header style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Acuario <span style={{ color: 'var(--accent)' }}>Store</span></h1>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Equipamiento premium y suplementos biológicos para el bienestar de tus ecosistemas acuáticos.
        </p>
      </header>

      {/* GRILLA DE PRODUCTOS */}
      <main style={{ flex: 1, padding: '0 40px 80px' }}>
        {error && <code style={{ color: '#ff4d4d', display: 'block', marginBottom: '20px' }}>{error}</code>}
        
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' 
        }}>
          {productos.map(p => (
            <div key={p.id} style={{ 
              backgroundColor: 'var(--bg)', border: '1px solid var(--border)', 
              borderRadius: '20px', padding: '20px', textAlign: 'left',
              boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column'
            }}>
              <img 
                src={obtenerRutaImagen(p.imagen_url)} 
                alt={p.nombre} 
                style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '20px', borderRadius: '12px' }}
              />
              <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{p.nombre}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '20px', flex: 1 }}>
                {p.descripcion || "Producto de alta calidad para el mantenimiento de tu acuario."}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-h)' }}>
                  ${Number(p.precio).toLocaleString()}
                </span>
                <button 
                  onClick={() => agregarAlCarrito(p)}
                  style={{ 
                    backgroundColor: 'var(--accent)', color: 'white', border: 'none', 
                    width: '45px', height: '45px', borderRadius: '12px', cursor: 'pointer', 
                    fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CARRITO LATERAL (DRAWER) */}
      {carritoAbierto && (
        <>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1500 }}></div>
          <div style={{ 
            position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '90%', height: '100%', 
            backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border)', 
            zIndex: 2000, padding: '30px', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2>Tu Carrito</h2>
              <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '40px' }}>No hay productos en el carrito.</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain', background: 'var(--code-bg)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: '0 0 5px 0' }}>{item.nombre}</p>
                      <p style={{ color: 'var(--accent)', fontWeight: 600, margin: 0 }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-h)' }}>-</button>
                      <span className="counter">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-h)' }}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-h)' }}>
                  <span>Total:</span>
                  <span>${totalCompra.toLocaleString()}</span>
                </div>
                <button 
                  onClick={enviarWhatsApp}
                  style={{ width: '100%', padding: '16px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
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