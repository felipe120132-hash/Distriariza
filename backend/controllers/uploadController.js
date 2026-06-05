const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          'distriariza/productos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation:  [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        if (fileTypes.test(file.mimetype)) return cb(null, true);
        cb(new Error('El archivo debe ser una imagen válida (jpg, png, webp).'));
    }
});

module.exports = { upload, cloudinary };