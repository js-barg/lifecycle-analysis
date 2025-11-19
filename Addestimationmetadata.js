/**
 * Database Migration: Add estimation_metadata column
 * Run this script to add the column needed for date estimation tracking
 */

const pool = require('./database/dbConnection');

async function addEstimationMetadataColumn() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Adding estimation_metadata column to phase3_analysis table...');
    
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
    console.error('❌ Error adding column:', error);
    throw error;
  } finally {
    client.release();
    console.log('📊 Database migration complete');
    process.exit(0);
  }
}

// Run the migration
console.log('🚀 Starting database migration...');
addEstimationMetadataColumn().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});