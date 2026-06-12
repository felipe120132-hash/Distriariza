require('dotenv').config();
const db = require('./config/db');

async function runMigration() {
    try {
        console.log('Running migration: Add cliente_email to pedidos');
        // Check if column exists to avoid errors on multiple runs
        const [rows] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'pedidos' 
              AND COLUMN_NAME = 'cliente_email'
        `);

        if (rows.length === 0) {
            await db.query('ALTER TABLE pedidos ADD COLUMN cliente_email VARCHAR(100) NULL AFTER cliente_ciudad');
            console.log('✅ Column cliente_email added successfully.');
        } else {
            console.log('⚠️ Column cliente_email already exists. Skipping.');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

runMigration();
