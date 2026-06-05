const db = require('../config/db');
const { sanitizeString, isPositiveNumber, isPositiveInt, isValidPhone, isValidEstado } = require('../middleware/sanitize');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer (usa variables de entorno o valores por defecto para evitar crashes si no están configuradas)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'felipe120132@gmail.com', // El correo que autoriza el envío
        pass: process.env.EMAIL_PASS || '' // La contraseña de aplicación
    }
});

const crearPedido = async (req, res) => {
    const { cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, total, items } = req.body;

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

    try {
        // Crear el pedido
        const [result] = await db.query(
            `INSERT INTO pedidos 
             (cliente_nombre, cliente_telefono, cliente_direccion, cliente_ciudad, total, items, estado) 
             VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
            [nombreLimpio, telefonoLimpio, direccionLimpia, ciudadLimpia, Number(total), JSON.stringify(items)]
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

        // Enviar notificación por correo
        if (process.env.EMAIL_PASS) {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'felipe120132@gmail.com',
                to: 'felipe120132@gmail.com', // Correo destino del admin
                subject: `🛒 Nuevo pedido #${result.insertId} de ${nombreLimpio}`,
                html: `
                    <h2>¡Tienes un nuevo pedido!</h2>
                    <p><strong>Cliente:</strong> ${nombreLimpio}</p>
                    <p><strong>Teléfono:</strong> ${telefonoLimpio}</p>
                    <p><strong>Ciudad:</strong> ${ciudadLimpia}</p>
                    <p><strong>Total:</strong> $${Number(total).toLocaleString('es-CO')}</p>
                    <hr/>
                    <p><a href="https://distriariza.vercel.app/admin">Ingresa al Panel Admin</a> para ver los detalles y actualizar el estado.</p>
                `
            };
            transporter.sendMail(mailOptions).catch(err => console.error('Error enviando correo:', err));
        }

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
        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, Number(id)]);
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