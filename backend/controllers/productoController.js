const db = require('../config/db');

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

        // Filtro por Categoría
        if (categoria_id) {
            query += ' AND p.categoria_id = ?';
            params.push(categoria_id);
        }

        // Lógica de Búsqueda
        if (q) {
            query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm);
        }

        const [rows] = await db.query(query, params);

        // --- INSERCIÓN DE RUTA DINÁMICA DE IMÁGENES ---
        // Esto transforma "foto.jpg" en "http://localhost:5000/productos/foto.jpg"
        const productosConImagenFull = rows.map(p => ({
            ...p,
            imagen_url: p.imagen_url 
                ? `${req.protocol}://${req.get('host')}/productos/${p.imagen_url}` 
                : null
        }));

        res.json(productosConImagenFull);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};
const createProducto = async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== '80153017') return res.status(401).json({ error: 'No autorizado' });

        const { nombre, descripcion, precio, categoria_id, stock } = req.body;
        const imagen_url = req.file ? req.file.filename : null;

        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, activo, stock) VALUES (?, ?, ?, ?, ?, 1, ?)',
            [nombre, descripcion || '', precio, categoria_id, imagen_url, stock || 0]
        );

        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

const updateProducto = async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== '80153017') return res.status(401).json({ error: 'No autorizado' });

        const { id } = req.params;
        const { nombre, descripcion, precio, categoria_id, stock } = req.body;
        
        let query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, stock = ?';
        let params = [nombre, descripcion, precio, categoria_id, stock || 0];

        if (req.file) {
            query += ', imagen_url = ?';
            params.push(req.file.filename);
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
        const password = req.headers['x-admin-password'];
        if (password !== '80153017') return res.status(401).json({ error: 'No autorizado' });

        const { id } = req.params;
        // En lugar de borrar físicamente, podemos ocultarlo (activo = false)
        await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

const descontarStock = async (req, res) => {
    try {
        const { items } = req.body; // [{ id, cantidad }]
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