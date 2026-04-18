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
  
  // ESTADOS DE BÚSQUEDA Y FILTRO
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // ESTADOS PARA EL FLUJO DE COMPRA
  const [pasoCarrito, setPasoCarrito] = useState('lista'); 
  const [datosEnvio, setDatosEnvio] = useState({ nombre: '', direccion: '', ciudad: '', telefono: '' });

  const BACKEND_URL = "https://distriariza.onrender.com";

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  // LÓGICA DE FILTRADO DINÁMICO
  const productosVisibles = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'Todos' || p.categoria_nombre === categoriaActiva;
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
    const msg = `*NUEVO PEDIDO - ACUARIO STORE*\n\n` +
                `*Cliente:* ${datosEnvio.nombre}\n` +
                `*Dirección:* ${datosEnvio.direccion}\n` +
                `*Ciudad:* ${datosEnvio.ciudad}\n` +
                `*Teléfono:* ${datosEnvio.telefono}\n\n` +
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
    <div style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '15px 30px', backgroundColor: 'white', 
        position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem', color: '#1A73E8' }}>☰</span>
          <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Distribuciones Ariza</h1>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒 {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-10px',
              backgroundColor: '#1A73E8', color: 'white', fontSize: '0.65rem',
              borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold', border: '2px solid white'
            }}>{totalItems}</span>
          )}
        </div>
      </nav>

      {/* HERO & SEARCH */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 25px 0', lineHeight: '1.1', color: '#111827' }}>
          Seleccionando los mejores<br />
          <span style={{ color: '#1A73E8' }}>ejemplares del mundo.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
          <input 
            type="text" 
            placeholder="Buscar especies o tecnología..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ 
              width: '100%', padding: '16px 20px 16px 50px', borderRadius: '16px', 
              border: 'none', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              fontSize: '1rem', outline: 'none'
            }} 
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        </div>
      </div>

      <div style={{ padding: '0 30px' }}>
        {/* COLECCIONES / CATEGORÍAS */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Colecciones</h3>
            <span onClick={() => setCategoriaActiva('Todos')} style={{ color: '#1A73E8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Ver todo</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {[
              { t: 'Agua Dulce', val: 'Agua Dulce', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
              { t: 'Agua Salada', val: 'Agua Salada', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400' },
              { t: 'Arrecife', val: 'Arrecife', img: 'https://images.unsplash.com/photo-1546024077-c4b626955eef?w=400' }
            ].map((col, i) => (
              <div key={i} onClick={() => setCategoriaActiva(col.val)} style={{ minWidth: '130px', cursor: 'pointer', textAlign: 'center' }}>
                <img src={col.img} alt={col.t} style={{ 
                  width: '130px', height: '130px', borderRadius: '20px', objectFit: 'cover', 
                  border: categoriaActiva === col.val ? '4px solid #1A73E8' : '4px solid white', 
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: '0.3s'
                }} />
                <p style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, color: categoriaActiva === col.val ? '#1A73E8' : '#111827' }}>{col.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '1.3rem', fontWeight: 700 }}>
            {categoriaActiva === 'Todos' ? 'Artefactos destacados' : `Productos: ${categoriaActiva}`}
          </h3>
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {productosVisibles.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
                <div onClick={() => setProductoSeleccionado(p)} style={{ backgroundColor: '#F9FAFB', borderRadius: '18px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', cursor: 'pointer', overflow: 'hidden' }}>
                  <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                <p style={{ margin: '0', fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>{p.categoria_nombre || 'Equipamiento'}</p>
                <h4 onClick={() => setProductoSeleccionado(p)} style={{ margin: '4px 0 12px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>{p.nombre}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A73E8' }}>${Number(p.precio).toLocaleString()}</span>
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
            <span style={{ fontSize: '0.7rem', color: '#1A73E8', fontWeight: 800, textTransform: 'uppercase' }}>{productoSeleccionado.categoria_nombre || 'BIENESTAR ACUÁTICO'}</span>
            <h2 style={{ margin: '5px 0 15px 0', fontSize: '1.6rem', fontWeight: 800 }}>{productoSeleccionado.nombre}</h2>
            <div style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.resumen || "Calidad premium seleccionada."}</p>
              <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.cuerpo || productoSeleccionado.descripcion }} />
              <p style={{ backgroundColor: '#EFF6FF', padding: '15px', borderRadius: '16px', color: '#1E40AF' }} dangerouslySetInnerHTML={{ __html: DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.uso || "Uso: Seguir indicaciones del empaque." }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>${Number(productoSeleccionado.precio).toLocaleString()}</div>
              <button onClick={() => { agregarAlCarrito(productoSeleccionado); setProductoSeleccionado(null); }} style={{ backgroundColor: '#1A73E8', color: 'white', padding: '16px 25px', borderRadius: '18px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Añadir 🛒</button>
            </div>
          </div>
        </>
      )}

      {/* CARRITO */}
      {carritoAbierto && (
        <>
          <div onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1500 }}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '420px', height: '100%', backgroundColor: '#F9FAFB', zIndex: 2000, padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              {pasoCarrito === 'envio' && <button onClick={() => setPasoCarrito('lista')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px' }}>←</button>}
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>{pasoCarrito === 'lista' ? 'Tu Carrito' : 'Datos de Entrega'}</h2>
              <button onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            {pasoCarrito === 'lista' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {carrito.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Carrito vacío.</p> : carrito.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '20px' }}>
                      <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{item.nombre}</p>
                        <p style={{ color: '#1A73E8', fontWeight: 700 }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => restarCantidad(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => agregarAlCarrito(item)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {carrito.length > 0 && (
                  <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontWeight: 600 }}>Total:</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>${totalCompra.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setPasoCarrito('envio')} style={{ width: '100%', padding: '18px', backgroundColor: '#1A73E8', color: 'white', border: 'none', borderRadius: '18px', fontWeight: 700 }}>Continuar</button>
                  </div>
                )}
              </>
            )}

            {pasoCarrito === 'envio' && (
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="Nombre completo" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '10px' }} onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})} />
                <input type="text" placeholder="Dirección" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '10px' }} onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})} />
                <input type="text" placeholder="Ciudad" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '10px' }} onChange={(e) => setDatosEnvio({...datosEnvio, ciudad: e.target.value})} />
                <input type="text" placeholder="Teléfono" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '20px' }} onChange={(e) => setDatosEnvio({...datosEnvio, telefono: e.target.value})} />
                <button disabled={!datosEnvio.nombre || !datosEnvio.direccion || !datosEnvio.telefono} onClick={finalizarPedidoWhatsApp} style={{ width: '100%', padding: '18px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '18px', fontWeight: 700 }}>Finalizar WhatsApp 🚀</button>
              </div>
            )}

            {pasoCarrito === 'confirmado' && (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h3>¡Pedido Enviado!</h3>
                <button onClick={() => { setCarrito([]); setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ width: '100%', padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '15px', border: 'none', fontWeight: 700 }}>Limpiar Carrito</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* BARRA INFERIOR (MENU) */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '12px 0', display: 'flex', justifyContent: 'space-around', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <div onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} style={{ textAlign: 'center', color: '#1A73E8', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>⊞</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>TIENDA</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: '#9CA3AF', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>🛒</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>CARRITO</span>
        </div>
      </div>
    </div>
  );
}

export default App;