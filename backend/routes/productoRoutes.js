const express = require('express'); // 1. Importar express
const router = express.Router();    // 2. Inicializar el router
const productoController = require('../controllers/productoController');
const upload = require('../controllers/uploadController'); // Si estás usando subida de imágenes
const { verifyToken } = require('../middleware/auth');      // Middleware JWT

// ── Rutas públicas ────────────────────────────────────────────────────────────
router.get('/', productoController.getProductos);
router.post('/descontar-stock', productoController.descontarStock);

// ── Rutas protegidas (requieren JWT) ──────────────────────────────────────────
router.post('/', verifyToken, upload.single('imagen'), productoController.createProducto);
router.put('/:id', verifyToken, upload.single('imagen'), productoController.updateProducto);
router.delete('/:id', verifyToken, productoController.deleteProducto);

// Asegúrate de que esta línea esté al final del archivo:
module.exports = router;