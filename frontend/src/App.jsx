import { useEffect, useState } from 'react';
import axios from 'axios';
// Asegúrate de que llogo.JPG esté en src/assets/
import logoAriza from './assets/llogo.JPG'; 

const DESCRIPCIONES_DETALLADAS = {
  "Acuaprime 120ml": {
    resumen: "🛡️ Protección total para tus peces en cada cambio de agua.",
    cuerpo: `Acuaprime es un acondicionador completo diseñado para eliminar instantáneamente elementos nocivos.
    
    ✨ <b>Beneficios Principales:</b>
    • 🚀 <b>Eliminación Instantánea:</b> Neutraliza cloro y metales pesados.
    • 🐟 <b>Protección de Mucosa:</b> Reduce el estrés en los peces.`,
    uso: "📝 <b>Modo de Uso:</b> Añade la dosis en cada cambio de agua."
  },
  "Cycle 120ml": {
    resumen: "🦠 Establece un ecosistema saludable de forma inmediata.",
    cuerpo: `Fórmula con bacterias beneficiosas que elimina amoníaco y nitritos tóxicos.`,
    uso: "📝 <b>Modo de Uso:</b> Dosificar por 3 días seguidos al iniciar el acuario."
  }
};

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [pasoCarrito, setPasoCarrito] = useState('lista'); 
  const [datosEnvio, setDatosEnvio] = useState({ nombre: '', direccion: '', ciudad: '', telefono: '' });

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
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  const productosVisibles = productos.filter(p => {
    const normalizar = (texto) => 
      texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";

    const nombreProducto = normalizar(p.nombre);
    const queryBusqueda = normalizar(busqueda);
    const categoriaProducto = normalizar(p.categoria_nombre);
    const categoriaFiltro = normalizar(categoriaActiva);

    const coincideBusqueda = nombreProducto.includes(queryBusqueda);
    const coincideCategoria = 
      categoriaActiva === 'Todos' || 
      categoriaProducto === categoriaFiltro ||
      categoriaProducto.includes(categoriaFiltro.split(' ')[0]); 
    
    return coincideBusqueda && coincideCategoria;
  });

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

  const finalizarPedidoWhatsApp = () => {
    const numero = "573219627376";
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad})`).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n` +
                `*Cliente:* ${datosEnvio.nombre}\n` +
                `*Dirección:* ${datosEnvio.direccion}\n\n` +
                `*Productos:*\n${lista}\n\n` +
                `*Total: $${totalCompra.toLocaleString('es-CO')}*`;
    
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
    setPasoCarrito('confirmado');
  };

  const obtenerRutaImagen = (url) => {
    if (!url) return 'https://via.placeholder.com/300';
    return url.startsWith('http') ? url : `${BACKEND_URL}/productos/${url}`;
  };

  return (
    <div style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR CORREGIDO */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem', color: '#1A73E8' }}>☰</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={logoAriza} 
              alt="Logo" 
              style={{ height: '35px', width: 'auto', borderRadius: '5px' }} 
            />
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Distribuciones Ariza</h1>
          </div>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒 {totalItems > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#1A73E8', color: 'white', fontSize: '0.65rem', borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold' }}>{totalItems}</span>}
        </div>
      </nav>

      {/* TÍTULO Y BÚSQUEDA */}
      <div style={{ padding: '40px 30px 20px 30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 20px 0', color: '#111827' }}>
          Seleccionando los mejores<br />
          <span style={{ color: '#1A73E8' }}>ejemplares del mundo.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <input 
            type="text" 
            placeholder="¿Qué mascota vamos a consentir hoy?" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            style={{ width: '100%', padding: '14px 20px 14px 45px', borderRadius: '14px', border: '1px solid #E5E7EB', outline: 'none' }} 
          />
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        </div>
      </div>

      <div style={{ padding: '0 30px' }}>
        {/* CATEGORÍAS */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '30px' }}>
          {colecciones.map((col, i) => (
            <div key={i} onClick={() => setCategoriaActiva(col.val)} style={{ minWidth: '80px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                backgroundColor: categoriaActiva === col.val ? '#1A73E8' : 'white',
                color: categoriaActiva === col.val ? 'white' : 'black',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>{col.icon}</div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '8px' }}>{col.t}</p>
            </div>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {productosVisibles.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
              <h4 style={{ fontSize: '0.9rem', margin: '10px 0' }}>{p.nombre}</h4>
              <p style={{ fontWeight: 800, color: '#1A73E8' }}>${Number(p.precio).toLocaleString()}</p>
              <button onClick={() => agregarAlCarrito(p)} style={{ width: '100%', padding: '10px', backgroundColor: '#1A73E8', color: 'white', border: 'none', borderRadius: '10px', marginTop: '10px', cursor: 'pointer' }}>Agregar</button>
            </div>
          ))}
        </div>
      </div>

      {/* CARRITO (SIMPLIFICADO PARA FUNCIONAMIENTO) */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '320px', height: '100%', backgroundColor: 'white', zIndex: 2000, padding: '20px', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
          <button onClick={() => setCarritoAbierto(false)}>Cerrar</button>
          <h3>Tu Pedido</h3>
          {carrito.map(item => (
            <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
              {item.nombre} x{item.cantidad} - ${item.precio * item.cantidad}
            </div>
          ))}
          {carrito.length > 0 && (
            <button onClick={finalizarPedidoWhatsApp} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '10px', marginTop: '20px' }}>Enviar WhatsApp</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;