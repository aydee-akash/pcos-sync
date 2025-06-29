const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl2dEPn33H3MomLyYCpPoUi0SVdx8krCQ",
  authDomain: "pcosync.firebaseapp.com",
  projectId: "pcosync",
  storageBucket: "pcosync.firebasestorage.app",
  messagingSenderId: "872851757360",
  appId: "1:872851757360:web:6fc918963cb0bbaf1490f5",
  measurementId: "G-KRX6F1JEMG"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(cors());
app.use(express.json());

// Local data storage
const phenotypeDict = {
  typeA: {},
  typeB: {},
  typeC: {},
  typeD: {}
};

// Utility function to calculate similarity between two sequences
function calculateSimilarity(seq1, seq2) {
  if (!seq1 || !seq2) return 0.0;
  
  // Normalize sequences to uppercase and remove whitespace
  const normalizedSeq1 = seq1.toUpperCase().replace(/\s/g, '');
  const normalizedSeq2 = seq2.toUpperCase().replace(/\s/g, '');
  
  // Get the maximum length of the two sequences
  const maxLength = Math.max(normalizedSeq1.length, normalizedSeq2.length);
  
  if (maxLength === 0) return 0.0;
  
  // Count matching characters
  let matches = 0;
  const minLength = Math.min(normalizedSeq1.length, normalizedSeq2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (normalizedSeq1[i] === normalizedSeq2[i]) {
      matches++;
    }
  }
  
  // Return ratio of matching characters over max length
  return matches / maxLength;
}

// Helper function to determine phenotype
function determinePhenotype(cysts, irregularCycle, hyperandrogenism) {
  if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'Y') return "typeA";
  if (cysts === 'N' && irregularCycle === 'Y' && hyperandrogenism === 'Y') return "typeB";
  if (cysts === 'Y' && irregularCycle === 'N' && hyperandrogenism === 'Y') return "typeC";
  if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'N') return "typeD";
  return null;
}

// Add sequence endpoint
app.post('/api/add-sequence', async (req, res) => {
  try {
    const { geneName, sequence, cysts, irregularCycle, hyperandrogenism } = req.body;
    
    const phenotype = determinePhenotype(cysts, irregularCycle, hyperandrogenism);
    if (!phenotype) {
      return res.status(400).json({ error: 'Invalid phenotype combination' });
    }

    // Add sequence to local storage (keeping for backward compatibility)
    if (!phenotypeDict[phenotype][geneName]) {
      phenotypeDict[phenotype][geneName] = [];
    }
    phenotypeDict[phenotype][geneName].push(sequence);

    res.status(201).json({ message: 'Sequence added successfully' });
  } catch (error) {
    console.error('Error adding sequence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New compare sequences endpoint using Firestore
app.post('/api/compare-sequences', async (req, res) => {
  try {
    const { geneComparisons } = req.body;
    
    // Validate input
    if (!Array.isArray(geneComparisons) || geneComparisons.length === 0) {
      return res.status(400).json({ error: 'geneComparisons must be a non-empty array' });
    }

    // Fetch all gene sequences from Firestore
    const geneSequencesRef = collection(db, 'geneSequences');
    const querySnapshot = await getDocs(geneSequencesRef);
    
    // Organize data by phenotype and gene name
    const organizedData = {
      typeA: {},
      typeB: {},
      typeC: {},
      typeD: {}
    };

    // Process each document from Firestore
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const { geneName, sequence, phenotype } = data;
      
      if (phenotype && organizedData[phenotype]) {
        if (!organizedData[phenotype][geneName]) {
          organizedData[phenotype][geneName] = [];
        }
        organizedData[phenotype][geneName].push(sequence);
      }
    });

    // Initialize counters for each phenotype
    const phenotypeCounts = {
      typeA: { matches: 0, total: 0 },
      typeB: { matches: 0, total: 0 },
      typeC: { matches: 0, total: 0 },
      typeD: { matches: 0, total: 0 }
    };

    // Process each input gene comparison
    for (const comparison of geneComparisons) {
      const { geneName, newSequence } = comparison;
      
      if (!geneName || !newSequence) {
        console.warn('Skipping comparison with missing geneName or newSequence');
        continue;
      }

      // Compare with each phenotype
      for (const phenotype in organizedData) {
        const genes = organizedData[phenotype];
        
        if (genes[geneName]) {
          // Compare with each stored sequence of the same gene
          for (const storedSequence of genes[geneName]) {
            const similarity = calculateSimilarity(newSequence, storedSequence);
            
            phenotypeCounts[phenotype].total++;
            
            // Consider it a match if similarity is exactly 1.0
            if (similarity === 1.0) {
              phenotypeCounts[phenotype].matches++;
            }
          }
        }
      }
    }

    // Calculate final probabilities
    const result = {};
    for (const [phenotype, counts] of Object.entries(phenotypeCounts)) {
      if (counts.total > 0) {
        result[phenotype] = parseFloat(((counts.matches / counts.total) * 100).toFixed(2));
      } else {
        result[phenotype] = 0.0;
      }
    }

    res.json(result);
    
  } catch (error) {
    console.error('Error comparing sequences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy compare sequences endpoint (keeping for backward compatibility)
app.post('/api/compare-sequences-legacy', async (req, res) => {
  try {
    const { geneName, sequence } = req.body;
    const results = {};
    const totalComparisons = {};

    // Initialize results and totalComparisons
    for (const phenotype in phenotypeDict) {
      results[phenotype] = 0;
      totalComparisons[phenotype] = 0;
    }

    // Compare sequences for each phenotype
    for (const phenotype in phenotypeDict) {
      const genes = phenotypeDict[phenotype];
      if (genes[geneName]) {
        const matches = genes[geneName].filter(storedSeq => 
          calculateSimilarity(storedSeq, sequence) === 1.0
        ).length;
        
        results[phenotype] = matches;
        totalComparisons[phenotype] = genes[geneName].length;
      }
    }

    // Calculate final probabilities
    const finalProbabilities = {};
    for (const phenotype in phenotypeDict) {
      const total = totalComparisons[phenotype];
      finalProbabilities[phenotype] = total > 0 ? (results[phenotype] / total) * 100 : 0;
    }

    res.json(finalProbabilities);
  } catch (error) {
    console.error('Error comparing sequences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat endpoint for PCOS-related queries
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    // Here you would integrate with OpenAI API
    // For now, returning a placeholder response
    res.json({ response: "I'm a PCOS assistant. How can I help you today?" });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 