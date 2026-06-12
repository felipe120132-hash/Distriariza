const db = require('../config/db');
const { sanitizeString, isPositiveNumber, isPositiveInt, isValidPhone, isValidEstado } = require('../middleware/sanitize');
// Email logic has been removed as per user request

const crearPedido = async (req, res) => {
    const { cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, cliente_email, total, items } = req.body;

    // ── Validación de campos ──────────────────────────────────────────────────
    if (!cliente_nombre || typeof cliente_nombre !== 'string' || cliente_nombre.trim().length < 2) {
        return res.status(400).json({ error: 'El nombre del cliente es requerido (mínimo 2 caracteres).' });
    }
    if (!cliente_telefono || !isValidPhone(cliente_telefono)) {
        return res.status(400).json({ error: 'Teléfono inválido.' });
    }
    if (!cliente_ciudad || typeof cliente_ciudad !== 'string' || cliente_ciudad.trim().length < 2) {
        return res.status(400).json({ error: 'La ciudad es requerida.' });
    }
    if (!total || !isPositiveNumber(total)) {
        return res.status(400).json({ error: 'El total debe ser un número positivo.' });
    }
    if (!cliente_email || typeof cliente_email !== 'string' || !/^\S+@\S+\.\S+$/.test(cliente_email)) {
        return res.status(400).json({ error: 'Se requiere un correo electrónico válido.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'El pedido debe contener al menos un producto.' });
    }

    // Validar estructura de cada item
    for (const item of items) {
        if (!item.id || !isPositiveInt(item.id)) {
            return res.status(400).json({ error: 'Cada item debe tener un ID válido.' });
        }
        if (!item.cantidad || !isPositiveInt(item.cantidad) || item.cantidad > 999) {
            return res.status(400).json({ error: 'Cada item debe tener una cantidad válida (1-999).' });
        }
    }

    // ── Sanitizar campos de texto ──────────────────────────────────────────────
    const nombreLimpio    = sanitizeString(cliente_nombre, 100);
    const telefonoLimpio  = sanitizeString(cliente_telefono, 20);
    const direccionLimpia = sanitizeString(cliente_direccion || '', 200);
    const ciudadLimpia    = sanitizeString(cliente_ciudad, 100);
    const emailLimpio     = sanitizeString(cliente_email, 100);

    try {
        // Crear el pedido
        const [result] = await db.query(
            `INSERT INTO pedidos 
             (cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, cliente_email, total, items, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            [nombreLimpio, telefonoLimpio, direccionLimpia, ciudadLimpia, emailLimpio, Number(total), JSON.stringify(items)]
        );

        // Descontar stock automáticamente
        await Promise.all(
            items.map(({ id, cantidad }) =>
                db.query(
                    'UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
                    [Number(cantidad), Number(id)]
                )
            )
        );

        // Notificaciones por correo desactivadas por solicitud del usuario.

        res.status(201).json({ message: 'Pedido registrado', pedidoId: result.insertId });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ error: 'No se pudo registrar el pedido' });
    }
};

const getPedidos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos ORDER BY creado_en DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

const actualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar ID
    if (!isPositiveInt(id)) {
        return res.status(400).json({ error: 'ID de pedido inválido.' });
    }

    // Validar estado contra lista blanca
    if (!isValidEstado(estado)) {
        return res.status(400).json({ error: 'Estado inválido. Valores permitidos: pendiente, enviado, entregado, cancelado.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [Number(id)]);
        if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        
        const pedido = rows[0];

        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, Number(id)]);
        
        // Notificaciones por correo desactivadas

        res.json({ message: 'Estado actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

const eliminarPedido = async (req, res) => {
    const { id } = req.params;

    if (!isPositiveInt(id)) {
        return res.status(400).json({ error: 'ID de pedido inválido.' });
    }

    try {
        const [rows] = await db.query('SELECT id FROM pedidos WHERE id = ?', [Number(id)]);
        if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        await db.query('DELETE FROM pedidos WHERE id = ?', [Number(id)]);
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};

module.exports = { crearPedido, getPedidos, actualizarEstado, eliminarPedido };