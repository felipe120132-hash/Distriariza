const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'mysql-14c7894e-distriariza.d.aivencloud.com',
  port: 28140,
  user: 'avnadmin',
  password: 'AVNS_EbW_oAxV0nWCU-TNYKW',
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false // Obligatorio para Aiven
  }
});

module.exports = db;