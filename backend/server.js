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
const productos = [

            // ── LÍQUIDOS VITALES ──────────────────────────────────────────────
            { nombre: 'Acuaprime 30ml',             desc: 'Eliminador de cloro y metales pesados. Actúa en 10 minutos.',             precio: 3000,  cat: catLiq.insertId, img: 'acuaprime-30.jpeg' },
            { nombre: 'Acuaprime 120ml',            desc: 'Eliminador de cloro y metales pesados. Actúa en 10 minutos.',             precio: 6500,  cat: catLiq.insertId, img: 'acuaprime-120.jpeg' },
            { nombre: 'Acuaprime 240ml',            desc: 'Eliminador de cloro y metales pesados. Actúa en 10 minutos.',             precio: 11500, cat: catLiq.insertId, img: 'acuaprime-240.jpeg' },
            { nombre: 'Acuaprime Litro',            desc: 'Eliminador de cloro y metales pesados. Actúa en 10 minutos.',             precio: 29000, cat: catLiq.insertId, img: 'acuaprime-litro.jpeg' },
            { nombre: 'Cycle 30ml',                 desc: 'Suplemento biológico para acuarios.',                                     precio: 3000,  cat: catLiq.insertId, img: 'cycle-30.jpeg' },
            { nombre: 'Cycle 120ml',                desc: 'Suplemento biológico para acuarios.',                                     precio: 6500,  cat: catLiq.insertId, img: 'cycle-120.jpeg' },
            { nombre: 'Cycle 240ml',                desc: 'Suplemento biológico para acuarios.',                                     precio: 11500, cat: catLiq.insertId, img: 'cycle-240.jpeg' },
            { nombre: 'Cycle Litro',                desc: 'Suplemento biológico para acuarios.',                                     precio: 29000, cat: catLiq.insertId, img: 'cycle-litro.jpeg' },
            { nombre: 'Antialgas 20ml',             desc: 'Evita la propagación de las algas causadas por la luz solar.',            precio: 4500,  cat: catLiq.insertId, img: 'alga-clear-20.jpeg' },
            { nombre: 'Test Plus Ultra PH 20ml',    desc: 'Medidor de PH con 100% de efectividad.',                                  precio: 5500,  cat: catLiq.insertId, img: 'test-ph.jpeg' },
            { nombre: 'Clarify 20ml',               desc: 'Aclarador de agua.',                                                      precio: 3000,  cat: catLiq.insertId, img: 'clarify-20.jpeg' },
            { nombre: 'Clarify 60ml',               desc: 'Aclarador de agua.',                                                      precio: 6500,  cat: catLiq.insertId, img: 'clarify-60.jpeg' },
            { nombre: 'Antihongos 30ml',            desc: 'Previene la formación de hongos en el acuario.',                          precio: 1300,  cat: catLiq.insertId, img: 'antihongos-30.jpeg' },
            { nombre: 'Azul de Metileno 30ml',      desc: 'Control de parásitos ICH.',                                               precio: 1300,  cat: catLiq.insertId, img: 'azul-metileno-30.jpeg' },
            { nombre: 'Tratamiento de Agua ICK 30ml', desc: 'Alivia enfermedades causadas por el punto blanco.',                     precio: 1300,  cat: catLiq.insertId, img: 'ICK-30.jpeg' },
            { nombre: 'Antialgas',                  desc: 'Evita la acumulación de algas en el acuario.',                            precio: 3000,  cat: catLiq.insertId, img: 'antialgas.jpeg' },

            // ── ALIMENTOS ─────────────────────────────────────────────────────
            { nombre: 'Nutri 5 Pellets',            desc: 'Comida PELLETS para toda clase de peces.',                                precio: 6000,  cat: catAlim.insertId, img: 'nutri5-pellets.jpeg' },
            { nombre: 'Betta Pellets 30gr',         desc: 'Comida PELLETS para peces betta.',                                        precio: 5500,  cat: catAlim.insertId, img: 'betta.jpeg' },
            { nombre: 'Alimento para Peces de Fondo 30gr', desc: 'Alimento rico en moringa, avena y omega 6 y 3.',                   precio: 5500,  cat: catAlim.insertId, img: 'alimento-fondo-30.jpeg' },
            { nombre: 'Nutrí 5 Libra',              desc: 'Comida PELLETS para toda clase de peces.',                                precio: 27000, cat: catAlim.insertId, img: 'nutri5-libra.jpeg' },
            { nombre: 'Comida con Caroteno (peces pequeños)', desc: 'Comida no flotante con caroteno para peces pequeños, por libra.', precio: 27000, cat: catAlim.insertId, img: 'caroteno-pequenos.jpeg' },
            { nombre: 'Comida con Caroteno (peces grandes)', desc: 'Comida con caroteno para peces grandes, por libra.',             precio: 27000, cat: catAlim.insertId, img: 'caroteno-grandes.jpeg' },
            { nombre: 'Comida Vegetal (peces grandes)', desc: 'Comida a base de algas para peces grandes, por libra.',               precio: 27000, cat: catAlim.insertId, img: 'vegetal-grandes.jpeg' },
            { nombre: 'Comida Vegetal (peces de fondo)', desc: 'Comida a base de algas para peces de fondo (cuchas), por libra.',    precio: 27000, cat: catAlim.insertId, img: 'vegetal-fondo.jpeg' },
            { nombre: 'Comida para Kois',           desc: 'Comida flotante para kois, por libra.',                                   precio: 27000, cat: catAlim.insertId, img: 'comida-kois.jpeg' },
            { nombre: 'Comida para Tortuga',        desc: 'Comida para tortuga, por libra.',                                         precio: 27000, cat: catAlim.insertId, img: 'comida-tortuga.jpeg' },
            { nombre: 'Tropical 1ml',               desc: 'Comida flotante a granel, bulto x10 libras.',                             precio: 70000, cat: catAlim.insertId, img: 'tropical-1ml.jpeg' },
            { nombre: 'Tropical 3ml',               desc: 'Comida flotante a granel, bulto x10 libras.',                             precio: 70000, cat: catAlim.insertId, img: 'tropical-3ml.jpeg' },
            { nombre: 'Tropical 5ml',               desc: 'Comida para peces grandes (coy), por bulto.',                             precio: 70000, cat: catAlim.insertId, img: 'tropical-5ml.jpeg' },
            { nombre: 'Nutri 5 Hojuela 20gr',       desc: 'Comida en hojuela para toda clase de peces.',                            precio: 2500,  cat: catAlim.insertId, img: 'nutri5-hojuela-20.jpeg' },
            { nombre: 'Nutri 5 Hojuela Libra',      desc: 'Comida en hojuela para toda clase de peces.',                            precio: 27000, cat: catAlim.insertId, img: 'nutri5-hojuela-libra.jpeg' },
            { nombre: 'Desparasitante',             desc: 'Desparasitante natural, 100% eficaz.',                                    precio: 3500,  cat: catAlim.insertId, img: 'desparasitante.jpeg' },
            { nombre: 'Incros 14gr',                desc: 'Comida en hojuela para peces.',                                           precio: 58000, cat: catAlim.insertId, img: 'incros-14.jpeg' },
            { nombre: 'Incros 30gr',                desc: 'Comida en hojuela para peces.',                                           precio: 105000,cat: catAlim.insertId, img: 'incros-30.jpeg' },
            { nombre: 'Incros 100gr',               desc: 'Comida en hojuela para peces.',                                           precio: 82000, cat: catAlim.insertId, img: 'incros-100.jpeg' },
            { nombre: 'Ocelatus 20gr',              desc: 'Comida en hojuela para peces.',                                           precio: 41400, cat: catAlim.insertId, img: 'ocelatus-20.jpeg' },
            { nombre: 'Ocelatus 100gr',             desc: 'Comida en hojuela para peces.',                                           precio: 43300, cat: catAlim.insertId, img: 'ocelatus-100.jpeg' },
            { nombre: 'Goldfish 20gr',              desc: 'Comida en hojuela para peces.',                                           precio: 55000, cat: catAlim.insertId, img: 'goldfish-20.jpeg' },
            { nombre: 'Comida Vacacional 3 Días (Peces Fin de Semana)', desc: 'Suplemento alimenticio en bloque para toda clase de peces.', precio: 6200, cat: catAlim.insertId, img: 'vacacional-3dias-fds.jpeg' },
            { nombre: 'Comida Vacacional 15 Días (Peces Fin de Semana)', desc: 'Suplemento alimenticio en bloque para toda clase de peces.', precio: 6200, cat: catAlim.insertId, img: 'vacacional-15dias-fds.jpeg' },
            { nombre: 'Comida Vacacional 3 Días (Nutri 5)',  desc: 'Suplemento alimenticio en bloque para toda clase de peces.',     precio: 5200,  cat: catAlim.insertId, img: 'vacacional-3dias-nutri5.jpeg' },
            { nombre: 'Comida Vacacional 15 Días (Nutri 5)', desc: 'Suplemento alimenticio en bloque para toda clase de peces.',    precio: 5200,  cat: catAlim.insertId, img: 'vacacional-15dias-nutri5.jpeg' },

            // ── EQUIPOS ───────────────────────────────────────────────────────
            { nombre: 'Filtro 600L',                desc: 'Filtro interno 3 en 1, 600 litros/hora.',                                 precio: 19000, cat: catEq.insertId, img: 'filtro-600.jpeg' },
            { nombre: 'Filtro 800L',                desc: 'Filtro interno 3 en 1, 800 litros/hora.',                                 precio: 21000, cat: catEq.insertId, img: 'filtro-800.jpeg' },
            { nombre: 'Filtro 1500L',               desc: 'Filtro interno 3 en 1, 1500 litros/hora.',                                precio: 28000, cat: catEq.insertId, img: 'filtro-1500.jpeg' },
            { nombre: 'Filtro 1700L',               desc: 'Filtro interno 3 en 1, 1700 litros/hora.',                                precio: 31000, cat: catEq.insertId, img: 'filtro-1700.jpeg' },
            { nombre: 'Filtro 2450L',               desc: 'Sistema de filtración interna, 2450 litros/hora.',                        precio: 34000, cat: catEq.insertId, img: 'filtro-2450.jpeg' },
            { nombre: 'Motor de 1 Salida',          desc: 'Bomba de aire silenciosa para acuario.',                                  precio: 12000, cat: catEq.insertId, img: 'motor-1salida.jpeg' },
            { nombre: 'Termostato 25W',             desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 12500, cat: catEq.insertId, img: 'termostato25.jpeg' },
            { nombre: 'Termostato 50W',             desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 12500, cat: catEq.insertId, img: 'termostato50.jpeg' },
            { nombre: 'Termostato 75W',             desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 12500, cat: catEq.insertId, img: 'termostato75.jpeg' },
            { nombre: 'Termostato 100W',            desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 13000, cat: catEq.insertId, img: 'termostato100.jpeg' },
            { nombre: 'Termostato 150W',            desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 13000, cat: catEq.insertId, img: 'termostato150.jpeg' },
            { nombre: 'Termostato 200W',            desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 14500, cat: catEq.insertId, img: 'termostato200.jpeg' },
            { nombre: 'Termostato 300W',            desc: 'Calentador de vidrio sumergible para acuario.',                           precio: 14500, cat: catEq.insertId, img: 'termostato300.jpeg' },
            { nombre: 'Comedero Automático de 3 Tiempos', desc: 'Programable a 6, 12, 18 y 24 horas.',                              precio: 43000, cat: catEq.insertId, img: 'comedero3tiempos.jpeg' },
            { nombre: 'Comedero Automático Digital', desc: 'Comedero digital programable a 6, 12, 18 y 24 horas.',                   precio: 45000, cat: catEq.insertId, img: 'comedero-digital.jpeg' },
            { nombre: 'Comedero Automático Digital con Medidor de Temperatura', desc: 'Comedero digital con sensor de temperatura, programable a 6, 12, 18 y 24 horas.', precio: 55000, cat: catEq.insertId, img: 'comedero-digital-temp.jpeg' },

            // ── PLANTAS ARTIFICIALES ──────────────────────────────────────────
            { nombre: 'Planta Artificial SC673-3A', desc: 'Planta artificial decorativa para acuario.',                              precio: 9000,  cat: catPlantas.insertId, img: 'planta-sc673-3a.jpeg' },
            { nombre: 'Planta Artificial SC-2252',  desc: 'Planta artificial decorativa para acuario.',                              precio: 9000,  cat: catPlantas.insertId, img: 'planta-sc2252.jpeg' },
            { nombre: 'Planta Artificial SC673-37', desc: 'Planta artificial decorativa para acuario.',                              precio: 6500,  cat: catPlantas.insertId, img: 'planta-sc673-37.jpeg' },
            { nombre: 'Planta Artificial E-Series x2', desc: 'Pack de 2 plantas artificiales decorativas para acuario.',             precio: 6300,  cat: catPlantas.insertId, img: 'planta-eseries.jpeg' },
            { nombre: 'Planta Artificial SC-2251',  desc: 'Planta artificial decorativa para acuario.',                              precio: 15000, cat: catPlantas.insertId, img: 'planta-sc2251.jpeg' },
            { nombre: 'Planta Artificial F-10 (x10)', desc: 'Set de 10 plantas artificiales pequeñas para acuario.',                 precio: 7500,  cat: catPlantas.insertId, img: 'planta-f10.jpeg' },
            { nombre: 'Planta Artificial B-Series', desc: 'Planta artificial decorativa para acuario.',                              precio: 6300,  cat: catPlantas.insertId, img: 'planta-bseries.jpeg' },
            { nombre: 'Planta Artificial SC-346',   desc: 'Planta artificial decorativa para acuario.',                              precio: 6300,  cat: catPlantas.insertId, img: 'planta-sc346.jpeg' },

            // ── ACCESORIOS ────────────────────────────────────────────────────
            { nombre: 'Piedras de Colores',         desc: 'Piedra decorativa de colores para acuarios.',                             precio: 2000,  cat: catAcc.insertId, img: 'piedras-colores.jpeg' },
            { nombre: 'Carbón Activado 50gr',       desc: 'Pellets de carbón activado para mejor absorción de impurezas del agua.',  precio: 2500,  cat: catAcc.insertId, img: 'carbon-50.jpeg' },
            { nombre: 'Carbón Activado 200gr',      desc: 'Pellets de carbón activado para mejor absorción de impurezas del agua.',  precio: 5200,  cat: catAcc.insertId, img: 'carbon-200.jpeg' },
            { nombre: 'Figura Flotante Gato-Luna NH-PVC10', desc: 'Figura flotante decorativa para acuario.',                        precio: 6300,  cat: catAcc.insertId, img: 'figura-gato-luna.jpeg' },
            { nombre: 'Figura Flotante Buzo NH-PVC8', desc: 'Figura flotante decorativa para acuario.',                              precio: 6500,  cat: catAcc.insertId, img: 'figura-buzo.jpeg' },
            { nombre: 'Estructura de Resina',       desc: 'Estructura decorativa de resina estilo ruinas para acuario.',             precio: 17000, cat: catAcc.insertId, img: 'estructura-resina.jpeg' },
            { nombre: 'Piña de Resina',             desc: 'Figura decorativa de resina con forma de piña para acuario.',             precio: 16000, cat: catAcc.insertId, img: 'pina-resina.jpeg' },
            { nombre: 'Caballo de Mar Fluorescente', desc: 'Figura fluorescente adherible mediante chupa para acuario.',             precio: 8000,  cat: catAcc.insertId, img: 'caballo-mar.jpeg' },
            { nombre: 'Aspiradora',                 desc: 'Aspiradora manual para limpieza del sustrato del acuario.',               precio: 11000, cat: catAcc.insertId, img: 'aspiradora.jpeg' },
            { nombre: 'Manguera Siliconada (100m)', desc: 'Manguera siliconada con longitud de 100 metros.',                         precio: 42000, cat: catAcc.insertId, img: 'manguera-siliconada.jpeg' },

            // ── JAULAS PARA HÁMSTER ───────────────────────────────────────────
            { nombre: 'Jaula para Hámster 257',     desc: 'Jaula para hámster 27x20.5x25.5 cm. Colores: azul, verde, rosado, naranja.', precio: 32000, cat: catJaulas.insertId, img: 'jaula-257.jpeg' },
            { nombre: 'Jaula para Hámster S-11',    desc: 'Jaula para hámster 31x24x30 cm. Colores: café, rosado, verde.',          precio: 35000, cat: catJaulas.insertId, img: 'jaula-s11.jpeg' },
            { nombre: 'Jaula para Hámster 268',     desc: 'Jaula para hámster 45x30x15 cm. Colores: azul claro, azul oscuro, amarillo, rosado, gris.', precio: 35000, cat: catJaulas.insertId, img: 'jaula-268.jpeg' },
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