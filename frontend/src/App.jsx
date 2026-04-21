import { useEffect, useState } from 'react';
import axios from 'axios';

// --- PANTALLA DE CARGA: ESTILO FONDO MARINO PREMIUM ---
const PantallaCarga = () => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'linear-gradient(180deg, #1A73E8 0%, #083675 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflow: 'hidden'
    }}>
      <style>{`
        @keyframes pulsoBrillo {
          0%, 100% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5)); }
          50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8)); }
        }
        @keyframes flotarLento {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .contenedor-shell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 150px;
          margin-bottom: 30px;
          animation: flotarLento 4s ease-in-out infinite;
        }
        .shell-icon {
          font-size: 75px;
          animation: pulsoBrillo 3s ease-in-out infinite;
          z-index: 10;
        }
        .aura {
          position: absolute;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          filter: blur(10px);
          animation: pulsoBrillo 3s ease-in-out infinite;
        }
        .texto-marino {
          color: white;
          text-align: center;
          font-family: 'Inter', sans-serif;
          z-index: 10;
        }
      `}</style>
      
      <div className="contenedor-shell">
        <div className="aura"></div>
        <div className="shell-icon">🐚</div>
      </div>
      
      <div className="texto-marino">
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Distribuciones Ariza
        </h2>
        <p style={{ fontSize: '0.95rem', opacity: 0.7, marginTop: '8px', fontWeight: '300' }}>
          Sumergiéndonos en el catálogo...
        </p>
      </div>
    </div>
  );
};

// --- DESCRIPCIONES AMPLIADAS: ORDENADAS SEGÚN TU LISTA DE LÍQUIDOS ---
const DESCRIPCIONES_DETALLADAS = {
  "Acuaprime 30ml": {
    resumen: "🛡️ Eliminador instantáneo de cloro y metales pesados.",
    cuerpo: `Ideal para acondicionar el agua de grifo de forma inmediata.
    • <b>Seguridad:</b> Protege la mucosa de los peces.
    • <b>Práctico:</b> Tamaño ideal para nano-acuarios o viajes.`,
    uso: "📝 <b>Uso:</b> Aplicar en cada cambio de agua."
  },
  "Acuaprime 120ml": {
    resumen: "🛡️ Protección total para tus peces en cada cambio de agua.",
    cuerpo: `Acuaprime es un acondicionador completo diseñado para eliminar elementos nocivos.
    • <b>Beneficios:</b> Neutraliza cloro, cloraminas y metales pesados.
    • <b>Salud:</b> Reduce el estrés en peces nuevos.`,
    uso: "📝 <b>Uso:</b> Dosificar según el litraje del acuario en cada recambio."
  },
  "Acuaprime 240ml": {
    resumen: "🛡️ Protección eficiente para acuarios medianos.",
    cuerpo: `Rendimiento superior para mantener tu acuario libre de tóxicos.
    • <b>Confianza:</b> Fórmula concentrada de alta eficiencia.
    • <b>Multiuso:</b> Apto para agua dulce y salada.`,
    uso: "📝 <b>Uso:</b> Añadir directamente al agua nueva antes de ingresarla al tanque."
  },
  "Acuaprime Litro": {
    resumen: "🛡️ Máximo ahorro y protección para grandes volúmenes.",
    cuerpo: `La opción preferida por criadores y acuaristas con múltiples tanques.
    • <b>Economía:</b> El mejor costo por litro del mercado.
    • <b>Eficacia:</b> Neutralización química inmediata.`,
    uso: "📝 <b>Uso:</b> Ideal para cambios de agua masivos."
  },
  "Cycle 30ml": {
    resumen: "🦠 Suplemento biológico para un inicio seguro.",
    cuerpo: `Contiene bacterias vivas que establecen el ciclo del nitrógeno.
    • <b>Arranque:</b> Evita picos de amoníaco en acuarios nuevos.
    • <b>Mantenimiento:</b> Refuerza la colonia bacteriana.`,
    uso: "📝 <b>Uso:</b> Aplicar durante los primeros días del montaje."
  },
  "Cycle 120ml": {
    resumen: "🦠 Establece un ecosistema saludable de forma inmediata.",
    cuerpo: `Fórmula avanzada que elimina amoníaco y nitritos tóxicos.
    • <b>Estabilidad:</b> Previene enfermedades por mala calidad de agua.
    • <b>Refuerzo:</b> Úsalo después de limpiar el filtro.`,
    uso: "📝 <b>Uso:</b> Agitar bien y dosificar semanalmente."
  },
  "Cycle 240ml": {
    resumen: "🦠 Control biológico para acuarios establecidos.",
    cuerpo: `Asegura una filtración biológica robusta y agua cristalina.
    • <b>Limpieza:</b> Ayuda a degradar restos orgánicos en el fondo.
    • <b>Salud:</b> Crea un entorno natural para tus peces.`,
    uso: "📝 <b>Uso:</b> Dosificar proporcionalmente al volumen de agua."
  },
  "Cycle Litro": {
    resumen: "🦠 Rendimiento profesional para sistemas grandes.",
    cuerpo: `Ideal para baterías de acuarios o estanques de gran tamaño.
    • <b>Potencia:</b> Millones de bacterias benéficas por ml.
    • <b>Seguridad:</b> Imposible de sobredosificar, totalmente natural.`,
    uso: "📝 <b>Uso:</b> Ideal para reactivar filtros después de medicaciones."
  },
  "Test Plus Ultra PH": {
    resumen: "🧪 Medidor de PH con máxima precisión.",
    cuerpo: `Monitorea el parámetro más crítico para la vida acuática.
    • <b>Precisión:</b> Escala de colores detallada para lecturas exactas.
    • <b>Control:</b> Evita variaciones bruscas de acidez/alcalinidad.`,
    uso: "📝 <b>Uso:</b> Comparar la muestra de agua con la tabla colorimétrica."
  },
  "Alga Clear 20ml": {
    resumen: "☀️ Adiós al agua verde y algas por luz solar.",
    cuerpo: `Controla la propagación de algas indeseadas de forma segura.
    • <b>Claridad:</b> Mantiene el cristal y decoraciones limpias.
    • <b>Eficacia:</b> Actúa rápidamente sobre algas en suspensión.`,
    uso: "📝 <b>Uso:</b> Usar preventivamente si el acuario recibe luz solar indirecta."
  },
  "Clarify 20ml": {
    resumen: "💎 Claridad extrema para tu agua.",
    cuerpo: `Agrupa partículas en suspensión para que el filtro las atrape.
    • <b>Efecto:</b> Transforma el agua turbia en agua cristalina en minutos.
    • <b>Seguro:</b> No altera los parámetros químicos del agua.`,
    uso: "📝 <b>Uso:</b> Aplicar cuando el agua se vea opaca o blanquecina."
  },
  "Clarify 60ml": {
    resumen: "💎 Tratamiento avanzado para claridad total.",
    cuerpo: `Elimina la turbidez mecánica causada por el sustrato o desechos.
    • <b>Rápido:</b> Resultados visibles poco tiempo después de la aplicación.
    • <b>Potente:</b> Ideal para dejar el acuario impecable antes de un evento.`,
    uso: "📝 <b>Uso:</b> Asegurarse de tener buena oxigenación durante el proceso."
  },
  "Antihongos 30ml": {
    resumen: "🍄 Previene y trata infecciones por hongos.",
    cuerpo: `Protección eficaz contra manchas blancas o algodonosas.
    • <b>Prevención:</b> Evita que heridas físicas se conviertan en infecciones.
    • <b>Cuidado:</b> Seguro para la mayoría de peces de ornato.`,
    uso: "📝 <b>Uso:</b> Aplicar ante los primeros síntomas visuales en la piel."
  },
  "Tratamiento de agua ICK 30 ml": {
    resumen: "🚑 Alivio contra la enfermedad del Punto Blanco.",
    cuerpo: `Combate el parásito causante del ICK de manera efectiva.
    • <b>Recuperación:</b> Alivia la irritación en la piel y branquias.
    • <b>Específico:</b> Diseñado para cortar el ciclo de vida del parásito.`,
    uso: "📝 <b>Uso:</b> Seguir el tratamiento completo incluso si los puntos desaparecen."
  },
  "Antihongos": {
    resumen: "🛡️ Protección fúngica reforzada.",
    cuerpo: `Mantiene el ambiente libre de hongos patógenos.
    • <b>Acción:</b> Detiene la propagación de esporas en el agua.
    • <b>Versátil:</b> Útil para desinfectar redes o accesorios nuevos.`,
    uso: "📝 <b>Uso:</b> Dosificación estándar para prevención general."
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
  const [cargando, setCargando] = useState(true);

  const BACKEND_URL = "https://distriariza.onrender.com";

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 3
    }).format(valor);
  };

  const colecciones = [
    { t: 'LÍQUIDOS', val: 'Líquidos vitales', icon: '💧' },
    { t: 'COMIDA', val: 'Alimentos', icon: '🍱' },
    { t: 'VACACIONES', val: 'Productos para tus vacaciones', icon: '🏖️' },
    { t: 'ACCESORIOS', val: 'Accesorios', icon: '🎨' },
    { t: 'EQUIPOS', val: 'Equipos', icon: '⚙️' },
    { t: 'HAMSTERS', val: 'Accesorios para hamsters', icon: '🐹' }
  ];

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      // Mantenemos la pantalla de carga 1.8s para que se vea la animación
      setTimeout(() => setCargando(false), 1800); 
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  const productosVisibles = productos.filter(p => {
    const normalizar = (texto) => 
      texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";
    const nombreProducto = normalizar(p.nombre);
    const queryBusqueda = normalizar(busqueda);
    const categoriaDelProducto = normalizar(p.categoria_nombre);
    const categoriaDelFiltro = normalizar(categoriaActiva);
    const coincideBusqueda = nombreProducto.includes(queryBusqueda);
    if (categoriaActiva === 'Todos') return coincideBusqueda;
    const coincideCategoria = 
      categoriaDelProducto === categoriaDelFiltro || 
      categoriaDelProducto.includes(categoriaDelFiltro) ||
      categoriaDelFiltro.includes(categoriaDelProducto);
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

  // RENDERIZADO DE PANTALLA DE CARGA
  if (cargando) return <PantallaCarga />;

  return (
    <div style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '10px 25px', backgroundColor: 'white', position: 'sticky', top: 0, 
        zIndex: 1000, borderBottom: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Logo.jpeg" alt="Logo" style={{ height: '50px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Logo" }} />
          <div style={{ lineHeight: '1' }}>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Distribuciones Ariza</h1>
            <span style={{ fontSize: '0.6rem', color: '#1A73E8', fontWeight: 700, letterSpacing: '1px' }}>FISH ACCESSORIES</span>
          </div>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ cursor: 'pointer', position: 'relative', fontSize: '1.3rem' }}>
          🛒 {totalItems > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#1A73E8', color: 'white', fontSize: '0.65rem', borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold', border: '2px solid white' }}>
              {totalItems}
            </span>
          )}
        </div>
      </nav>

      <div style={{ padding: '40px 30px 20px 30px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, margin: '0 0 20px 0', lineHeight: '1.2', color: '#111827' }}>
          Todo lo que necesitas para tus<br /><span style={{ color: '#1A73E8' }}>peces y hámsters.</span>
        </h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <input type="text" placeholder="¿Qué mascota vamos a consentir hoy?" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
            style={{ width: '100%', padding: '14px 20px 14px 50px', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', fontSize: '0.95rem', outline: 'none' }} />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '1.1rem' }}>🔍</span>
        </div>
      </div>

      <div style={{ padding: '0 30px' }}>
        <div style={{ marginBottom: '45px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Explorar categorías</h3>
            <span onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} style={{ color: '#1A73E8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Ver todo</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
            {colecciones.map((col, i) => (
              <div key={i} onClick={() => setCategoriaActiva(col.val)} style={{ minWidth: '90px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ 
                  width: '75px', height: '75px', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                  backgroundColor: categoriaActiva === col.val ? '#1A73E8' : 'white', color: categoriaActiva === col.val ? 'white' : '#111827',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)', transition: '0.3s', border: '3px solid white'
                }}>{col.icon}</div>
                <p style={{ marginTop: '10px', fontSize: '0.7rem', fontWeight: 700, color: categoriaActiva === col.val ? '#1A73E8' : '#4B5563', lineHeight: '1.2', textTransform: 'uppercase' }}>{col.t}</p>
              </div>
            ))}
          </div>
        </div>

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
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A73E8' }}>{formatoMoneda(p.precio)}</span>
                  <button onClick={() => agregarAlCarrito(p)} style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#1A73E8', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {productoSeleccionado && (
        <>
          <div onClick={() => setProductoSeleccionado(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, backdropFilter: 'blur(8px)' }}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: 'white', zIndex: 3001, borderRadius: '32px', padding: '30px' }}>
            <button onClick={() => setProductoSeleccionado(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer' }}>✕</button>
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '24px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <img src={obtenerRutaImagen(productoSeleccionado.imagen_url)} alt={productoSeleccionado.nombre} style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            <h2 style={{ margin: '5px 0 15px 0', fontSize: '1.6rem', fontWeight: 800 }}>{productoSeleccionado.nombre}</h2>
            <div style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.resumen || "Calidad garantizada para tu mascota."}</p>
              <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: DESCRIPCIONES_DETALLADAS[productoSeleccionado.nombre]?.cuerpo || productoSeleccionado.descripcion }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatoMoneda(productoSeleccionado.precio)}</div>
              <button onClick={() => { agregarAlCarrito(productoSeleccionado); setProductoSeleccionado(null); }} style={{ backgroundColor: '#1A73E8', color: 'white', padding: '16px 25px', borderRadius: '18px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Añadir 🛒</button>
            </div>
          </div>
        </>
      )}

      {carritoAbierto && (
        <>
          <div onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1500 }}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '420px', height: '100%', backgroundColor: '#F9FAFB', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '30px', borderBottom: '1px solid #f0f0f0' }}>
              {pasoCarrito === 'envio' && <button onClick={() => setPasoCarrito('lista')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px', fontSize: '1.2rem' }}>←</button>}
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>{pasoCarrito === 'lista' ? 'Tu Carrito' : 'Datos de Entrega'}</h2>
              <button onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
              {pasoCarrito === 'lista' && (
                carrito.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>Tu carrito está esperando productos.</p> : carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '20px' }}>
                    <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{item.nombre}</p>
                      <p style={{ color: '#1A73E8', fontWeight: 700 }}>{formatoMoneda(item.precio * item.cantidad)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => restarCantidad(item.id)} style={{ border: 'none', background: '#f3f4f6', borderRadius: '8px', width: '25px', height: '25px' }}>-</button>
                      <span style={{ fontWeight: 600 }}>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} style={{ border: 'none', background: '#f3f4f6', borderRadius: '8px', width: '25px', height: '25px' }}>+</button>
                    </div>
                  </div>
                ))
              )}
              {pasoCarrito === 'envio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Nombre completo" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})} />
                  <input type="text" placeholder="Dirección" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})} />
                  <input type="text" placeholder="Ciudad" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, ciudad: e.target.value})} />
                  <input type="text" placeholder="Teléfono" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB' }} onChange={(e) => setDatosEnvio({...datosEnvio, telefono: e.target.value})} />
                </div>
              )}
              {pasoCarrito === 'confirmado' && (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ fontSize: '4rem' }}>✅</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>¡Pedido Procesado!</h3>
                  <button onClick={() => { setCarrito([]); setCarritoAbierto(false); setPasoCarrito('lista'); }} style={{ width: '100%', marginTop: '20px', padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '15px', border: 'none', fontWeight: 700 }}>Regresar</button>
                </div>
              )}
            </div>
            {carrito.length > 0 && pasoCarrito !== 'confirmado' && (
              <div style={{ padding: '25px 30px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 600, color: '#6B7280' }}>Total:</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatoMoneda(totalCompra)}</span>
                </div>
                <button onClick={pasoCarrito === 'lista' ? () => setPasoCarrito('envio') : finalizarPedidoWhatsApp} style={{ width: '100%', padding: '18px', backgroundColor: pasoCarrito === 'lista' ? '#1A73E8' : '#25D366', color: 'white', borderRadius: '18px', border: 'none', fontWeight: 700 }}>
                  {pasoCarrito === 'lista' ? 'Siguiente paso' : 'Pedir por WhatsApp 🚀'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '12px 0', display: 'flex', justifyContent: 'space-around', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <div onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} style={{ textAlign: 'center', color: categoriaActiva === 'Todos' ? '#1A73E8' : '#9CA3AF', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.4rem' }}>🏪</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>TIENDA</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} style={{ textAlign: 'center', color: '#9CA3AF', cursor: 'pointer', position: 'relative' }}>
          <div style={{ fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
            🛒
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#EF4444', color: 'white', fontSize: '0.65rem', minWidth: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {totalItems}
              </span>
            )}
          </div>
          <br />
          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>CARRITO</span>
        </div>
      </div>
    </div>
  );
}

export default App;