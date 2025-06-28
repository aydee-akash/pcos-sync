// Calculate similarity between two sequences
export const calculateSimilarity = (seq1, seq2) => {
  if (seq1.length !== seq2.length) return 0;
  let matches = 0;
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] === seq2[i]) matches++;
  }
  return matches / seq1.length;
};

// Determine phenotype based on criteria
export const determinePhenotype = (criteriaA, criteriaB, criteriaC) => {
  if (criteriaA === 'Y' && criteriaB === 'Y' && criteriaC === 'Y') return "typeA";
  if (criteriaA === 'N' && criteriaB === 'Y' && criteriaC === 'Y') return "typeB";
  if (criteriaA === 'Y' && criteriaB === 'N' && criteriaC === 'Y') return "typeC";
  if (criteriaA === 'Y' && criteriaB === 'Y' && criteriaC === 'N') return "typeD";
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