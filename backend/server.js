const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); 

// 1. Importar las rutas
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// 2. INICIALIZAR la aplicación
const app = express();

// 3. Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

// 4. Servir imágenes estáticas (CORREGIDO para Windows/Linux)
// Usamos comas en lugar de slashes para que path.join haga su magia
// 4. Servir archivos estáticos (Logo, Productos, etc.)
// Al servir 'public', el acceso será: /productos/imagen.jpg o /assets/logo.png
app.use('/productos', express.static(path.join(__dirname, 'public/productos')));

// 5. Definir las rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// 6. Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// 7. Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// 8. Encender el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});