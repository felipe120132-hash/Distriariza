const express = require('express');
const router = express.Router();
const { crearPedido, getPedidos, actualizarEstado, eliminarPedido } = require('../controllers/pedidoController');
const { verifyToken } = require('../middleware/auth');

router.post('/',                crearPedido);
router.get('/',                 verifyToken, getPedidos);
router.put('/:id/estado',       verifyToken, actualizarEstado);
router.delete('/:id',           verifyToken, eliminarPedido);

module.exports = router;