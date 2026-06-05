const db = require('../config/db');

const crearPedido = async (req, res) => {
    const { cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, total, items } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO pedidos 
             (cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, total, items, estado) 
             VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
            [cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, total, JSON.stringify(items)]
        );
        res.status(201).json({ message: 'Pedido registrado', pedidoId: result.insertId });
    } catch (error) {
        console.error(error);
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
    try {
        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
        res.json({ message: 'Estado actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

const eliminarPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT id FROM pedidos WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        await db.query('DELETE FROM pedidos WHERE id = ?', [id]);
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};

module.exports = { crearPedido, getPedidos, actualizarEstado, eliminarPedido };