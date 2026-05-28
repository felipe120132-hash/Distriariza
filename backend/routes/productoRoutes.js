const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { upload } = require('../controllers/uploadController'); // ← solo esto cambia
const { verifyToken } = require('../middleware/auth');

// ── Rutas públicas ────────────────────────────────────────────────────────────
router.get('/', productoController.getProductos);
router.post('/descontar-stock', productoController.descontarStock);

// ── Rutas protegidas (requieren JWT) ──────────────────────────────────────────
router.post('/',   verifyToken, upload.single('imagen'), productoController.createProducto);
router.put('/:id', verifyToken, upload.single('imagen'), productoController.updateProducto);
router.delete('/:id', verifyToken, productoController.deleteProducto);

module.exports = router;