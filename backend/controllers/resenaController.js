const db = require('../config/db');

// GET /api/resenas — todas las reseñas
exports.getResenas = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM resenas ORDER BY creado_en DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/resenas/:productoId — reseñas de un producto
exports.getResenasPorProducto = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM resenas WHERE producto_id = ? ORDER BY creado_en DESC',
            [req.params.productoId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/resenas — crear una reseña
exports.crearResena = async (req, res) => {
    const { producto_id, producto_nombre, autor, calificacion, comentario } = req.body;

    if (!producto_id || !autor || !calificacion || !comentario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO resenas (producto_id, producto_nombre, autor, calificacion, comentario) VALUES (?, ?, ?, ?, ?)',
            [producto_id, producto_nombre, autor, calificacion, comentario]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Reseña guardada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};