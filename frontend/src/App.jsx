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
  // ... (Tus estados y funciones se mantienen igual)

  return (
    <div id="root"> {/* Usamos el id="root" que definimos en el CSS */}
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="menu-icon">☰</span>
          <h1 className="logo-text">Distribuciones Ariza</h1>
        </div>
        <div onClick={() => setCarritoAbierto(true)} className="cart-trigger">
          🛒 {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>
      </nav>

      {/* HERO & SEARCH */}
      <header className="hero">
        <h2 className="hero-title">
          Seleccionando los mejores<br />
          <span className="accent-text">ejemplares del mundo.</span>
        </h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar especies o tecnología..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      <main className="main-content">
        {/* COLECCIONES */}
        <section className="collections-section">
          <div className="section-header">
            <h3>Colecciones</h3>
            <span onClick={() => setCategoriaActiva('Todos')} className="view-all">Ver todo</span>
          </div>
          <div className="collections-grid">
            {[
              { t: 'Agua Dulce', val: 'Agua Dulce', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
              { t: 'Agua Salada', val: 'Agua Salada', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400' },
              { t: 'Arrecife', val: 'Arrecife', img: 'https://images.unsplash.com/photo-1546024077-c4b626955eef?w=400' }
            ].map((col, i) => (
              <div key={i} onClick={() => setCategoriaActiva(col.val)} className={`collection-card ${categoriaActiva === col.val ? 'active' : ''}`}>
                <img src={col.img} alt={col.t} />
                <p>{col.t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LISTADO DE PRODUCTOS */}
        <section className="products-section">
          <h3 className="section-title">
            {categoriaActiva === 'Todos' ? 'Productos destacados' : `Productos: ${categoriaActiva}`}
          </h3>
          <div className="products-grid">
            {productosVisibles.map(p => (
              <div key={p.id} className="product-card">
                <div onClick={() => setProductoSeleccionado(p)} className="product-image-wrapper">
                  <img src={obtenerRutaImagen(p.imagen_url)} alt={p.nombre} />
                </div>
                <p className="product-category">{p.categoria_nombre || 'Equipamiento'}</p>
                <h4 onClick={() => setProductoSeleccionado(p)} className="product-name">{p.nombre}</h4>
                <div className="product-footer">
                  <span className="product-price">${Number(p.precio).toLocaleString()}</span>
                  <button onClick={() => agregarAlCarrito(p)} className="add-btn">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CARRITO (ESTILO DRAWER) */}
      {carritoAbierto && (
        <>
          <div onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} className="overlay"></div>
          <div className="cart-drawer">
            <div className="cart-header">
              {pasoCarrito === 'envio' && <button onClick={() => setPasoCarrito('lista')} className="back-btn">←</button>}
              <h2>{pasoCarrito === 'lista' ? 'Tu Carrito' : 'Finalizar Compra'}</h2>
              <button onClick={() => { setCarritoAbierto(false); setPasoCarrito('lista'); }} className="close-btn">✕</button>
            </div>

            <div className="cart-body">
              {pasoCarrito === 'lista' && (
                carrito.length === 0 ? <p className="empty-msg">Tu carrito está vacío</p> : 
                carrito.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={obtenerRutaImagen(item.imagen_url)} alt={item.nombre} />
                    <div className="item-info">
                      <p className="item-name">{item.nombre}</p>
                      <p className="item-price">${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => restarCantidad(item.id)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)}>+</button>
                    </div>
                  </div>
                ))
              )}

              {pasoCarrito === 'envio' && (
                <div className="checkout-form">
                  <p className="form-subtitle">Detalles de Envío</p>
                  <input type="text" placeholder="Nombre completo" onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})} />
                  <input type="text" placeholder="Dirección" onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})} />
                  <input type="text" placeholder="Ciudad" onChange={(e) => setDatosEnvio({...datosEnvio, ciudad: e.target.value})} />
                  <input type="text" placeholder="Teléfono" onChange={(e) => setDatosEnvio({...datosEnvio, telefono: e.target.value})} />
                </div>
              )}
            </div>

            {carrito.length > 0 && pasoCarrito !== 'confirmado' && (
              <div className="cart-footer">
                <div className="total-row">
                  <span className="total-label">Total a pagar:</span>
                  <span className="total-amount">${totalCompra.toLocaleString()}</span>
                </div>
                {pasoCarrito === 'lista' ? (
                  <button onClick={() => setPasoCarrito('envio')} className="btn-primary">Continuar al pago</button>
                ) : (
                  <button 
                    disabled={!datosEnvio.nombre || !datosEnvio.direccion || !datosEnvio.telefono} 
                    onClick={finalizarPedidoWhatsApp} 
                    className="btn-whatsapp"
                  >
                    Confirmar pedido vía WhatsApp 🚀
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* DOCK INFERIOR */}
      <div className="bottom-menu">
        <div onClick={() => {setCategoriaActiva('Todos'); setBusqueda('');}} className="menu-item active">
          <div className="menu-icon-inner">⊞</div>
          <span>TIENDA</span>
        </div>
        <div onClick={() => setCarritoAbierto(true)} className="menu-item">
          <div className="menu-icon-inner">🛒</div>
          <span>CARRITO</span>
        </div>
      </div>
    </div>
  );
}

export default App;