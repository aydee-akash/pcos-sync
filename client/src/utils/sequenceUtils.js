import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Calculate similarity between two sequences
export const calculateSimilarity = (seq1, seq2) => {
  if (seq1.length !== seq2.length) return 0;
  let matches = 0;
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] === seq2[i]) matches++;
  }
  return matches / seq1.length;
};

/**
 * Determines PCOS phenotype based on the three criteria
 * @param {string} cysts - 'Y' or 'N'
 * @param {string} irregularCycle - 'Y' or 'N'
 * @param {string} hyperandrogenism - 'Y' or 'N'
 * @returns {string} phenotype type (typeA, typeB, typeC, typeD, or null if invalid)
 */
export const determinePhenotype = (cysts, irregularCycle, hyperandrogenism) => {
  // Validate inputs
  if (!['Y', 'N'].includes(cysts) || !['Y', 'N'].includes(irregularCycle) || !['Y', 'N'].includes(hyperandrogenism)) {
    return null;
  }

  // If all three are 'Y' => typeA
  if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'Y') {
    return 'typeA';
  }
  
  // If cysts = 'N', rest 'Y' => typeB
  if (cysts === 'N' && irregularCycle === 'Y' && hyperandrogenism === 'Y') {
    return 'typeB';
  }
  
  // If irregularCycle = 'N', rest 'Y' => typeC
  if (cysts === 'Y' && irregularCycle === 'N' && hyperandrogenism === 'Y') {
    return 'typeC';
  }
  
  // If hyperandrogenism = 'N', rest 'Y' => typeD
  if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'N') {
    return 'typeD';
  }

  // If none of the above patterns match, return null
  return null;
};

// Compare new sequences against stored data
export const compareNewSequences = (phenotypeDict, comparisonData) => {
  const probabilities = { typeA: 0, typeB: 0, typeC: 0, typeD: 0 };
  const totalComparisons = { typeA: 0, typeB: 0, typeC: 0, typeD: 0 };

  comparisonData.forEach(([geneName, newSequence]) => {
    Object.entries(phenotypeDict).forEach(([phenotype, genes]) => {
      if (genes[geneName]) {
        const sequences = genes[geneName];
        const totalGenes = sequences.length;
        const score = sequences.some(seq => calculateSimilarity(seq, newSequence) === 1.0);
        probabilities[phenotype] += score;
        totalComparisons[phenotype] += 1;
      }
    });
  });

  const finalProbabilities = {};
  Object.keys(probabilities).forEach(phenotype => {
    const total = totalComparisons[phenotype];
    finalProbabilities[phenotype] = total > 0 ? (probabilities[phenotype] / total) * 100 : 0;
  });

  return finalProbabilities;
};

/**
 * Submits gene sequence data to Firestore
 * @param {Object} formData - Object containing gene sequence data
 * @param {string} formData.geneName - Name of the gene
 * @param {string} formData.sequence - Gene sequence
 * @param {string} formData.cysts - 'Y' or 'N' for cysts presence
 * @param {string} formData.irregularCycle - 'Y' or 'N' for irregular cycle
 * @param {string} formData.hyperandrogenism - 'Y' or 'N' for hyperandrogenism
 * @returns {Promise<Object>} Promise that resolves to the document reference
 */
export const submitGeneSequenceToFirestore = async (formData) => {
  try {
    // Validate required fields
    if (!formData.geneName || !formData.sequence || !formData.cysts || !formData.irregularCycle || !formData.hyperandrogenism) {
      throw new Error('All fields are required');
    }

    // Determine phenotype based on criteria
    const phenotype = determinePhenotype(
      formData.cysts,
      formData.irregularCycle,
      formData.hyperandrogenism
    );

    if (!phenotype) {
      throw new Error('Invalid combination of PCOS criteria. Please check your selections.');
    }

    // Prepare document data
    const documentData = {
      geneName: formData.geneName,
      sequence: formData.sequence.toUpperCase(), // Normalize to uppercase
      cysts: formData.cysts,
      irregularCycle: formData.irregularCycle,
      hyperandrogenism: formData.hyperandrogenism,
      phenotype: phenotype,
      createdAt: serverTimestamp(),
      // Add additional metadata
      criteria: {
        cysts: formData.cysts,
        irregularCycle: formData.irregularCycle,
        hyperandrogenism: formData.hyperandrogenism
      }
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'geneSequences'), documentData);
    
    return {
      success: true,
      docId: docRef.id,
      phenotype: phenotype,
      message: 'Gene sequence added successfully!'
    };

  } catch (error) {
    console.error('Error submitting gene sequence:', error);
    throw new Error(`Failed to submit gene sequence: ${error.message}`);
  }
};

/**
 * Fetches all documents from the "geneSequences" Firestore collection
 * @returns {Promise<Array>} Promise that resolves to an array of gene sequence objects
 */
export const fetchAllGeneSequences = async () => {
  try {
    // Get reference to the geneSequences collection
    const geneSequencesRef = collection(db, 'geneSequences');
    
    // Fetch all documents from the collection
    const querySnapshot = await getDocs(geneSequencesRef);
    
    // Map each document to its data and include the document ID
    const geneSequences = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return geneSequences;
    
  } catch (error) {
    console.error('Error fetching gene sequences:', error);
    throw new Error(`Failed to fetch gene sequences: ${error.message}`);
  }
};

/**
 * Compares two sequences character by character and returns similarity ratio
 * @param {string} seq1 - First sequence
 * @param {string} seq2 - Second sequence
 * @returns {number} Similarity ratio (0.0 to 1.0)
 */
export const calculateSequenceSimilarity = (seq1, seq2) => {
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
};

/**
 * Compares new gene sequences with existing ones in Firestore and calculates phenotype match percentages
 * @param {Array} newSequences - Array of objects with { geneName, sequence }
 * @returns {Promise<Object>} Object with phenotype percentages
 */
export const compareSequencesWithFirestore = async (newSequences) => {
  try {
    // Validate input
    if (!Array.isArray(newSequences) || newSequences.length === 0) {
      throw new Error('New sequences array must be non-empty');
    }
    
    // Fetch all existing gene sequences from Firestore
    const existingSequences = await fetchAllGeneSequences();
    
    // Initialize phenotype counters
    const phenotypeCounts = {
      typeA: { matches: 0, total: 0 },
      typeB: { matches: 0, total: 0 },
      typeC: { matches: 0, total: 0 },
      typeD: { matches: 0, total: 0 }
    };
    
    // Process each new sequence
    for (const newSeq of newSequences) {
      const { geneName, sequence } = newSeq;
      
      if (!geneName || !sequence) {
        console.warn('Skipping sequence with missing geneName or sequence');
        continue;
      }
      
      // Find existing sequences with the same gene name
      const matchingGeneSequences = existingSequences.filter(
        existing => existing.geneName === geneName
      );
      
      if (matchingGeneSequences.length === 0) {
        console.warn(`No existing sequences found for gene: ${geneName}`);
        continue;
      }
      
      // Compare with each existing sequence of the same gene
      for (const existingSeq of matchingGeneSequences) {
        const similarity = calculateSequenceSimilarity(sequence, existingSeq.sequence);
        
        // Count this comparison for the phenotype
        const phenotype = existingSeq.phenotype;
        if (phenotypeCounts[phenotype]) {
          phenotypeCounts[phenotype].total++;
          
          // If similarity is exactly 1.0, count it as a match
          if (similarity === 1.0) {
            phenotypeCounts[phenotype].matches++;
          }
        }
      }
    }
    
    // Calculate percentages
    const result = {};
    for (const [phenotype, counts] of Object.entries(phenotypeCounts)) {
      if (counts.total > 0) {
        result[phenotype] = parseFloat(((counts.matches / counts.total) * 100).toFixed(2));
      } else {
        result[phenotype] = 0.00;
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('Error comparing sequences with Firestore:', error);
    throw new Error(`Failed to compare sequences: ${error.message}`);
  }
}; 