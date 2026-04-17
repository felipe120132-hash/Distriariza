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

module.exports = { getProductos };