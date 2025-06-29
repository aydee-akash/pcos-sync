import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generatePhenotypeExplanation, generateRecommendations } from '../services/geminiService';
import PhenotypeReport from '../components/PhenotypeReport';
import PhenotypeChart from '../components/PhenotypeChart';
import axios from 'axios';

const PhenotypePredictor = () => {
  const { currentUser, addPhenotypeHistory } = useAuth();
  const [comparisonData, setComparisonData] = useState([]);
  const [currentGene, setCurrentGene] = useState('');
  const [currentSequence, setCurrentSequence] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [sequenceError, setSequenceError] = useState('');
  const [customGeneName, setCustomGeneName] = useState('');

  // Common PCOS-related genes
  const pcosGenes = [
    { value: '', label: 'Select a gene or type custom' },
    { value: 'INS', label: 'INS' },
    { value: 'FSHR', label: 'FSHR' },
    { value: 'CAPN10', label: 'CAPN10' },
    { value: 'LHCGR', label: 'LHCGR' },
    { value: 'AMH', label: 'AMH' }
  ];

  // Tooltip component
  const Tooltip = ({ text, children }) => (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  const handleGeneNameChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setCurrentGene('custom');
    } else {
      setCurrentGene(value);
    }
  };

  const handleCustomGeneChange = (e) => {
    const value = e.target.value;
    setCustomGeneName(value);
    setCurrentGene(value);
  };

  const handleSequenceChange = (e) => {
    const value = e.target.value;
    // Validate sequence input
    const validSequence = /^[ATCGatcg\s]*$/.test(value);
    if (!validSequence && value !== '') {
      setSequenceError('Gene sequences can only contain letters A, T, C, G (case-insensitive)');
    } else {
      setSequenceError('');
    }
    setCurrentSequence(value);
  };

  const handleAddSequence = () => {
    if (!currentGene || !currentSequence) {
      setError('Please enter both gene name and sequence');
      return;
    }

    if (sequenceError) {
      setError('Please fix the sequence validation errors before adding.');
      return;
    }

    setComparisonData([...comparisonData, [currentGene, currentSequence.toUpperCase()]]);
    setCurrentGene('');
    setCurrentSequence('');
    setCustomGeneName('');
    setSequenceError('');
    setError('');
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setExplanation('');
    setRecommendations('');

    try {
      if (comparisonData.length === 0) {
        throw new Error('Please add at least one sequence for comparison');
      }

      // Prepare data for API call
      const geneComparisons = comparisonData.map(([geneName, sequence]) => ({
        geneName,
        newSequence: sequence
      }));

      console.log('Sending gene comparisons:', geneComparisons);

      // Call the new API endpoint
      const response = await axios.post('http://localhost:5000/api/compare-sequences', {
        geneComparisons: geneComparisons
      });

      console.log('API Response:', response.data);
      setResult(response.data);

      // Generate AI explanation and recommendations
      setAiLoading(true);
      try {
        const aiExplanation = await generatePhenotypeExplanation(
          Math.max(...Object.values(response.data)) / 100,
          comparisonData.map(([_, seq]) => seq)
        );
        setExplanation(aiExplanation);
        
        const aiRecommendations = await generateRecommendations(
          Math.max(...Object.values(response.data)) / 100,
          aiExplanation
        );
        setRecommendations(aiRecommendations);
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        setError('Error generating AI analysis. Please try again.');
      } finally {
        setAiLoading(false);
      }

      // Save to history
      await addPhenotypeHistory(currentUser.uid, {
        type: Object.entries(response.data).reduce((a, b) => a[1] > b[1] ? a : b)[0],
        probability: Math.max(...Object.values(response.data)) / 100,
        sequences: comparisonData.map(([_, seq]) => seq),
        timestamp: new Date().toISOString()
      });

      setComparisonData([]);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.response?.data?.error || err.message || 'Error comparing sequences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Phenotype Predictor</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Add Sequences for Comparison</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Gene Name
                  </label>
                  <Tooltip text="Genes like INS or FSHR are linked to PCOS. Choose a gene you're analyzing.">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  <select
                    value={pcosGenes.find(gene => gene.value === currentGene) ? currentGene : 'custom'}
                    onChange={handleGeneNameChange}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2"
                  >
                    {pcosGenes.map((gene, index) => (
                      <option key={index} value={gene.value}>
                        {gene.label}
                      </option>
                    ))}
                    <option value="custom">Custom gene name</option>
                  </select>
                  
                  {currentGene === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom gene name"
                      value={customGeneName}
                      onChange={handleCustomGeneChange}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Gene Sequence
                  </label>
                  <Tooltip text="Gene sequences are made up of A, T, C, G. Example: ATCGTACAGT">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </Tooltip>
                </div>
                
                <textarea
                  value={currentSequence}
                  onChange={handleSequenceChange}
                  className={`w-full h-32 bg-gray-600 text-white rounded px-3 py-2 ${
                    sequenceError ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter gene sequence (e.g., ATCGTACAGT)"
                />
                {sequenceError && (
                  <p className="mt-1 text-sm text-red-400">{sequenceError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddSequence}
                disabled={!!sequenceError}
                className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  sequenceError 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Add Sequence
              </button>
            </div>
          </div>

          {comparisonData.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Sequences to Compare</h2>
              <ul className="space-y-2">
                {comparisonData.map(([gene, sequence], index) => (
                  <li key={index} className="text-gray-300">
                    <strong>{gene}:</strong> {sequence}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading || aiLoading || comparisonData.length === 0}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Comparing...' : aiLoading ? 'Generating Analysis...' : 'Compare Sequences'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 text-white rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            {/* Phenotype Chart */}
            <PhenotypeChart 
              phenotypeData={result} 
              title="Phenotype Probability Results" 
            />

            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Results</h2>
              <div className="space-y-4">
                {Object.entries(result).map(([phenotype, probability]) => (
                  <div key={phenotype} className="flex items-center justify-between">
                    <span className="text-gray-300">{phenotype}</span>
                    <span className="text-indigo-400 font-bold">
                      {Math.round(probability)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Analysis</h2>
              {aiLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                </div>
              ) : (
                <div 
                  className="text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              )}
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recommendations</h2>
              {aiLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                </div>
              ) : (
                <div 
                  className="text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: recommendations }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhenotypePredictor; 