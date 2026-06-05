const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        // Ventas del día (UTC - 5 Colombia aprox, pero usamos la fecha del servidor DB)
        // O más sencillo: CURDATE() asumiendo que el servidor DB está en zona horaria local o usamos lógica Node
        
        // Ventas del Día
        const [ventasDia] = await db.query(`
            SELECT SUM(total) as total_dia 
            FROM pedidos 
            WHERE DATE(creado_en) = CURDATE() AND estado != 'cancelado'
        `);

        // Ventas del Mes
        const [ventasMes] = await db.query(`
            SELECT SUM(total) as total_mes 
            FROM pedidos 
            WHERE MONTH(creado_en) = MONTH(CURDATE()) 
              AND YEAR(creado_en) = YEAR(CURDATE()) 
              AND estado != 'cancelado'
        `);

        // Total pedidos pendientes
        const [pedidosPendientes] = await db.query(`
            SELECT COUNT(*) as pendientes 
            FROM pedidos 
            WHERE estado = 'pendiente'
        `);

        // Para los productos más vendidos, traemos todos los pedidos válidos
        // y agrupamos en Node.js (ya que los items están en JSON)
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

        // Ordenar y tomar los 5 más vendidos
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
