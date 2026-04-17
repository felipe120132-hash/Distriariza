const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/productos'); // Carpeta donde se guardan
    },
    filename: (req, file, cb) => {
        // Nombre único: id_producto + fecha + extensión original
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype) return cb(null, true);
        cb("Error: El archivo debe ser una imagen válida");
    }
});

module.exports = upload;