// Test script for the /compare-sequences API endpoint
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCompareSequences() {
  try {
    // Test data - array of gene comparisons
    const geneComparisons = [
      { 
        geneName: "FSHR", 
        newSequence: "ATGCGTACGTTAGC" 
      },
      { 
        geneName: "INS", 
        newSequence: "CGTATCGATCGGAT" 
      },
      { 
        geneName: "CAPN10", 
        newSequence: "GCTAGCTAGCTAGC" 
      }
    ];

    console.log('Testing /compare-sequences endpoint...');
    console.log('Input data:', JSON.stringify(geneComparisons, null, 2));

    // Make the API call
    const response = await axios.post(`${API_BASE_URL}/compare-sequences`, {
      geneComparisons: geneComparisons
    });

    console.log('\n✅ API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    // Expected format:
    // {
    //   typeA: 66.67,
    //   typeB: 33.33,
    //   typeC: 0.0,
    //   typeD: 0.0
    // }

  } catch (error) {
    console.error('\n❌ Error testing API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testCompareSequences(); 