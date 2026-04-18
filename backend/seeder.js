const db = require('./config/db');

const seedDatabase = async () => {
    try {
        // 1. Limpiar tablas (Opcional, cuidado en producción)
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE productos');
        await db.query('TRUNCATE TABLE categorias');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('--- Tablas limpias ---');
        const [catLiq] = await db.query("INSERT INTO categorias (nombre) VALUES ('Líquidos Vitales')");
        const [catAlim] = await db.query("INSERT INTO categorias (nombre) VALUES ('Alimentos')");
        const [catEq] = await db.query("INSERT INTO categorias (nombre) VALUES ('Equipos')");
        const [catAcc] = await db.query("INSERT INTO categorias (nombre) VALUES ('Accesorios')");
        console.log('--- Categorías creadas ---');

        // 3. Listado de productos del PDF
        const productos = [
            // Líquidos (ID: catLiq.insertId)
            { nombre: 'Acuaprime 30ml', desc: 'Eliminador de cloro y metales pesados.', precio: 0, cat: catLiq.insertId, img: 'acuaprime-30.jpeg' },
            { nombre: 'Acuaprime 120ml', desc: 'Eliminador de cloro y metales pesados.', precio: 0, cat: catLiq.insertId, img: 'acuaprime-120.jpeg' },
            { nombre: 'Cycle 120ml', desc: 'Suplemento biológico para acuarios.', precio: 0, cat: catLiq.insertId, img: 'cycle-120.jpeg' },
            { nombre: 'Test Plus Ultra PH', desc: 'Medidor de PH con mayor precisión.', precio: 0, cat: catLiq.insertId, img: 'test-ph.jpeg' },
            
            // Alimentos (ID: catAlim.insertId)
            { nombre: 'Nutri 5 Pellets', desc: 'Comida para toda clase de peces.', precio: 0, cat: catAlim.insertId, img: 'nutri5-pellets.jpeg' },
            { nombre: 'Betta Pellets 30gr', desc: 'Alimento especializado para Bettas.', precio: 0, cat: catAlim.insertId, img: 'betta.jpeg' },
            { nombre: 'Comida para kois', desc: 'Presentación por libra.', precio: 0, cat: catAlim.insertId, img: 'comida-kois.jpeg' },

            // Equipos (ID: catEq.insertId)
            { nombre: 'Filtro 600L', desc: 'Sistema de filtración interna.', precio: 0, cat: catEq.insertId, img: 'filtro-600.jpeg' },
            { nombre: 'Termostato 100W', desc: 'Regulador de temperatura.', precio: 0, cat: catEq.insertId, img: 'termostato.jpeg' },
            { nombre: 'Comedero Automático', desc: 'Programable digitalmente.', precio: 0, cat: catEq.insertId, img: 'comedero.jpeg' }
        ];

        // 4. Inserción masiva
        const valores = productos.map(p => [p.nombre, p.desc, p.precio, p.cat, p.img]);
        await db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES ?', [valores]);

        console.log('--- ¡Base de datos sembrada con éxito! ---');
        process.exit();
    } catch (error) {
        console.error('Error en el seeder:', error);
        process.exit(1);
    }
};

seedDatabase();