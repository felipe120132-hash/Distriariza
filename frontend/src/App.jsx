import { useEffect, useState } from 'react';
import axios from 'axios';

// 1. NO importamos el logo aquí para evitar errores de compilación si el archivo no está en src.
// Lo usaremos directamente desde la carpeta /public/logo/

const DESCRIPCIONES_DETALLADAS = {
  "Acuaprime 120ml": {
    resumen: "🛡️ Protección total para tus peces en cada cambio de agua.",
    cuerpo: `Acuaprime es un acondicionador completo...`,
    uso: "📝 <b>Modo de Uso:</b> Añade la dosis en cada cambio de agua."
  }
};

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState({ nombre: '', direccion: '' });

  const BACKEND_URL = "https://distriariza.onrender.com";

  const colecciones = [
    { t: 'LÍQUIDOS', val: 'Liquidos vitales', icon: '💧' },
    { t: 'COMIDA', val: 'Comida', icon: '🍱' },
    { t: 'VACACIONES', val: 'Productos para tus vacaciones', icon: '🏖️' },
    { t: 'ACCESORIOS', val: 'Accesorios', icon: '🎨' },
    { t: 'EQUIPOS', val: 'Filtros, Termostatos y motores', icon: '⚙️' },
    { t: 'HAMSTERS', val: 'Accesorios para hamsters', icon: '🐹' }
  ];

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  const productosVisibles = productos.filter(p => {
    const normalizar = (t) => t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    const coincideBusqueda = normalizar(p.nombre).includes(normalizar(busqueda));
    const coincideCategoria = categoriaActiva === 'Todos' || normalizar(p.categoria_nombre).includes(normalizar(categoriaActiva));
    return coincideBusqueda && coincideCategoria;
  });

  const agregarAlCarrito = (p) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === p.id);
      if (existe) {
        return prev.map((item) => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...p, cantidad: 1 }];
    });
  };

  const restarCantidad = (id) => {
    setCarrito((prev) => 
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i).filter((i) => i.cantidad > 0)
    );
  };

  const totalCompra = carrito.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0);

  const finalizarPedidoWhatsApp = () => {
    const numero = "573219627376";
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad})`).join('\n');
    const msg = `*NUEVO PEDIDO*\n*Cliente:* ${datosEnvio.nombre}\n*Dirección:* ${datosEnvio.direccion}\n\n*Productos:*\n${lista}\n\n*Total: $${totalCompra.toLocaleString('es-CO')}*`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* RUTA DIRECTA AL LOGO EN PUBLIC */}
          <img src="/logo/llogo.JPG" alt="Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.1rem' }}>Distribuciones Ariza</h1>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
          🛒 {carrito.length > 0 && <span>({carrito.length})</span>}
        </div>
      </nav>

      {/* CONTENIDO */}
      <div style={{ padding: '30px' }}>
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {productosVisibles.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
              <img src={`${BACKEND_URL}/productos/${p.imagen_url}`} alt={p.nombre} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
              <p style={{ fontWeight: 'bold', margin: '10px 0' }}>{p.nombre}</p>
              <p style={{ color: '#1A73E8', fontWeight: 'bold' }}>${Number(p.precio).toLocaleString()}</p>
              <button onClick={() => agregarAlCarrito(p)} style={{ backgroundColor: '#1A73E8', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Agregar</button>
            </div>
          ))}
        </div>
      </div>

      {/* CARRITO LATERAL */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100%', backgroundColor: 'white', zIndex: 3000, padding: '20px', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)' }}>
          <button onClick={() => setCarritoAbierto(false)}>Cerrar</button>
          <h2>Tu Pedido</h2>
          {carrito.map(item => (
            <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
              {item.nombre} x{item.cantidad}
              <button onClick={() => restarCantidad(item.id)} style={{ marginLeft: '10px' }}>-</button>
            </div>
          ))}
          {carrito.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <p>Total: ${totalCompra.toLocaleString()}</p>
              <input type="text" placeholder="Tu nombre" onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} />
              <button onClick={finalizarPedidoWhatsApp} style={{ width: '100%', padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px' }}>Pedir por WhatsApp</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;