const express = require('express');
const router = express.Router();
const { getImagenes, agregarImagen, eliminarImagen, upload } = require('../controllers/imagenController');
const { verifyToken } = require('../middleware/auth');

router.get('/:id/imagenes', getImagenes);
router.post('/:id/imagenes', verifyToken, upload.single('imagen'), agregarImagen);
router.delete('/imagenes/:imagenId', verifyToken, eliminarImagen);

module.exports = router;