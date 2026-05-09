const express = require('express'); // 1. Importar express
const router = express.Router();    // 2. Inicializar el router
const productoController = require('../controllers/productoController');
const upload = require('../controllers/uploadController'); // Si estás usando subida de imágenes

// ... aquí van tus rutas: router.get, router.post, etc. ...
router.get('/', productoController.getProductos);
router.post('/', upload.single('imagen'), productoController.createProducto);
router.put('/:id', upload.single('imagen'), productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);
router.post('/descontar-stock', productoController.descontarStock);

// Asegúrate de que esta línea esté al final del archivo:
module.exports = router;