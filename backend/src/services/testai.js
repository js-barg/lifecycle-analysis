/**
 * Simple Test for Google AI Research Service - MR33-HW
 * Uses only the public performResearch() method
 */

const GoogleAIResearchService = require('./googleAIResearchService');
require('dotenv').config();

console.log('🚀 Testing Google AI Research Service for MR33-HW');
console.log('═'.repeat(80));

// Test product: MR33-HW
const testProduct = {
  product_id: 'MR33-HW',
  manufacturer: 'Cisco Meraki',
  description: 'Meraki MR33 Wireless Access Point'
};

console.log(`\n📦 Testing Product: ${testProduct.product_id}`);
console.log(`   Manufacturer: ${testProduct.manufacturer}`);
console.log(`\n📊 Expected Results (from manual Google search):`);
console.log(`   • End-of-Sale: July 14, 2022`);
console.log(`   • End-of-Support: July 21, 2026`);
console.log(`   • Source: documentation.meraki.com`);
console.log('\n' + '═'.repeat(80));

async function runTest() {
  try {
    // Check if API is configured
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || apiKey === 'your_google_api_key_here' || 
        !searchEngineId || searchEngineId === 'your_search_engine_id_here') {
      console.log('\n⚠️  Google API Not Configured\n');
      console.log('To enable live testing:');
      console.log('1. Get a Google Custom Search API key');
      console.log('2. Create a Custom Search Engine ID');
      console.log('3. Add to your .env file:');
      console.log('   GOOGLE_API_KEY=your_actual_key');
      console.log('   GOOGLE_SEARCH_ENGINE_ID=your_actual_id');
      console.log('\n' + '═'.repeat(80));
    } else {
      console.log('\n✅ Google API configured - performing live search...\n');
    }
    
    // Perform the research
    console.log('🔍 Calling performResearch() for MR33-HW...\n');
    const startTime = Date.now();
    
    const results = await GoogleAIResearchService.performResearch(testProduct);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Completed in ${duration} seconds\n`);
    
    // Display results
    console.log('📋 Results Returned:\n');
    console.log(`   End-of-Sale Date: ${results.end_of_sale_date || 'NOT FOUND ❌'}`);
    console.log(`   End-of-Support Date: ${results.last_day_of_support_date || 'NOT FOUND ❌'}`);
    console.log(`   SW Maintenance End: ${results.end_of_sw_maintenance_date || 'Not found'}`);
    console.log(`   Vulnerability Support End: ${results.end_of_sw_vulnerability_maintenance_date || 'Not found'}`);
    console.log(`   Is Current Product: ${results.is_current_product ? 'Yes' : 'No'}`);
    console.log(`   Lifecycle Confidence: ${results.lifecycle_confidence || 0}%`);
    console.log(`   Overall Confidence: ${results.overall_confidence || 0}%`);
    
    if (results.data_sources) {
      console.log(`\n   Data Sources:`);
      console.log(`   • Vendor Sites: ${results.data_sources.vendor_site || 0}`);
      console.log(`   • Third Party: ${results.data_sources.third_party || 0}`);
      console.log(`   • Manual Entry: ${results.data_sources.manual_entry || 0}`);
    }
    
    // Check if results match expected
    console.log('\n' + '═'.repeat(80));
    console.log('📊 Result Analysis:\n');
    
    const foundEOS = results.end_of_sale_date !== null;
    const foundEOST = results.last_day_of_support_date !== null;
    const correctEOS = results.end_of_sale_date && results.end_of_sale_date.includes('2022');
    const correctEOST = results.last_day_of_support_date && results.last_day_of_support_date.includes('2026');
    
    if (correctEOS && correctEOST) {
      console.log('   ✅ SUCCESS! Found correct MR33-HW lifecycle dates!');
      console.log('   The service is working properly for this product.');
    } else if (foundEOS || foundEOST) {
      console.log('   ⚠️  PARTIAL SUCCESS - Found some dates but not the correct ones');
      console.log(`   • End-of-Sale: ${foundEOS ? (correctEOS ? '✓ Correct' : '✗ Wrong date') : '✗ Not found'}`);
      console.log(`   • End-of-Support: ${foundEOST ? (correctEOST ? '✓ Correct' : '✗ Wrong date') : '✗ Not found'}`);
    } else {
      console.log('   ❌ FAILED - No lifecycle dates found for MR33-HW');
      console.log('\n   The service needs these improvements to find MR33-HW dates:');
      console.log('\n   1. 🔍 Better Search Queries:');
      console.log('      Change from: MR33-HW End-of-Sale End-of-Life');
      console.log('      Change to: "MR33-HW" site:documentation.meraki.com');
      console.log('\n   2. 🎯 Exact Match Searches:');
      console.log('      Use quotes: "MR33-HW" "End-of-Sale" "End-of-Support"');
      console.log('\n   3. 🔄 Product Variants:');
      console.log('      Also search for: "MR33" (without -HW suffix)');
      console.log('\n   4. 📅 Date Pattern Coverage:');
      console.log('      Add patterns for: "End-of-Sale Date: July 14, 2022"');
      console.log('      Add patterns for: "14-Jul-2022" format');
      console.log('\n   5. ❌ Remove Mock Data:');
      console.log('      Remove any getMockSearchResults() fallback');
      console.log('      Remove random confidence generation');
    }
    
    // Check for mock data indicators
    if (results.lifecycle_confidence && results.overall_confidence) {
      const suspiciousConfidence = (
        results.lifecycle_confidence === 50 ||
        results.lifecycle_confidence === 60 ||
        results.lifecycle_confidence === 40
      );
      
      if (suspiciousConfidence && !foundEOS && !foundEOST) {
        console.log('\n   ⚠️  WARNING: Confidence scores look like mock data');
        console.log('      (Random values without actual findings)');
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('💡 Quick Fix to Find MR33-HW Dates:\n');
    console.log('In your googleAIResearchService.js, update buildSearchQueries():');
    console.log('\n// Add these queries for Meraki products:');
    console.log('if (productId.match(/^(MR|MS|MX)\\d+/i)) {');
    console.log('  queries.push(`"${productId}" site:documentation.meraki.com`);');
    console.log('  const baseProduct = productId.replace(/-HW$/i, "");');
    console.log('  queries.push(`"${baseProduct}" site:documentation.meraki.com EOL`);');
    console.log('}');
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n   Missing required module. Install dependencies:');
      console.error('   npm install axios cheerio dotenv');
    } else if (error.message.includes('Cannot read properties')) {
      console.error('\n   The service returned an unexpected format.');
      console.error('   Check the performResearch() method implementation.');
    } else {
      console.error('\n   Stack trace:', error.stack);
    }
  }
}

// Run the test
console.log('\n🚀 Starting test...\n');
runTest().then(() => {
  console.log('\n✅ Test complete!\n');
}).catch((err) => {
  console.error('\n❌ Test crashed:', err);
});