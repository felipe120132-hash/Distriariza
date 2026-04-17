const mysql = require('mysql2'); // <--- ¡ESTA LÍNEA ES LA CLAVE!

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a Aiven:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos de Aiven');
});

module.exports = db;