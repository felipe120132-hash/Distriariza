require('dotenv').config();
const db = require('./config/db');

async function runMigration() {
    try {
        console.log('Running migration: Add orden to productos');
        const [rows] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'productos' 
              AND COLUMN_NAME = 'orden'
        `);

        if (rows.length === 0) {
            await db.query('ALTER TABLE productos ADD COLUMN orden INT NOT NULL DEFAULT 0 AFTER stock');
            console.log('✅ Column orden added successfully.');
        } else {
            console.log('⚠️ Column orden already exists. Skipping.');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

runMigration();
