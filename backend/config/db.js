const mysql = require('mysql2/promise');

// ── Validar que las variables de entorno están configuradas ────────────────────
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    console.error(`❌ Faltan variables de entorno de base de datos: ${missing.join(', ')}`);
    console.error('   Asegúrate de tener un archivo .env correctamente configurado.');
    process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

module.exports = pool;