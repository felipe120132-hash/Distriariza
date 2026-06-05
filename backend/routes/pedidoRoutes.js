const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { crearPedido, getPedidos, actualizarEstado, eliminarPedido } = require('../controllers/pedidoController');
const { verifyToken } = require('../middleware/auth');

// Rate limiter para creación de pedidos (máx 10 por hora por IP)
const pedidoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados pedidos enviados. Intenta de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/',                pedidoLimiter, crearPedido);
router.get('/',                 verifyToken, getPedidos);
router.put('/:id/estado',       verifyToken, actualizarEstado);
router.delete('/:id',           verifyToken, eliminarPedido);

module.exports = router;