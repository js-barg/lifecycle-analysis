/**
 * Quick 5-Product Test for Google AI Research Service
 * Tests key products from major manufacturers
 */

const GoogleAIResearchService = require('./googleAIResearchService');
require('dotenv').config();

// 5 key test products - one from each major vendor
const testProducts = [
  { 
    product_id: 'MR33-HW', 
    manufacturer: 'Cisco Meraki',
    note: 'Should find EOS: July 2022, EOST: July 2026'
  },
  { 
    product_id: 'WS-C3850-48P', 
    manufacturer: 'Cisco',
    note: 'Popular Catalyst switch with known EOL'
  },
  { 
    product_id: 'FortiGate-60E', 
    manufacturer: 'Fortinet',
    note: 'Common firewall model'
  },
  { 
    product_id: 'PA-220', 
    manufacturer: 'Palo Alto',
    note: 'Entry-level Palo Alto firewall'
  },
  { 
    product_id: 'JL253A', 
    manufacturer: 'HPE Aruba',
    note: 'Aruba 2930F switch'
  }
];

console.log('🚀 Quick 5-Product Test');
console.log('═'.repeat(60));

async function quickTest() {
  const results = [];
  
  for (let i = 0; i < testProducts.length; i++) {
    const product = testProducts[i];
    console.log(`\n${i + 1}. ${product.product_id} (${product.manufacturer})`);
    console.log(`   ${product.note}`);
    console.log('   ' + '-'.repeat(40));
    
    try {
      const result = await GoogleAIResearchService.performResearch(product);
      
      const eos = result.end_of_sale_date || 'NOT FOUND';
      const eost = result.last_day_of_support_date || 'NOT FOUND';
      const conf = result.lifecycle_confidence || 0;
      
      console.log(`   EOS:  ${eos}`);
      console.log(`   EOST: ${eost}`);
      console.log(`   Conf: ${conf}%`);
      
      const status = (eos !== 'NOT FOUND' || eost !== 'NOT FOUND') ? '✅' : '❌';
      console.log(`   ${status}`);
      
      results.push({
        product: product.product_id,
        success: status === '✅'
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({
        product: product.product_id,
        success: false
      });
    }
  }
  
  // Quick summary
  const successful = results.filter(r => r.success).length;
  console.log('\n' + '═'.repeat(60));
  console.log(`RESULTS: ${successful}/${results.length} products found EOL dates`);
  
  if (successful < results.length) {
    console.log('\nTo improve results, add site-specific queries:');
    console.log('• Meraki: site:documentation.meraki.com');
    console.log('• Fortinet: site:fortinet.com');
    console.log('• Palo Alto: site:paloaltonetworks.com');
    console.log('• HPE: site:hpe.com');
  }
  
  console.log('\n✅ Test complete!\n');
}

// Check if the first product has the bug we saw earlier
console.log('Checking for known issues...');
console.log('API Key configured:', process.env.GOOGLE_API_KEY ? 'Yes' : 'No');
console.log('');

quickTest().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  if (error.message.includes('product is not defined')) {
    console.log('\n🔧 FIX NEEDED in googleAIResearchService.js:');
    console.log('   Line 367: Remove or fix the line with "product.product_id"');
    console.log('   It should use a parameter instead of undefined variable');
  }
});