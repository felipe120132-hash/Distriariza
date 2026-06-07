const db = require('../config/db');
const { cloudinary } = require('./uploadController');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'distriariza/productos', allowed_formats: ['jpg','jpeg','png','webp'] },
});
const upload = multer({ storage });

const getImagenes = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;
  try {
    const imagen_url = req.file.path;
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM producto_imagenes WHERE producto_id = ?', [id]
    );
    const orden = rows[0].total;
    await db.query(
      'INSERT INTO producto_imagenes (producto_id, imagen_url, orden) VALUES (?, ?, ?)',
      [id, imagen_url, orden]
    );
    res.status(201).json({ message: 'Imagen agregada', imagen_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar imagen' });
  }
};

const eliminarImagen = async (req, res) => {
  const { imagenId } = req.params;
  try {
    const [rows] = await db.query('SELECT imagen_url FROM producto_imagenes WHERE id = ?', [imagenId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Imagen no encontrada' });

    const url = rows[0].imagen_url;
    if (url.includes('cloudinary')) {
      const partes = url.split('/');
      const archivo = partes[partes.length - 1].split('.')[0];
      await cloudinary.uploader.destroy(`distriariza/productos/${archivo}`);
    }

    await db.query('DELETE FROM producto_imagenes WHERE id = ?', [imagenId]);
    res.json({ message: 'Imagen eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};

module.exports = { getImagenes, agregarImagen, eliminarImagen, upload };