import { useEffect, useState } from 'react';
import axios from 'axios';

const DESCRIPCIONES_DETALLADAS = {
  "Acuaprime 120ml": {
    resumen: "🛡️ Protección total para tus peces en cada cambio de agua.",
    cuerpo: `Acuaprime es mucho más que un simple anticloro. Es un acondicionador completo diseñado para eliminar instantáneamente los elementos nocivos.
    
    ✨ <b>Beneficios Principales:</b>
    • 🚀 <b>Eliminación Instantánea:</b> Neutraliza el cloro, las cloraminas y los metales pesados.
    • 🐟 <b>Protección de Mucosa:</b> Contiene coloides que refuerzan la capa natural, reduciendo el estrés.
    • 💧 <b>Súper Concentrado:</b> Una pequeña dosis trata una gran cantidad de litros.
    • 🌍 <b>Seguro para Todos:</b> Ideal para agua dulce, marinos y estanques.`,
    uso: "📝 <b>Modo de Uso:</b> Añade la dosis recomendada en cada cambio de agua para asegurar un ambiente apto desde el primer segundo."
  },
  "Cycle 120ml": {
    resumen: "🦠 Establece un ecosistema saludable de forma inmediata.",
    cuerpo: `Fórmula avanzada con bacterias beneficiosas. Elimina el amoníaco y nitritos tóxicos, evitando el "síndrome del tanque nuevo".
    
    ✨ <b>Beneficios Principales:</b>
    • ⏳ <b>Maduración Acelerada:</b> Introduce peces mucho más rápido.
    • 🧹 <b>Elimina Tóxicos:</b> Transforma desechos en nitratos seguros.
    • 🔋 <b>Refuerzo Biológico:</b> Ideal tras limpiezas de filtro.
    • 🌊 <b>Fórmula Adaptable:</b> Agua dulce y salada.`,
    uso: "📝 <b>Modo de Uso:</b> Agitar bien. Dosificar por 3 días seguidos al iniciar y semanalmente como mantenimiento."
  },
  "Test Plus Ultra PH": {
    resumen: "🧪 Monitorea el parámetro más crítico para la vida de tus peces.",
    cuerpo: `El nivel de PH determina si el agua es ácida, neutra o alcalina. Un PH inestable es la causa principal de estrés y enfermedades.
    
    ✨ <b>Beneficios Principales:</b>
    • ⏱️ <b>Resultados Inmediatos:</b> Lectura clara en menos de un minuto.
    • 🎯 <b>Alta Precisión:</b> Detecta variaciones sutiles.
    • 📉 <b>Control de Salud:</b> Vital para especies específicas.`,
    uso: "📝 <b>Modo de Uso:</b> Toma una muestra, agrega reactivo y compara el color."
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

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const colecciones = [
    { t: 'LÍQUIDOS', val: 'Líquidos Vitales', icon: '💧' },
    { t: 'COMIDA', val: 'Alimentos', icon: '🍱' },
    { t: 'VACACIONES', val: 'Vacaciones', icon: '🏖️' },
    { t: 'ACCESORIOS', val: 'Accesorios', icon: '🎨' },
    { t: 'EQUIPOS', val: 'Equipos', icon: '⚙️' },
    { t: 'HAMSTERS', val: 'Hamsters', icon: '🐹' }
  ];

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  const productosVisibles = productos.filter(p => {
    const normalizar = (texto) => 
      texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";

    const coincideBusqueda = normalizar(p.nombre).includes(normalizar(busqueda));
    const coincideCategoria = 
      categoriaActiva === 'Todos' || 
      normalizar(p.categoria_nombre) === normalizar(categoriaActiva);
    
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
    const lista = carrito.map(p => `• ${p.nombre} (x${p.cantidad}) - ${formatoMoneda(p.precio * p.cantidad)}`).join('\n');
    const msg = `*NUEVO PEDIDO - DISTRIBUCIONES ARIZA*\n\n` +
                `*Cliente:* ${datosEnvio.nombre}\n` +
                `*Dirección:* ${datosEnvio.direccion}\n` +
                `*Ciudad:* ${datosEnvio.ciudad}\n` +
                `*Teléfono:* ${datosEnvio.telefono}\n\n` +
                `*Productos:*\n${lista}\n\n` +
                `*Total: ${formatoMoneda(totalCompra)}*`;
    
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
    setPasoCarrito('confirmado');
  };

  const obtenerRutaImagen = (url) => {
    if (!url) return 'https://via.placeholder.com/300';
    return url.startsWith('http') ? url : `${BACKEND_URL}/productos/${url}`;
  };

  return (
    <div style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '10px 25px', backgroundColor: 'white', position: 'sticky', top: 0, 
        zIndex: 1000, borderBottom: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/Logo.jpeg" 
            alt="Logo" 
            style={{ height: '50px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Logo" }}
          />
          <div style={{ lineHeight: '1' }}>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Distribuciones Ariza</h1>
            <span style={{ fontSize: '0.6rem', color: '#1A73E8', fontWeight: 700, letterSpacing: '1px' }}>FISH ACCESSORIES</span>
          </div>
        </div>

        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒 {totalItems > 0 && (
            <span style={{ 
              position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#1A73E8', 
              color: 'white', fontSize: '0.65rem', borderRadius: '50%', padding: '2px 6px', 
              fontWeight: 'bold', border: '2px solid white' 
            }}>{totalItems}</span>
          )}
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ padding: '40px 30px 20px 30px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, margin: '0 0 20px 0', lineHeight: '1.2', color: '#111827' }}>
          Todo lo que necesitas para tus<br />
          <span style={{ color: '#1A73E8' }}>peces y hámsters.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <input 
            type="text" placeholder="¿Qué mascota vamos a consentir hoy?" 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
            style={{ width: '100%', padding: '14px 20px 14px 50px', borderRadius: '14px', border: '1px solid #E5E7EB', outline: 'none' }} 
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div style={{ padding: '0 30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {colecciones.map((col, i) => (
            <div key={i} onClick={() => setCategoriaActiva(col.val)} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '80px' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                backgroundColor: categoriaActiva === col.val ? '#1A73E8' : 'white',
                color: categoriaActiva === col.val ? 'white' : '#000',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}>{col.icon}</div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, marginTop: '8px' }}>{col.t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTOS */}
      <div style={{ padding: '0 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {productosVisibles.map(p => (
          <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div onClick={() => setProductoSeleccionado(p)} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
              <h4 style={{ fontSize: '0.9rem', margin: '10px 0 5px', height: '35px', overflow: 'hidden' }}>{p.nombre}</h4>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1A73E8', margin: '5px 0' }}>{formatoMoneda(p.precio)}</p>
            </div>
            <button onClick={() => agregarAlCarrito(p)} style={{ width: '100%', padding: '8px', backgroundColor: '#1A73E8', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Agregar</button>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE */}
      {productoSeleccionado && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', width: '90%', maxWidth: '400px', borderRadius: '25px', padding: '25px', position: 'relative' }}>
            <button onClick={() => setProductoSeleccionado(null)} style={{ position: 'absolute', right: '20px', top: '20px', border: 'none', background: 'none', fontSize: '1.2rem' }}>✕</button>
            <img src={obtenerRutaImagen(productoSeleccionado.imagen_url)} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
            <h2 style={{ fontSize: '1.4rem', margin: '15px 0' }}>{productoSeleccionado.nombre}</h2>
            <div dangerouslySetInnerHTML={{ __html: DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.cuerpo || productoSeleccionado.descripcion }} style={{ fontSize: '0.9rem', color: '#4B5563' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatoMoneda(productoSeleccionado.precio)}</span>
              <button onClick={() => {agregarAlCarrito(productoSeleccionado); setProductoSeleccionado(null);}} style={{ padding: '12px 20px', backgroundColor: '#1A73E8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Añadir 🛒</button>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
          <div style={{ width: '100%', maxWidth: '350px', backgroundColor: 'white', height: '100%', position: 'relative', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h2>Mi Carrito</h2>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
                  <img src={obtenerRutaImagen(item.imagen_url)} style={{ width: '40px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>{item.nombre}</p>
                    <p style={{ margin: 0, color: '#1A73E8' }}>{formatoMoneda(item.precio)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => restarCantidad(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {pasoCarrito === 'envio' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="Nombre" onChange={e => setDatosEnvio({...datosEnvio, nombre: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input placeholder="Dirección" onChange={e => setDatosEnvio({...datosEnvio, direccion: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input placeholder="Teléfono" onChange={e => setDatosEnvio({...datosEnvio, telefono: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            ) : null}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3>Total: {formatoMoneda(totalCompra)}</h3>
              <button 
                onClick={pasoCarrito === 'lista' ? () => setPasoCarrito('envio') : finalizarPedidoWhatsApp}
                style={{ width: '100%', padding: '15px', backgroundColor: '#1A73E8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}
              >
                {pasoCarrito === 'lista' ? 'Continuar Compra' : 'Enviar por WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;