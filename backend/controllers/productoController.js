const db = require('../config/db');
const { cloudinary } = require('./uploadController');
const { sanitizeString, isPositiveInt, isPositiveNumber } = require('../middleware/sanitize');

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
            if (!isPositiveInt(categoria_id)) {
                return res.status(400).json({ error: 'ID de categoría inválido.' });
            }
            query += ' AND p.categoria_id = ?';
            params.push(Number(categoria_id));
        }
        if (q) {
            const busqueda = sanitizeString(q, 100);
            query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
            params.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria_id, stock } = req.body;

        // Validaciones
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
            return res.status(400).json({ error: 'El nombre es requerido (mínimo 2 caracteres).' });
        }
        if (!precio || !isPositiveNumber(precio)) {
            return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
        }
        if (!categoria_id || !isPositiveInt(categoria_id)) {
            return res.status(400).json({ error: 'Categoría inválida.' });
        }

        const imagen_url = req.file ? req.file.path : null;
        const stockValue = stock && isPositiveInt(stock) ? Number(stock) : 1000;

        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, activo, stock) VALUES (?, ?, ?, ?, ?, 1, ?)',
            [sanitizeString(nombre, 255), sanitizeString(descripcion || '', 2000), Number(precio), Number(categoria_id), imagen_url, stockValue]
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

        if (!isPositiveInt(id)) {
            return res.status(400).json({ error: 'ID de producto inválido.' });
        }

        let query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, stock = ?';
        let params = [
            sanitizeString(nombre, 255),
            sanitizeString(descripcion, 2000),
            Number(precio),
            Number(categoria_id),
            Number(stock) >= 0 ? Number(stock) : 0
        ];

        if (req.file) {
            const [rows] = await db.query('SELECT imagen_url FROM productos WHERE id = ?', [Number(id)]);
            const urlVieja = rows[0]?.imagen_url;
            if (urlVieja && urlVieja.includes('cloudinary')) {
                const partes = urlVieja.split('/');
                const archivoConExt = partes[partes.length - 1];
                const publicId = `distriariza/productos/${archivoConExt.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            }
            query += ', imagen_url = ?';
            params.push(req.file.path);
        }

        query += ' WHERE id = ?';
        params.push(Number(id));

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
        if (!isPositiveInt(id)) {
            return res.status(400).json({ error: 'ID de producto inválido.' });
        }
        await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [Number(id)]);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = { getProductos, createProducto, updateProducto, deleteProducto };