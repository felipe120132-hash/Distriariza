const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); 
const db = require('./config/db'); 

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
        console.log("Iniciando sembrado de base de datos...");
        
        // A. Limpiar tablas para evitar duplicados y resetear IDs
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

        // C. Listado de productos (Precios sin puntos para MySQL)
        const listaProductos = [
            // Líquidos
            { nombre: 'Acuaprime 30ml', desc: 'Eliminador de cloro y metales pesados.', precio: 3,000, cat: liqId, img: 'acuaprime-30.jpeg' },
            { nombre: 'Acuaprime 120ml', desc: 'Eliminador de cloro y metales pesados.', precio: 6,500, cat: liqId, img: 'acuaprime-120.jpeg' },
            { nombre: 'Acuaprime 240ml', desc: 'Eliminador de cloro y metales pesados.', precio: 11,500, cat: liqId, img: 'acuaprime-240.jpeg' },
            { nombre: 'Acuaprime Litro', desc: 'Eliminador de cloro y metales pesados.', precio: 29,000, cat: liqId, img: 'acuaprime-litro.jpeg' },
            { nombre: 'Cycle 30ml', desc: 'Suplemento biológico para acuarios.', precio: 3,000, cat: liqId, img: 'cycle-30.jpeg' },
            { nombre: 'Cycle 120ml', desc: 'Suplemento biológico para acuarios.', precio: 6,500 , cat: liqId, img: 'cycle-120.jpeg' },
            { nombre: 'Cycle 240ml', desc: 'Suplemento biológico para acuarios.', precio: 11,500, cat: liqId, img: 'cycle-240.jpeg' },
            { nombre: 'Cycle Litro', desc: 'Suplemento biológico para acuarios.', precio: 29,000, cat: liqId, img: 'cycle-litro.jpeg' },
            { nombre: 'Test Plus Ultra PH', desc: 'Medidor de PH con mayor precisión.', precio: 5,500, cat: liqId, img: 'test-ph.jpeg' },
            { nombre: 'Alga Clear 20ml', desc: 'Evita la propagación de algas por luz solar.', precio: 4,500, cat: liqId, img: 'alga-clear-20.jpeg' },
            { nombre: 'Clarify 20ml', desc: 'Tratamiento para mejorar la claridad del agua.', precio: 3,000, cat: liqId, img: 'clarify-20.jpeg' },
            { nombre: 'Clarify 60ml', desc: 'Tratamiento para mejorar la claridad del agua.', precio: 6,500, cat: liqId, img: 'clarify-60.jpeg' },
            { nombre: 'Antihongos 30ml', desc: 'Previene la formación de hongos.', precio: 1,300, cat: liqId, img: 'antihongos-30.jpeg' },
            { nombre: 'Tratamiento ICK 30 ml', desc: 'Alivia enfermedades de punto blanco.', precio: 1,300, cat: liqId, img: 'ICK-30.jpeg' },
            { nombre: 'Antialgas', desc: 'Previene la formación de algas.', precio: 3,000, cat: liqId, img: 'antialgas.jpeg' },
            // Alimentos
            { nombre: 'Nutri 5 Pellets', desc: 'Comida para toda clase de peces.', precio: 6,000, cat: alimId, img: 'nutri5-pellets.jpeg' },
            { nombre: 'Betta Pellets 30gr', desc: 'Alimento especializado para Bettas.', precio: 5,500, cat: alimId, img: 'betta.jpeg' },
            { nombre: 'Comida para kois', desc: 'Presentación por libra.', precio: 27,000, cat: alimId, img: 'comida-kois.jpeg' },

            // Equipos
            { nombre: 'Filtro 2450L', desc: 'Sistema de filtración interna.', precio: 34,000, cat: eqId, img: 'filtro-2450.jpeg' },
            { nombre: 'Termostato 100W', desc: 'Regulador de temperatura.', precio: 13,000, cat: eqId, img: 'termostato100.jpeg' },
            { nombre: 'Comedero Automático', desc: 'Programable digitalmente.', precio: 43,000, cat: eqId, img: 'comedero3tiempos.jpeg' }
        ];

        // D. Transformar objetos a arrays de valores para el INSERT masivo
        const valoresParaInsertar = listaProductos.map(p => [
            p.nombre, 
            p.desc, 
            p.precio, 
            p.cat, 
            p.img
        ]);

        // E. Inserción final (Asegúrate de que la columna sea categoria_id o cat)
        const sql = 'INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES ?';
        await db.query(sql, [valoresParaInsertar]);

        res.send("<h1>✅ ¡Catálogo cargado con éxito!</h1><p>Los productos ya están en la base de datos de Aiven.</p>");
    } catch (error) {
        console.error("Error en el cargador:", error);
        res.status(500).send("Error en la carga: " + error.message);
    }
});

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
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});