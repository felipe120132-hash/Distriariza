const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// ── Rate limiter para el login ────────────────────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: (parseInt(process.env.LOGIN_LOCKOUT_MINUTES) || 15) * 60 * 1000,
    max: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    message: {
        error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
        code: 'RATE_LIMITED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                error: 'La contraseña es requerida.' 
            });
        }

        // Comparar contra el hash almacenado en la variable de entorno
        const hashAlmacenado = process.env.ADMIN_PASSWORD_HASH;

        if (!hashAlmacenado) {
            console.error('❌ ADMIN_PASSWORD_HASH no está configurado en .env');
            return res.status(500).json({ 
                error: 'Error de configuración del servidor.' 
            });
        }

        const coincide = await bcrypt.compare(password, hashAlmacenado);

        if (!coincide) {
            return res.status(401).json({ 
                error: 'Contraseña incorrecta.',
                code: 'INVALID_PASSWORD'
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { role: 'admin', loginAt: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        res.json({
            message: 'Autenticación exitosa',
            token,
            expiresIn: process.env.JWT_EXPIRES_IN || '2h'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ── GET /api/auth/verify — Verificar si un token sigue válido ─────────────────
router.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
    }

    try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
