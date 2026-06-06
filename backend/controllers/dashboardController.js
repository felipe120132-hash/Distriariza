const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        // Ventas del Día (hora Colombia UTC-5)
        const [ventasDia] = await db.query(`
            SELECT SUM(total) as total_dia 
            FROM pedidos 
            WHERE DATE(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = DATE(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND estado != 'cancelado'
        `);

        // Ventas del Mes (hora Colombia UTC-5)
        const [ventasMes] = await db.query(`
            SELECT SUM(total) as total_mes 
            FROM pedidos 
            WHERE MONTH(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND YEAR(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND estado != 'cancelado'
        `);

        // Total pedidos pendientes
        const [pedidosPendientes] = await db.query(`
            SELECT COUNT(*) as pendientes 
            FROM pedidos 
            WHERE estado = 'pendiente'
        `);

        // Productos más vendidos
        const [pedidos] = await db.query(`
            SELECT items 
            FROM pedidos 
            WHERE estado != 'cancelado'
        `);

        const contadorProductos = {};

        pedidos.forEach(pedido => {
            let items = [];
            try {
                items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : pedido.items;
            } catch (e) {
                return;
            }
            items.forEach(item => {
                if (!contadorProductos[item.id]) {
                    contadorProductos[item.id] = { id: item.id, nombre: item.nombre, cantidad_vendida: 0 };
                }
                contadorProductos[item.id].cantidad_vendida += Number(item.cantidad);
            });
        });

        const productosMasVendidos = Object.values(contadorProductos)
            .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
            .slice(0, 5);

        res.json({
            ventas_dia: ventasDia[0].total_dia || 0,
            ventas_mes: ventasMes[0].total_mes || 0,
            pedidos_pendientes: pedidosPendientes[0].pendientes || 0,
            productos_top: productosMasVendidos
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
};