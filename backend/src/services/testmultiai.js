/**
 * Multi-Product Test for Google AI Research Service
 * Tests various products from different manufacturers
 */

const GoogleAIResearchService = require('./googleAIResearchService');
require('dotenv').config();

console.log('🚀 Multi-Product Google AI Research Service Test');
console.log('═'.repeat(80));

// Test products from various manufacturers with known EOL dates
const testProducts = [
  {
    product_id: 'MR33-HW',
    manufacturer: 'Cisco Meraki',
    category: 'Wireless AP',
    expected: {
      end_of_sale: '2022-07-14',
      end_of_support: '2026-07-21',
      source: 'documentation.meraki.com'
    }
  },
  {
    product_id: 'N2K-C2248TF-1GE',
    manufacturer: 'Cisco',
    category: 'Nexus Fabric Extender',
    expected: {
      end_of_sale: '2015-01-31',
      last_day_of_support: '2020-01-31',
      source: 'cisco.com'
    }
  },
  {
    product_id: 'WS-C3850-48P',
    manufacturer: 'Cisco',
    category: 'Catalyst Switch',
    expected: {
      end_of_sale: '2021-10-31',
      last_day_of_support: '2026-10-31',
      source: 'cisco.com'
    }
  },
  {
    product_id: 'MS225-48FP',
    manufacturer: 'Cisco Meraki',
    category: 'Meraki Switch',
    expected: {
      end_of_sale: 'Unknown',
      end_of_support: 'Unknown',
      source: 'documentation.meraki.com'
    }
  },
  {
    product_id: 'FortiGate-60E',
    manufacturer: 'Fortinet',
    category: 'Firewall',
    expected: {
      end_of_sale: '2022-04-11',
      end_of_support: '2027-04-11',
      source: 'fortinet.com'
    }
  },
  {
    product_id: 'PA-3020',
    manufacturer: 'Palo Alto',
    category: 'Firewall',
    expected: {
      end_of_sale: '2018-10-31',
      end_of_support: '2023-10-31',
      source: 'paloaltonetworks.com'
    }
  },
  {
    product_id: 'JL253A',
    manufacturer: 'HPE Aruba',
    category: 'Aruba Switch',
    expected: {
      end_of_sale: 'Unknown',
      end_of_support: 'Unknown',
      source: 'hpe.com'
    }
  },
  {
    product_id: 'SRX340',
    manufacturer: 'Juniper',
    category: 'Security Gateway',
    expected: {
      end_of_sale: 'Unknown',
      end_of_support: 'Unknown',
      source: 'juniper.net'
    }
  }
];

// Results storage
const results = [];

// Check if API is configured
function checkAPIConfig() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || apiKey === 'your_google_api_key_here' || 
      !searchEngineId || searchEngineId === 'your_search_engine_id_here') {
    console.log('\n⚠️  Google API Configuration Status: NOT CONFIGURED\n');
    console.log('   Add to your .env file:');
    console.log('   GOOGLE_API_KEY=your_actual_key');
    console.log('   GOOGLE_SEARCH_ENGINE_ID=your_actual_id\n');
    return false;
  } else {
    console.log('\n✅ Google API Configuration Status: CONFIGURED\n');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`   Search Engine ID: ${searchEngineId}\n`);
    return true;
  }
}

// Format date for comparison
function formatDate(dateStr) {
  if (!dateStr) return null;
  // Handle various date formats and normalize to YYYY-MM-DD
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return dateStr;
}

// Check if dates match (within reason)
function datesMatch(found, expected) {
  if (!found || !expected || expected === 'Unknown') return false;
  
  const foundDate = formatDate(found);
  const expectedDate = formatDate(expected);
  
  // Check if years match at minimum
  const foundYear = foundDate ? foundDate.substring(0, 4) : '';
  const expectedYear = expectedDate ? expectedDate.substring(0, 4) : '';
  
  return foundYear === expectedYear;
}

// Test a single product
async function testProduct(product, index) {
  console.log(`\n${index}. Testing: ${product.product_id}`);
  console.log('   ' + '-'.repeat(50));
  console.log(`   Manufacturer: ${product.manufacturer}`);
  console.log(`   Category: ${product.category}`);
  console.log(`   Expected EOS: ${product.expected.end_of_sale}`);
  console.log(`   Expected EOST: ${product.expected.end_of_support || product.expected.last_day_of_support}`);
  
  const startTime = Date.now();
  
  try {
    const result = await GoogleAIResearchService.performResearch(product);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Store result for summary
    const testResult = {
      product: product.product_id,
      manufacturer: product.manufacturer,
      expected_eos: product.expected.end_of_sale,
      expected_eost: product.expected.end_of_support || product.expected.last_day_of_support,
      found_eos: result.end_of_sale_date,
      found_eost: result.last_day_of_support_date,
      confidence: result.lifecycle_confidence,
      duration: duration,
      sources: result.data_sources
    };
    
    // Check if results match expected
    const eosMatch = datesMatch(result.end_of_sale_date, product.expected.end_of_sale);
    const eostMatch = datesMatch(
      result.last_day_of_support_date, 
      product.expected.end_of_support || product.expected.last_day_of_support
    );
    
    testResult.eos_match = eosMatch;
    testResult.eost_match = eostMatch;
    testResult.success = (eosMatch || eostMatch) || 
                         (product.expected.end_of_sale === 'Unknown' && result.end_of_sale_date) ||
                         (product.expected.end_of_support === 'Unknown' && result.last_day_of_support_date);
    
    results.push(testResult);
    
    // Display results
    console.log(`\n   Results (${duration}s):`);
    console.log(`   • EOS:  ${result.end_of_sale_date || 'NOT FOUND'} ${eosMatch ? '✓' : ''}`);
    console.log(`   • EOST: ${result.last_day_of_support_date || 'NOT FOUND'} ${eostMatch ? '✓' : ''}`);
    console.log(`   • Confidence: ${result.lifecycle_confidence || 0}%`);
    console.log(`   • Sources: Vendor=${result.data_sources?.vendor_site || 0}, Third-party=${result.data_sources?.third_party || 0}`);
    
    if (testResult.success) {
      console.log(`   ✅ SUCCESS - Found lifecycle data`);
    } else if (result.end_of_sale_date || result.last_day_of_support_date) {
      console.log(`   ⚠️  PARTIAL - Found dates but not matching expected`);
    } else {
      console.log(`   ❌ FAILED - No dates found`);
    }
    
  } catch (error) {
    console.log(`\n   ❌ ERROR: ${error.message}`);
    results.push({
      product: product.product_id,
      manufacturer: product.manufacturer,
      error: error.message,
      success: false
    });
  }
}

// Generate summary report
function generateSummary() {
  console.log('\n' + '═'.repeat(80));
  console.log('📊 TEST SUMMARY REPORT');
  console.log('═'.repeat(80));
  
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const partial = results.filter(r => !r.success && (r.found_eos || r.found_eost)).length;
  const failed = results.filter(r => !r.success && !r.found_eos && !r.found_eost).length;
  const errors = results.filter(r => r.error).length;
  
  console.log('\n📈 Overall Statistics:');
  console.log(`   • Total Products Tested: ${total}`);
  console.log(`   • Successful: ${successful} (${Math.round(successful/total * 100)}%)`);
  console.log(`   • Partial: ${partial} (${Math.round(partial/total * 100)}%)`);
  console.log(`   • Failed: ${failed} (${Math.round(failed/total * 100)}%)`);
  console.log(`   • Errors: ${errors}`);
  
  // Performance metrics
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + parseFloat(r.duration), 0) / (total - errors);
  console.log(`\n   • Average Query Time: ${avgDuration.toFixed(2)}s`);
  
  // By manufacturer success rate
  console.log('\n📊 Success Rate by Manufacturer:');
  const manufacturers = [...new Set(results.map(r => r.manufacturer))];
  manufacturers.forEach(mfr => {
    const mfrResults = results.filter(r => r.manufacturer === mfr);
    const mfrSuccess = mfrResults.filter(r => r.success).length;
    const successRate = Math.round(mfrSuccess / mfrResults.length * 100);
    console.log(`   • ${mfr}: ${successRate}% (${mfrSuccess}/${mfrResults.length})`);
  });
  
  // Detailed results table
  console.log('\n📋 Detailed Results:');
  console.log('   ' + '-'.repeat(76));
  console.log('   Product ID        | Found EOS  | Found EOST | Confidence | Status');
  console.log('   ' + '-'.repeat(76));
  
  results.forEach(r => {
    const productId = r.product.padEnd(17);
    const eos = (r.found_eos ? '✓' : '✗').padEnd(10);
    const eost = (r.found_eost ? '✓' : '✗').padEnd(11);
    const confidence = `${r.confidence || 0}%`.padEnd(11);
    const status = r.success ? '✅' : r.error ? '❌ Error' : '❌';
    console.log(`   ${productId} | ${eos} | ${eost} | ${confidence} | ${status}`);
  });
  
  // Problem areas
  const failedProducts = results.filter(r => !r.success && !r.error);
  if (failedProducts.length > 0) {
    console.log('\n⚠️  Products Needing Attention:');
    failedProducts.forEach(r => {
      console.log(`   • ${r.product} (${r.manufacturer})`);
      if (r.product.includes('MR') || r.product.includes('MS')) {
        console.log(`     → Add: site:documentation.meraki.com`);
      } else if (r.manufacturer.includes('Fortinet')) {
        console.log(`     → Add: site:fortinet.com`);
      } else if (r.manufacturer.includes('Palo Alto')) {
        console.log(`     → Add: site:paloaltonetworks.com`);
      }
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (failed > 0) {
    console.log('   1. Add vendor-specific site targeting for better results');
    console.log('   2. Implement exact match queries with quotes');
    console.log('   3. Handle product variants (e.g., -HW suffix)');
    console.log('   4. Expand date pattern recognition');
  }
  if (successful === total) {
    console.log('   ✅ Excellent! All products found successfully!');
  }
}

// Main test runner
async function runTests() {
  console.log(`\n📅 Test Date: ${new Date().toLocaleString()}`);
  console.log(`📦 Testing ${testProducts.length} products from various manufacturers\n`);
  
  // Check API configuration
  const apiConfigured = checkAPIConfig();
  
  console.log('═'.repeat(80));
  console.log('Starting individual product tests...\n');
  
  // Test each product
  for (let i = 0; i < testProducts.length; i++) {
    await testProduct(testProducts[i], i + 1);
    
    // Small delay between tests to avoid rate limiting
    if (i < testProducts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Generate summary
  generateSummary();
  
  console.log('\n' + '═'.repeat(80));
  console.log('✅ Multi-Product Test Complete!');
  console.log('═'.repeat(80) + '\n');
}

// Error handler
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});

// Run the tests
runTests().catch(console.error);