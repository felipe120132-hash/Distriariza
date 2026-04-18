import { useEffect, useState } from 'react';
import axios from 'axios';

// Diccionario de descripciones enriquecidas con emojis
const DESCRIPCIONES_DETALLADAS = {
  "Acuaprime 120ml": {
    resumen: "🛡️ Protección total para tus peces en cada cambio de agua.",
    cuerpo: `Acuaprime es mucho más que un simple anticloro. Es un acondicionador completo de alta concentración diseñado para eliminar instantáneamente los elementos nocivos del agua del grifo.
    
    ✨ **Beneficios Principales:**
    • 🚀 **Eliminación Instantánea:** Neutraliza el cloro, las cloraminas y los metales pesados.
    • 🐟 **Protección de Mucosa:** Contiene coloides que refuerzan la capa natural de los peces, reduciendo el estrés.
    • 💧 **Súper Concentrado:** Una pequeña dosis trata una gran cantidad de litros.
    • 🌍 **Seguro para Todos:** Ideal para acuarios de agua dulce, marinos y estanques.`,
    uso: "📝 **Modo de Uso:** Añade la dosis recomendada en cada cambio de agua o al montar un acuario nuevo para asegurar un ambiente apto desde el primer segundo."
  },
  "Cycle 120ml": {
    resumen: "🦠 Establece un ecosistema saludable de forma inmediata.",
    cuerpo: `Cycle es una fórmula avanzada con bacterias beneficiosas de alta resistencia. Elimina el amoníaco y los nitritos tóxicos, evitando el "síndrome del tanque nuevo".
    
    ✨ **Beneficios Principales:**
    • ⏳ **Maduración Acelerada:** Permite introducir peces en nuevos acuarios mucho más rápido.
    • 🧹 **Elimina Tóxicos:** Transforma desechos orgánicos en nitratos seguros para las plantas.
    • 🔋 **Refuerzo Biológico:** Ideal tras limpiezas de filtro o cambios grandes de agua.
    • 🌊 **Fórmula Adaptable:** Funciona perfectamente en agua dulce y salada.`,
    uso: "📝 **Modo de Uso:** Agitar bien. Dosificar por 3 días seguidos al iniciar un acuario, y aplicar una dosis de mantenimiento semanal."
  },
  "Test PH": {
    resumen: "📉 Conoce la calidad de tu agua al instante.",
    cuerpo: `El PH es un parámetro crítico. Un nivel inestable estresa a tus peces y afecta su color. Con este kit, monitorearás de forma sencilla si el agua es ácida, neutra o alcalina.
    
    ✨ **Beneficios Principales:**
    • ⏱️ **Resultados Inmediatos:** Lectura clara en menos de un minuto.
    • 🎯 **Alta Precisión:** Diseñado para detectar variaciones sutiles.
    • 🧪 **Larga Duración:** El reactivo rinde para múltiples pruebas constantes.
    • 🐠 **Vital para la Salud:** Indispensable para peces amazónicos o cíclidos africanos.`,
    uso: "📝 **Modo de Uso:** Toma una muestra de agua en el tubo incluido, agrega las gotas del reactivo, agita y compara el color con la tabla del empaque."
  }
};

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

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
    <div id="root" style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
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

      {/* HERO SECTION */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 25px 0', lineHeight: '1.1', color: '#111827' }}>
          Seleccionando los mejores<br />
          <span style={{ color: '#1A73E8' }}>ejemplares del mundo.</span>
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
          <input 
            type="text" 
            placeholder="Buscar especies o tecnología..." 
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
        {/* COLECCIONES */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Colecciones</h3>
            <span style={{ color: '#1A73E8', fontSize: '0.85rem', fontWeight: 600 }}>Ver todo</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {[
              { t: 'Agua Dulce', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
              { t: 'Agua Salada', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400' },
              { t: 'Arrecife', img: 'https://images.unsplash.com/photo-1546024077-c4b626955eef?w=400' }
            ].map((col, i) => (
              <div key={i} style={{ minWidth: '130px' }}>
                <img src={col.img} alt={col.t} style={{ width: '130px', height: '130px', borderRadius: '20px', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                <p style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 600 }}>{col.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '1.3rem', fontWeight: 700 }}>Artefactos destacados</h3>
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {productos.map(p => (
              <div key={p.id} style={{ 
                backgroundColor: 'white', borderRadius: '24px', padding: '15px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.03)'
              }}>
                <div 
                  onClick={() => setProductoSeleccionado(p)}
                  style={{ 
                    backgroundColor: '#F9FAFB', borderRadius: '18px', height: '220px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', 
                    cursor: 'pointer', overflow: 'hidden'
                  }}
                >
                  <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                
                <p style={{ margin: '0', fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                  {p.categoria_nombre || 'Equipamiento'}
                </p>
                <h4 
                  onClick={() => setProductoSeleccionado(p)}
                  style={{ margin: '4px 0 12px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {p.nombre}
                </h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A73E8' }}>${Number(p.precio).toLocaleString()}</span>
                  <button 
                    onClick={() => agregarAlCarrito(p)}
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '10px', 
                      backgroundColor: '#1A73E8', color: 'white', border: 'none', 
                      cursor: 'pointer', fontSize: '1.2rem'
                    }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLES DEL PRODUCTO (ACTUALIZADO CON DESCRIPCIONES) */}
      {productoSeleccionado && (
        <>
          <div onClick={() => setProductoSeleccionado(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, backdropFilter: 'blur(8px)' }}></div>
          <div style={{ 
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: '90%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto',
            backgroundColor: 'white', zIndex: 3001, borderRadius: '32px', padding: '30px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' 
          }}>
            <button onClick={() => setProductoSeleccionado(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', zIndex: 10 }}>✕</button>
            
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '24px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <img src={obtenerRutaImagen(productoSeleccionado.imagen_url)} alt={productoSeleccionado.nombre} style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <span style={{ fontSize: '0.7rem', color: '#1A73E8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {productoSeleccionado.categoria_nombre || 'BIENESTAR ACUÁTICO'}
            </span>
            <h2 style={{ margin: '5px 0 15px 0', fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>{productoSeleccionado.nombre}</h2>
            
            <div style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                {DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.resumen || "Calidad premium seleccionada para tu ecosistema."}
              </p>
              <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }}>
                {DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.cuerpo || productoSeleccionado.descripcion}
              </div>
              <p style={{ backgroundColor: '#EFF6FF', padding: '15px', borderRadius: '16px', color: '#1E40AF', fontSize: '0.85rem' }}>
                {DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.uso || "Uso: Siga las instrucciones indicadas en el empaque del producto."}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>PRECIO</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>${Number(productoSeleccionado.precio).toLocaleString()}</div>
              </div>
              <button 
                onClick={() => { agregarAlCarrito(productoSeleccionado); setProductoSeleccionado(null); }}
                style={{ 
                  backgroundColor: '#1A73E8', color: 'white', padding: '16px 25px', borderRadius: '18px', 
                  border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px rgba(26, 115, 232, 0.2)' 
                }}
              >Añadir al Carrito 🛒</button>
            </div>
          </div>
        </>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '12px 0',
        display: 'flex', justifyContent: 'space-around', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', color: '#1A73E8' }}>
          <div style={{ fontSize: '1.2rem' }}>⊞</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>GALERÍA</span>
        </div>
        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
          <div style={{ fontSize: '1.2rem' }}>🔍</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>BUSCAR</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: '#9CA3AF', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem' }}>🛒</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>CARRITO</span>
        </div>
        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
          <div style={{ fontSize: '1.2rem' }}>👤</div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>PERFIL</span>
        </div>
      </div>

      {/* MODAL DEL CARRITO */}
      {carritoAbierto && (
        <>
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1500 }}></div>
          <div style={{ 
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '400px', height: '100%', 
            backgroundColor: 'white', zIndex: 2000, padding: '40px 30px', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Tu Carrito</h2>
              <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9CA3AF' }}>El carrito está vacío.</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#F3F4F6', padding: '5px' }}>
                      <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{item.nombre}</p>
                      <p style={{ color: '#1A73E8', fontWeight: 700 }}>${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '8px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ border: 'none', background: 'none', fontWeight: 'bold' }}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ border: 'none', background: 'none', fontWeight: 'bold' }}>+</button>
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
                    width: '100%', padding: '18px', backgroundColor: '#25D366', color: 'white', 
                    border: 'none', borderRadius: '18px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >Pedir por WhatsApp 🚀</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;