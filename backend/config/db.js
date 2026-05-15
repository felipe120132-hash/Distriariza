const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-14c7894e-distriariza.d.aivencloud.com',
  port: parseInt(process.env.DB_PORT) || 28140,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'AVNS_EbW_oAxV0nWCU-TNYKW',
  database: process.env.DB_NAME || 'defaultdb',
  ssl: {
    // Esto evita el HANDSHAKE_SSL_ERROR al no validar certificados locales
    rejectUnauthorized: false,
    // Forzamos el protocolo TLS que Aiven exige
    minVersion: 'TLSv1.2'
  },
  // Configuraciones de estabilidad para conexiones a la nube
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Aumentado a 20s para evitar el ECONNRESET inicial
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

module.exports = pool;