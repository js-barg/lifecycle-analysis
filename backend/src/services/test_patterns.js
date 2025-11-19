// test_patterns.js
function testCiscoPatterns() {
  const testTexts = [
    "End-of-Sale Date: 31-Jan-2015",
    "End of Sale Date: 31-Oct-2021",
    "Last Date of Support: 30-Apr-2020",
  ];
  
  const patterns = [
    /End-of-Sale Date[:\s]*(\d{1,2}-[A-Z][a-z]{2}-\d{4})/i,
    /End of Sale Date[:\s]*(\d{1,2}-[A-Z][a-z]{2}-\d{4})/i,
    /Last Date of Support[:\s]*(\d{1,2}-[A-Z][a-z]{2}-\d{4})/i,
  ];
  
  console.log("Testing Cisco patterns:");
  testTexts.forEach(text => {
    patterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        console.log(`✅ "${text}" → ${match[1]}`);
      }
    });
  });
}

testCiscoPatterns();