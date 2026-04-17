import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]); 
  const [error, setError] = useState(null);

  // --- TU IP CONFIGURADA ---
  const MI_IP = "192.168.1.4";

  const cargarProductos = async () => {
    try {
      // Usamos tu IP en lugar de localhost
      const res = await axios.get(`http://${MI_IP}:5000/api/productos`);
      setProductos(res.data);
    } catch (err) {
      setError("Error conectando con el servidor.");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id);
      if (existe) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const restarCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalCompra = carrito.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0);

  const enviarWhatsApp = () => {
    const numeroTelefono = "573219627376"; 
    const listaTexto = carrito.map(p => 
      `✅ *${p.nombre}*\n   - Cantidad: ${p.cantidad}\n   - Subtotal: $${(p.precio * p.cantidad).toLocaleString()}`
    ).join('\n\n');

    const mensajeCompleto = `¡Hola! 🌊 Vengo de la tienda online y me interesa realizar este pedido: 🛒\n\n${listaTexto}\n\n*TOTAL A PAGAR: $${totalCompra.toLocaleString()}*\n\n¿Me podrían confirmar disponibilidad y medios de pago? 🙏`;
    
    const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeCompleto)}`;
    window.open(url, '_blank');
  };

  const obtenerRutaImagen = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    // También actualizamos la ruta de las imágenes
    return url.startsWith('http') ? url : `http://${MI_IP}:5000/productos/${url}`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '15px 30px', backgroundColor: '#1a73e8', color: 'white',
        borderRadius: '12px', marginBottom: '30px', position: 'sticky', top: '10px', zIndex: 1000 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>🌊 Acuario Store</h1>
        <div style={{ fontWeight: 'bold' }}>🛒 Items: {carrito.reduce((acc, p) => acc + p.cantidad, 0)}</div>
      </nav>

      <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
        
        <div style={{ 
          flex: '1 1 600px', display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' 
        }}>
          {productos.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{p.nombre}</h3>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1a73e8' }}>${Number(p.precio).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => agregarAlCarrito(p)}
                style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>

        {carrito.length > 0 && (
          <div style={{ 
            flex: '1 1 350px', backgroundColor: 'white', borderRadius: '15px', 
            padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', height: 'fit-content',
            position: 'sticky', top: '80px'
          }}>
            <h2 style={{ marginTop: 0, borderBottom: '2px solid #f0f2f5', paddingBottom: '10px' }}>Tu Carrito</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {carrito.map((item) => (
                <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{item.nombre}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>-</button>
                      <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '2px solid #1a73e8', paddingTop: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#1a73e8' }}>${totalCompra.toLocaleString()}</span>
              </div>
              
              <button 
                style={{ 
                  width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#25D366', 
                  color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', 
                  fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                }}
                onClick={enviarWhatsApp}
              >
                Pedir por WhatsApp 📱
              </button>

              <button onClick={vaciarCarrito} style={{ width: '100%', marginTop: '15px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
                Vaciar todo el carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;