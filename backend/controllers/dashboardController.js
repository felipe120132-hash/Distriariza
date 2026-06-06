const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [ventasDia] = await db.query(`
            SELECT SUM(total) as total_dia 
            FROM pedidos 
            WHERE DATE(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = DATE(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND estado != 'cancelado'
        `);

        const [ventasAyer] = await db.query(`
            SELECT SUM(total) as total_ayer 
            FROM pedidos 
            WHERE DATE(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = DATE(CONVERT_TZ(NOW(), '+00:00', '-05:00')) - INTERVAL 1 DAY
            AND estado != 'cancelado'
        `);

        const [ventasMes] = await db.query(`
            SELECT SUM(total) as total_mes 
            FROM pedidos 
            WHERE MONTH(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND YEAR(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-05:00'))
            AND estado != 'cancelado'
        `);

        const [ventasMesAnterior] = await db.query(`
            SELECT SUM(total) as total_mes_anterior 
            FROM pedidos 
            WHERE MONTH(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = MONTH(DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '-05:00'), INTERVAL 1 MONTH))
            AND YEAR(CONVERT_TZ(creado_en, '+00:00', '-05:00')) = YEAR(DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '-05:00'), INTERVAL 1 MONTH))
            AND estado != 'cancelado'
        `);

        const [pedidosPendientes] = await db.query(`
            SELECT COUNT(*) as pendientes 
            FROM pedidos 
            WHERE estado = 'pendiente'
        `);

        const [pedidos] = await db.query(`
            SELECT items FROM pedidos WHERE estado != 'cancelado'
        `);

        const contadorProductos = {};
        pedidos.forEach(pedido => {
            let items = [];
            try {
                items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : pedido.items;
            } catch (e) { return; }
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

        const totalDia = ventasDia[0].total_dia || 0;
        const totalAyer = ventasAyer[0].total_ayer || 0;
        const totalMes = ventasMes[0].total_mes || 0;
        const totalMesAnterior = ventasMesAnterior[0].total_mes_anterior || 0;

        const variacionDia = totalAyer > 0
            ? Math.round(((totalDia - totalAyer) / totalAyer) * 100)
            : null;

        const variacionMes = totalMesAnterior > 0
            ? Math.round(((totalMes - totalMesAnterior) / totalMesAnterior) * 100)
            : null;

        res.json({
            ventas_dia: totalDia,
            ventas_ayer: totalAyer,
            variacion_dia: variacionDia,
            ventas_mes: totalMes,
            ventas_mes_anterior: totalMesAnterior,
            variacion_mes: variacionMes,
            pedidos_pendientes: pedidosPendientes[0].pendientes || 0,
            productos_top: productosMasVendidos
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
};