const db = require('../config/db');
const { sanitizeString, isPositiveNumber, isPositiveInt, isValidPhone, isValidEstado } = require('../middleware/sanitize');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer (usa variables de entorno o valores por defecto para evitar crashes si no están configuradas)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'felipe120132@gmail.com',
        pass: process.env.EMAIL_PASS || ''
    }
});

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

        // Enviar notificación por correo
        if (process.env.EMAIL_PASS) {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'felipe120132@gmail.com';
            
            // 1. Correo para el Admin
            const mailAdminOptions = {
                from: process.env.EMAIL_USER || 'felipe120132@gmail.com',
                to: adminEmail,
                subject: `🛒 Nuevo pedido #${result.insertId} de ${nombreLimpio}`,
                html: `
                    <h2>¡Tienes un nuevo pedido!</h2>
                    <p><strong>Cliente:</strong> ${nombreLimpio}</p>
                    <p><strong>Teléfono:</strong> ${telefonoLimpio}</p>
                    <p><strong>Email:</strong> ${emailLimpio}</p>
                    <p><strong>Ciudad:</strong> ${ciudadLimpia}</p>
                    <p><strong>Total:</strong> $${Number(total).toLocaleString('es-CO')}</p>
                    <hr/>
                    <p><a href="https://distriariza.vercel.app/admin">Ingresa al Panel Admin</a> para ver los detalles y actualizar el estado.</p>
                `
            };

            // 2. Correo para el Cliente
            const mailClienteOptions = {
                from: process.env.EMAIL_USER || 'felipe120132@gmail.com',
                to: emailLimpio,
                subject: `Confirmación de pedido #${result.insertId} - Distriariza`,
                html: `
                    <h2>¡Gracias por tu compra, ${nombreLimpio}!</h2>
                    <p>Hemos recibido tu pedido correctamente. Nos pondremos en contacto contigo pronto por WhatsApp para coordinar el envío.</p>
                    <h3>Resumen de tu pedido:</h3>
                    <ul>
                        ${items.map(i => `<li>${i.cantidad}x ${i.nombre} - $${(i.precio * i.cantidad).toLocaleString('es-CO')}</li>`).join('')}
                    </ul>
                    <p><strong>Total pagado:</strong> $${Number(total).toLocaleString('es-CO')}</p>
                    <p><strong>Dirección de entrega:</strong> ${direccionLimpia}, ${ciudadLimpia}</p>
                    <hr/>
                    <p>El equipo de Distriariza</p>
                `
            };

            transporter.sendMail(mailAdminOptions).catch(err => console.error('Error enviando correo a admin:', err));
            transporter.sendMail(mailClienteOptions).catch(err => console.error('Error enviando correo a cliente:', err));
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
        const [rows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [Number(id)]);
        if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        
        const pedido = rows[0];

        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, Number(id)]);
        
        // Notificar al cliente sobre el cambio de estado
        if (process.env.EMAIL_PASS && pedido.cliente_email) {
            const estadoNombres = {
                'pendiente': 'Pendiente',
                'enviado': 'Enviado 🚚',
                'entregado': 'Entregado ✅',
                'cancelado': 'Cancelado ❌'
            };
            
            const mailStatusOptions = {
                from: process.env.EMAIL_USER || 'felipe120132@gmail.com',
                to: pedido.cliente_email,
                subject: `Actualización de tu pedido #${id} - Distriariza`,
                html: `
                    <h2>Hola ${pedido.cliente_nombre},</h2>
                    <p>El estado de tu pedido <strong>#${id}</strong> ha sido actualizado a: <strong>${estadoNombres[estado] || estado}</strong>.</p>
                    ${estado === 'enviado' ? '<p>Tu pedido va en camino. Pronto lo recibirás.</p>' : ''}
                    <hr/>
                    <p>El equipo de Distriariza</p>
                `
            };
            transporter.sendMail(mailStatusOptions).catch(err => console.error('Error enviando correo de estado:', err));
        }

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