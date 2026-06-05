const db = require('../config/db');
const { sanitizeString, isPositiveInt } = require('../middleware/sanitize');

// GET /api/resenas — todas las reseñas
exports.getResenas = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM resenas ORDER BY creado_en DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
};

// GET /api/resenas/:productoId — reseñas de un producto
exports.getResenasPorProducto = async (req, res) => {
    const { productoId } = req.params;

    if (!isPositiveInt(productoId)) {
        return res.status(400).json({ error: 'ID de producto inválido.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM resenas WHERE producto_id = ? ORDER BY creado_en DESC',
            [Number(productoId)]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reseñas por producto:', error);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
};

// POST /api/resenas — crear una reseña
exports.crearResena = async (req, res) => {
    const { producto_id, producto_nombre, autor, calificacion, comentario } = req.body;

    // ── Validaciones ──────────────────────────────────────────────────────────
    if (!producto_id || !isPositiveInt(producto_id)) {
        return res.status(400).json({ error: 'ID de producto inválido.' });
    }
    if (!autor || typeof autor !== 'string' || autor.trim().length < 2 || autor.trim().length > 100) {
        return res.status(400).json({ error: 'El nombre del autor es requerido (2-100 caracteres).' });
    }
    if (!calificacion || !Number.isInteger(Number(calificacion)) || Number(calificacion) < 1 || Number(calificacion) > 5) {
        return res.status(400).json({ error: 'La calificación debe ser un entero entre 1 y 5.' });
    }
    if (!comentario || typeof comentario !== 'string' || comentario.trim().length < 10 || comentario.trim().length > 1000) {
        return res.status(400).json({ error: 'El comentario es requerido (10-1000 caracteres).' });
    }

    // ── Sanitizar ─────────────────────────────────────────────────────────────
    const autorLimpio      = sanitizeString(autor, 100);
    const comentarioLimpio = sanitizeString(comentario, 1000);
    const productoNombre   = sanitizeString(producto_nombre || 'Producto general', 255);

    try {
        const [result] = await db.query(
            'INSERT INTO resenas (producto_id, producto_nombre, autor, calificacion, comentario) VALUES (?, ?, ?, ?, ?)',
            [Number(producto_id), productoNombre, autorLimpio, Number(calificacion), comentarioLimpio]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Reseña guardada' });
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error al guardar la reseña' });
    }
};