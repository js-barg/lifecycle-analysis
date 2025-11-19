const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:yourpassword@localhost:5432/lifecycle_analysis'
});

async function fixDatabase() {
  try {
    await pool.query(`
      ALTER TABLE phase3_jobs 
      ADD COLUMN IF NOT EXISTS filter_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS filtered_count INTEGER,
      ADD COLUMN IF NOT EXISTS original_count INTEGER
    `);
    console.log('Database schema updated successfully!');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await pool.end();
  }
}

fixDatabase();