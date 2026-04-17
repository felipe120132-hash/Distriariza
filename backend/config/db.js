const mysql = require('mysql2/promise'); // <--- Cambio realizado

// Usamos createPool en lugar de createConnection para mejor estabilidad en Render
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// En la versión de promesas, no es necesario el db.connect con callback.
// El pool manejará la conexión automáticamente.
console.log('Configuración de base de datos cargada con soporte para Promesas');

module.exports = db;