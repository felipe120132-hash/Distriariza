const db = require('../config/db');
const { cloudinary } = require('./uploadController');

const getProductos = async (req, res) => {
    try {
        const { categoria_id, q } = req.query;

        let query = `
            SELECT p.*, c.nombre AS categoria_nombre 
            FROM productos p 
            INNER JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.activo = TRUE
        `;
        let params = [];

        if (categoria_id) {
            query += ' AND p.categoria_id = ?';
            params.push(categoria_id);
        }
        if (q) {
            query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }

        const [rows] = await db.query(query, params);

        // ── La imagen_url ya es una URL completa de Cloudinary, no la transformamos ──
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria_id, stock } = req.body;

        // req.file.path = URL completa de Cloudinary (ej: https://res.cloudinary.com/...)
        const imagen_url = req.file ? req.file.path : null;

        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, activo, stock) VALUES (?, ?, ?, ?, ?, 1, ?)',
            [nombre, descripcion || '', precio, categoria_id, imagen_url, stock || 1000]
        );

        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoria_id, stock } = req.body;

        let query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, stock = ?';
        let params = [nombre, descripcion, precio, categoria_id, stock || 0];

        if (req.file) {
            // Si subió imagen nueva, borrar la vieja de Cloudinary
            const [rows] = await db.query('SELECT imagen_url FROM productos WHERE id = ?', [id]);
            const urlVieja = rows[0]?.imagen_url;
            if (urlVieja && urlVieja.includes('cloudinary')) {
                const partes = urlVieja.split('/');
                const archivoConExt = partes[partes.length - 1];
                const publicId = `distriariza/productos/${archivoConExt.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            }
            query += ', imagen_url = ?';
            params.push(req.file.path); // URL completa de Cloudinary
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

const descontarStock = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: 'No se enviaron productos' });

        await Promise.all(
            items.map(({ id, cantidad }) =>
                db.query(
                    'UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
                    [cantidad, id]
                )
            )
        );

        res.json({ message: 'Stock actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el stock' });
    }
};

module.exports = { getProductos, createProducto, updateProducto, deleteProducto, descontarStock };