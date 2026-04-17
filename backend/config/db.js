// Así debe quedar tu conexión en VS Code
const db = mysql.createConnection({
  host: "mysql-14c7894e-distriariza.d.aivencloud.com",
  port: 28140,
  user: "avnadmin",
  password: "AVNS_EbW_oAxV0nWCU-TNYKW", // La que copiaste de la web
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones externas
  }
});