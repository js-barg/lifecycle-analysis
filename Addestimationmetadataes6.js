/**
 * Database Migration: Add estimation_metadata column
 * ES Module version for projects using "type": "module"
 * Run this script to add the column needed for date estimation tracking
 */

import pkg from 'pg';
const { Pool } = pkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read database configuration
let dbConfig;
try {
  // Try to import your existing database configuration
  const configPath = join(__dirname, 'config.js');
  const { default: config } = await import(configPath);
  dbConfig = config;
} catch (error) {
  console.log('Could not load config.js, using environment variables or defaults');
  
  // Fallback to environment variables or defaults
  dbConfig = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'lifecycle_planning',
    DB_USER: process.env.DB_USER || 'jareth1988',
    DB_PASSWORD: process.env.DB_PASSWORD || 'your_password'
  };
}

// Create pool with your database configuration
const pool = new Pool({
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  database: dbConfig.DB_NAME,
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
});

async function addEstimationMetadataColumn() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Adding estimation_metadata column to phase3_analysis table...');
    console.log(`📍 Connected to database: ${dbConfig.DB_NAME}`);
    
    // Check if column already exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'phase3_analysis' 
      AND column_name = 'estimation_metadata'
    `;
    
    const checkResult = await client.query(checkQuery);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Column estimation_metadata already exists');
      return;
    }
    
    // Add the column
    const alterQuery = `
      ALTER TABLE phase3_analysis 
      ADD COLUMN estimation_metadata JSONB
    `;
    
    await client.query(alterQuery);
    console.log('✅ Successfully added estimation_metadata column');
    
    // Verify the column was added
    const verifyQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'phase3_analysis' 
      AND column_name = 'estimation_metadata'
    `;
    
    const verifyResult = await client.query(verifyQuery);
    
    if (verifyResult.rows.length > 0) {
      console.log('✅ Verified column creation:', verifyResult.rows[0]);
    } else {
      console.error('❌ Column was not created successfully');
    }
    
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    
    // Provide helpful error messages
    if (error.code === '42P01') {
      console.error('⚠️  Table phase3_analysis does not exist. Make sure you have run all previous migrations.');
    } else if (error.code === '28P01' || error.code === '28000') {
      console.error('⚠️  Authentication failed. Check your database credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('⚠️  Could not connect to database. Is PostgreSQL running?');
    }
    
    throw error;
  } finally {
    client.release();
    await pool.end();
    console.log('📊 Database migration complete');
  }
}

// Run the migration
console.log('🚀 Starting database migration...');
console.log('📝 Database configuration:');
console.log(`   Host: ${dbConfig.DB_HOST}`);
console.log(`   Port: ${dbConfig.DB_PORT}`);
console.log(`   Database: ${dbConfig.DB_NAME}`);
console.log(`   User: ${dbConfig.DB_USER}`);
console.log('');

addEstimationMetadataColumn()
  .then(() => {
    console.log('✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });