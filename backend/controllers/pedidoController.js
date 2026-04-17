// controllers/pedidoController.js
const db = require('../config/db');

const crearPedido = async (req, res) => {
    const { total, items, cliente_nombre } = req.body; 
    // items sería un array de los productos elegidos
    
    try {
        const [result] = await db.query(
            'INSERT INTO pedidos (total_pago, detalles_cliente) VALUES (?, ?)',
            [total, JSON.stringify({ cliente: cliente_nombre, productos: items })]
        );
        
        res.status(201).json({ 
            message: "Pedido registrado", 
            pedidoId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo registrar el pedido' });
    }
};

module.exports = { crearPedido };