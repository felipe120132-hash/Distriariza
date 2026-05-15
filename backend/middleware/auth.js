const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el token JWT en el header Authorization.
 * Uso: router.post('/ruta-protegida', verifyToken, controlador);
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Acceso denegado. No se proporcionó token de autenticación.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminUser = decoded; // Adjuntar datos del token al request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Sesión expirada. Por favor inicia sesión nuevamente.',
                code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(401).json({ 
            error: 'Token inválido. Acceso denegado.',
            code: 'TOKEN_INVALID'
        });
    }
};

module.exports = { verifyToken };
