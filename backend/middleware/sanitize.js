/**
 * Utilidades de sanitización y validación para prevenir XSS e inyecciones.
 */

// Escapa caracteres HTML peligrosos
const escapeHtml = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

// Limpia un string: trim + escape HTML
const sanitizeString = (str, maxLength = 500) => {
    if (typeof str !== 'string') return '';
    return escapeHtml(str.trim().slice(0, maxLength));
};

// Valida que sea un entero positivo
const isPositiveInt = (val) => {
    const n = Number(val);
    return Number.isInteger(n) && n > 0;
};

// Valida que sea un número positivo (permite decimales)
const isPositiveNumber = (val) => {
    const n = Number(val);
    return !isNaN(n) && n > 0;
};

// Valida un teléfono (solo dígitos, +, -, espacios, paréntesis)
const isValidPhone = (phone) => {
    if (typeof phone !== 'string') return false;
    return /^[\d\s\-\+\(\)]{7,20}$/.test(phone.trim());
};

// Lista blanca de estados de pedido
const ESTADOS_VALIDOS = ['pendiente', 'enviado', 'entregado', 'cancelado'];

const isValidEstado = (estado) => ESTADOS_VALIDOS.includes(estado);

module.exports = {
    escapeHtml,
    sanitizeString,
    isPositiveInt,
    isPositiveNumber,
    isValidPhone,
    isValidEstado,
    ESTADOS_VALIDOS
};
