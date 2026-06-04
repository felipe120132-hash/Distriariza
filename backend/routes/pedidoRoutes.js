const express = require('express');
const router = express.Router();
const { crearPedido, getPedidos, actualizarEstado } = require('../controllers/pedidoController');
const { verifyToken } = require('../middleware/auth');

router.post('/', crearPedido);
router.get('/', verifyToken, getPedidos);
router.put('/:id/estado', verifyToken, actualizarEstado);

module.exports = router;