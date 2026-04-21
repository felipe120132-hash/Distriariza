const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); 
const db = require('./config/db'); // Importamos la conexión a la base de datos

// 1. Importar las rutas
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// 2. INICIALIZAR la aplicación
const app = express();

// 3. Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

// 4. Servir archivos estáticos
app.use('/productos', express.static(path.join(__dirname, 'public/productos')));

// --- RUTA DE EMERGENCIA PARA CARGAR PRODUCTOS (SOLUCIÓN SSL) ---
app.get('/api/load-catalog', async (req, res) => {
    try {
        // A. Limpiar tablas para evitar duplicados
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE productos');
        await db.query('TRUNCATE TABLE categorias');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        // B. Crear Categorías y obtener IDs
        const [resLiq] = await db.query("INSERT INTO categorias (nombre) VALUES ('Líquidos Vitales')");
        const [resAlim] = await db.query("INSERT INTO categorias (nombre) VALUES ('Alimentos')");
        const [resEq] = await db.query("INSERT INTO categorias (nombre) VALUES ('Equipos')");
        
        const liqId = resLiq.insertId;
        const alimId = resAlim.insertId;
        const eqId = resEq.insertId;

        // C. Listado de productos (puedes añadir todos los que necesites aquí)
         const productos = [
            // Líquidos (ID: catLiq.insertId)
            { nombre: 'Acuaprime 30ml', desc: 'Eliminador de cloro y metales pesados.', precio: 3.000, cat: catLiq.insertId, img: 'acuaprime-30.jpeg' },
            { nombre: 'Acuaprime 120ml', desc: 'Eliminador de cloro y metales pesados.', precio: 6.500, cat: catLiq.insertId, img: 'acuaprime-120.jpeg' },
            { nombre: 'Acuaprime 240ml', desc: 'Eliminador de cloro y metales pesados.', precio: 11.500, cat: catLiq.insertId, img: 'acuaprime-240.jpeg' },
            { nombre: 'Acuaprime Litro', desc: 'Eliminador de cloro y metales pesados.', precio: 29.000, cat: catLiq.insertId, img: 'acuaprime-litro.jpeg' },
            { nombre: 'Cycle 30ml', desc: 'Suplemento biológico para acuarios.', precio: 3.000, cat: catLiq.insertId, img: 'cycle-30.jpeg' },
            { nombre: 'Cycle 120ml', desc: 'Suplemento biológico para acuarios.', precio: 6.500, cat: catLiq.insertId, img: 'cycle-120.jpeg' },
            { nombre: 'Cycle 240ml', desc: 'Suplemento biológico para acuarios.', precio: 11.500, cat: catLiq.insertId, img: 'cycle-240.jpeg' },
            { nombre: 'Cycle Litro', desc: 'Suplemento biológico para acuarios.', precio: 29.000, cat: catLiq.insertId, img: 'cycle-litro.jpeg' },
            { nombre: 'Test Plus Ultra PH', desc: 'Medidor de PH con mayor precisión.', precio: 5.500, cat: catLiq.insertId, img: 'test-ph.jpeg' },
            { nombre: 'Alga Clear 20ml', desc: 'Evita la propagación de algas causadas por la luz del sol.', precio: 4.500, cat: catLiq.insertId, img: 'alga-clear-20.jpeg' },
            { nombre: 'Clarify 20ml', desc: 'Tratamiento para mejorar la claridad del agua.', precio: 3.000, cat: catLiq.insertId, img: 'clarify-20.jpeg' },
            { nombre: 'Clarify 60ml', desc: 'Tratamiento para mejorar la claridad del agua.', precio: 6.500, cat: catLiq.insertId, img: 'clarify-60.jpeg' },
            { nombre: 'Antihongos 30ml', desc: 'Previene la formación de hongos en el acuario.', precio: 1.300, cat: catLiq.insertId, img: 'antihongos-30.jpeg' },
            { nombre: 'Tratamiento de agua ICK 30 ml', desc: 'Alivia enfermedades causadas por elpunto blanco.', precio: 1.300, cat: catLiq.insertId, img: 'ICK-30.jpeg' },
            { nombre: 'Antihongos', desc: 'Previene la formación de hongos en el acuario.', precio: 3.000, cat: catLiq.insertId, img: 'antihongos.jpeg' },

            // Alimentos (ID: catAlim.insertId)
            { nombre: 'Nutri 5 Pellets', desc: 'Comida para toda clase de peces.', precio: 6.000, cat: catAlim.insertId, img: 'nutri5-pellets.jpeg' },
            { nombre: 'Betta Pellets 30gr', desc: 'Alimento especializado para Bettas.', precio: 5.500, cat: catAlim.insertId, img: 'betta.jpeg' },
            { nombre: 'Comida para kois', desc: 'Presentación por libra.', precio: 27.000, cat: catAlim.insertId, img: 'comida-kois.jpeg' },

            // Equipos (ID: catEq.insertId)
            { nombre: 'Filtro 2450L', desc: 'Sistema de filtración interna.', precio: 34.000, cat: catEq.insertId, img: 'filtro-2450.jpeg' },
            { nombre: 'Termostato 100W', desc: 'Regulador de temperatura.', precio: 13.000, cat: catEq.insertId, img: 'termostato100.jpeg' },
            { nombre: 'Comedero Automático de 3 tiempos', desc: 'Programable digitalmente.', precio: 43.000, cat: catEq.insertId, img: 'comedero3tiempos.jpeg' }
        ];


        // D. Inserción masiva
        // IMPORTANTE: Verifica si tu columna se llama 'categoria_id' o 'cat' en la BD
        const sql = 'INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES ?';
        await db.query(sql, [productos]);

        res.send("<h1>✅ ¡Catálogo cargado con éxito en la nube!</h1><p>Ya puedes revisar tu web.</p>");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la carga: " + error.message);
    }
});

// 5. Definir las rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// 6. Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    // Si la ruta empieza por /api/load-catalog, no debería llegar aquí, 
    // pero esto asegura que no choque con otras rutas.
    if (req.path === '/api/load-catalog') return next();
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
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});