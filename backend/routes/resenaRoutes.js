const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

router.get('/', resenaController.getResenas);          // Todas las reseñas
router.get('/:productoId', resenaController.getResenasPorProducto); // Por producto
router.post('/', resenaController.crearResena);         // Crear reseña

module.exports = router;