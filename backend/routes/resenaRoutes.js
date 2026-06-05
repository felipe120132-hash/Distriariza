const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const resenaController = require('../controllers/resenaController');

// Rate limiter para creación de reseñas (máx 5 por hora por IP)
const resenaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiadas reseñas enviadas. Intenta de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', resenaController.getResenas);
router.get('/:productoId', resenaController.getResenasPorProducto);
router.post('/', resenaLimiter, resenaController.crearResena);

module.exports = router;