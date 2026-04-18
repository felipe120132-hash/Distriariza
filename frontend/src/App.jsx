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
  "Test PH": {
    resumen: "🧪 Monitorea el parámetro más crítico para la vida de tus peces.",
    cuerpo: `El nivel de PH determina si el agua es ácida, neutra o alcalina. Un PH inestable es la causa principal de estrés y enfermedades en el acuario.
    
    ✨ <b>Beneficios Principales:</b>
    • ⏱️ <b>Resultados Inmediatos:</b> Lectura clara en menos de un minuto con escala de colores.
    • 🎯 <b>Alta Precisión:</b> Detecta variaciones sutiles para correcciones rápidas.
    • 📉 <b>Control de Salud:</b> Vital para especies específicas como discos (ácido) o cíclidos (alcalino).
    • 🧪 <b>Rendimiento Extendido:</b> El reactivo rinde para múltiples pruebas mensuales.`,
    uso: "📝 <b>Modo de Uso:</b> Toma una muestra en el tubo, agrega las gotas del reactivo, agita y compara el color con la tabla del empaque."
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

  // Función para formatear moneda con ceros (COP)
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(valor);
  };

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
      console.error(err);
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
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 25px', 
        backgroundColor: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/Logo.jpeg"
            alt="Logo Distribuciones Ariza" 
            style={{ height: '50px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Logo" }}
          />
          <div style={{ lineHeight: '1' }}>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
              Distribuciones Ariza
            </h1>
            <span style={{ fontSize: '0.6rem', color: '#1A73E8', fontWeight: 700, letterSpacing: '1px' }}>
              FISH ACCESSORIES
            </span>
          </div>
        </div>

        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒 {totalItems > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-10px', 
              backgroundColor: '#1A73E8', 
              color: 'white', 
              fontSize: '0.65rem', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontWeight: 'bold', 
              border: '2px solid white' 
            }}>{totalItems}</span>
          )}
        </div>
      </nav>

      {/* SECCIÓN DE BÚSQUEDA */}
      <div style={{ padding: '40px 30px 20px 30px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, margin: '0 0 20px 0', lineHeight: '1.2', color: '#111827' }}>
          Todo lo que necesitas para tus<br />
          <span style={{ color: '#1A73E8' }}>peces y hámsters.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <input 
            type="text" 
            placeholder="¿Qué mascota vamos a consentir hoy?" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '14px 20px 14px 50px', 
              borderRadius: '14px', 
              border: '1px solid #E5E7EB', 
              backgroundColor: 'white', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)', 
              fontSize: '0.95rem', 
              outline: 'none' 
            }} 
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '1.1rem' }}>🔍</span>
        </div>
      </div>

      <div style={{ padding: '0 30px' }}>
        {/* CATEGORÍAS */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Explorar categorías</h3>
            <span onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} style={{ color: '#1A73E8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Ver todo</span>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
            {colecciones.map((col, i) => (
              <div key={i} onClick={() => setCategoriaActiva(col.val)} style={{ minWidth: '90px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ 
                  width: '75px', height: '75px', borderRadius: '50%', margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                  backgroundColor: categoriaActiva === col.val ? '#1A73E8' : 'white',
                  color: categoriaActiva === col.val ? 'white' : '#111827',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)', transition: '0.3s',
                  border: '3px solid white'
                }}>{col.icon}</div>
                <p style={{ marginTop: '10px', fontSize: '0.7rem', fontWeight: 700, color: categoriaActiva === col.val ? '#1A73E8' : '#4B5563', lineHeight: '1.2', textTransform: 'uppercase' }}>{col.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '1.3rem', fontWeight: 700 }}>
            {categoriaActiva === 'Todos' ? 'Productos destacados' : categoriaActiva}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {productosVisibles.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
                <div onClick={() => setProductoSeleccionado(p)} style={{ backgroundColor: '#F9FAFB', borderRadius: '18px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', cursor: 'pointer', overflow: 'hidden' }}>
                  <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                <p style={{ margin: '0', fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>{p.categoria_nombre}</p>
                <h4 onClick={() => setProductoSeleccionado(p)} style={{ margin: '4px 0 12px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>{p.nombre}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* PRECIO FORMATEADO AQUÍ */}
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A73E8' }}>{formatoMoneda(p.precio)}</span>
                  <button onClick={() => agregarAlCarrito(p)} style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#1A73E8', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      {productoSeleccionado && (
        <>
          <div onClick={() => setProductoSeleccionado(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, backdropFilter: 'blur(8px)' }}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: 'white', zIndex: 3001, borderRadius: '32px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
            <button onClick={() => setProductoSeleccionado(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', zIndex: 10 }}>✕</button>
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '24px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <img src={obtenerRutaImagen(productoSeleccionado.imagen_url)} alt={productoSeleccionado.nombre} style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            <h2 style={{ margin: '5px 0 15px 0', fontSize: '1.6rem', fontWeight: 800 }}>{productoSeleccionado.nombre}</h2>
            <div style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.resumen || "Calidad garantizada para tu mascota."}</p>
              <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.cuerpo || productoSeleccionado.descripcion }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              {/* PRECIO FORMATEADO AQUÍ */}
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatoMoneda(productoSeleccionado.precio)}</div>
              <button onClick={() => { agregarAlCarrito(productoSeleccionado); setProductoSeleccionado(null); }} style={{ backgroundColor: '#1A73E8', color: 'white', padding: '16px 25px', borderRadius: '18px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Añadir 🛒</button>
            </div>
          </div>
        </>
      )}

      {/* CARRITO LATERAL */}
      {carritoAbierto && (
        <>
          <div onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1500 }}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '420px', height: '100%', backgroundColor: '#F9FAFB', zIndex: 2000, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '30px', borderBottom: '1px solid #f0f0f0' }}>
              {pasoCarrito === 'envio' && <button onClick={() => setPasoCarrito('lista')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px', fontSize: '1.2rem' }}>←</button>}
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>{pasoCarrito === 'lista' ? 'Tu Carrito' : 'Datos de Entrega'}</h2>
              <button onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
              {pasoCarrito === 'lista' && (
                carrito.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>Tu carrito está esperando por productos.</p> : carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                    <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{item.nombre}</p>
                      {/* PRECIO FORMATEADO AQUÍ */}
                      <p style={{ color: '#1A73E8', fontWeight: 700, margin: '4px 0 0' }}>{formatoMoneda(item.precio * item.cantidad)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ border: 'none', background: '#f3f4f6', borderRadius: '8px', width: '25px', height: '25px', cursor: 'pointer' }}>-</button>
                      <span style={{ fontWeight: 600 }}>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ border: 'none', background: '#f3f4f6', borderRadius: '8px', width: '25px', height: '25px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))
              )}

              {pasoCarrito === 'envio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Nombre completo" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})} />
                  <input type="text" placeholder="Dirección de entrega" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})} />
                  <input type="text" placeholder="Ciudad" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, ciudad: e.target.value})} />
                  <input type="text" placeholder="Teléfono de contacto" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, telefono: e.target.value})} />
                </div>
              )}

              {pasoCarrito === 'confirmado' && (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ fontSize: '4rem' }}>✅</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>¡Pedido Procesado!</h3>
                  <p>Estamos preparando todo para tu mascota.</p>
                  <button onClick={() => { setCarrito([]); setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ width: '100%', marginTop: '20px', padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '15px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Regresar a la tienda</button>
                </div>
              )}
            </div>

            {carrito.length > 0 && pasoCarrito !== 'confirmado' && (
              <div style={{ padding: '25px 30px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 600, color: '#6B7280' }}>Total:</span>
                  {/* TOTAL FORMATEADO AQUÍ */}
                  <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatoMoneda(totalCompra)}</span>
                </div>
                <button onClick={pasoCarrito === 'lista' ? () => setPasoCarrito('envio') : finalizarPedidoWhatsApp} style={{ width: '100%', padding: '18px', backgroundColor: pasoCarrito === 'lista' ? '#1A73E8' : '#25D366', color: 'white', border: 'none', borderRadius: '18px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                  {pasoCarrito === 'lista' ? 'Siguiente paso' : 'Pedir por WhatsApp 🚀'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* NAVEGACIÓN INFERIOR */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '12px 0', display: 'flex', justifyContent: 'space-around', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <div onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} style={{ textAlign: 'center', color: categoriaActiva === 'Todos' ? '#1A73E8' : '#9CA3AF', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.4rem' }}>⊞</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>TIENDA</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: '#9CA3AF', cursor: 'pointer', position: 'relative' }}>
          <div style={{ fontSize: '1.4rem', position: 'relative' }}>
            🛒 
            {totalItems > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-5px', 
                right: '-10px', 
                backgroundColor: '#EF4444', 
                color: 'white', 
                fontSize: '0.6rem', 
                minWidth: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid white'
              }}>
                {totalItems}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>CARRITO</span>
        </div>
      </div>
    </div>
  );
}

export default App;