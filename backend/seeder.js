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