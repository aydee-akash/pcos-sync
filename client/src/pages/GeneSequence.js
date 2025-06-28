import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { determinePhenotype } from '../utils/sequenceUtils';

const GeneSequence = () => {
  const { currentUser, addGeneSequence } = useAuth();
  const [geneName, setGeneName] = useState('');
  const [sequence, setSequence] = useState('');
  const [criteriaA, setCriteriaA] = useState('');
  const [criteriaB, setCriteriaB] = useState('');
  const [criteriaC, setCriteriaC] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      setGeneName('custom');
    } else {
      setGeneName(value);
    }
  };

  const handleCustomGeneChange = (e) => {
    const value = e.target.value;
    setCustomGeneName(value);
    setGeneName(value);
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
    setSequence(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!geneName || !sequence || !criteriaA || !criteriaB || !criteriaC) {
        throw new Error('Please fill in all fields');
      }

      if (criteriaA !== 'Y' && criteriaA !== 'N' ||
          criteriaB !== 'Y' && criteriaB !== 'N' ||
          criteriaC !== 'Y' && criteriaC !== 'N') {
        throw new Error('Criteria must be either Y or N');
      }

      // Validate sequence before submission
      if (sequenceError) {
        throw new Error('Please fix the sequence validation errors before submitting.');
      }

      const phenotype = determinePhenotype(criteriaA, criteriaB, criteriaC);
      if (!phenotype) {
        throw new Error('Invalid combination of criteria');
      }

      await addGeneSequence(currentUser.uid, {
        geneName,
        sequence: sequence.toUpperCase(),
        phenotype,
        criteria: {
          a: criteriaA,
          b: criteriaB,
          c: criteriaC
        },
        timestamp: new Date().toISOString()
      });

      setSuccess('Gene sequence added successfully');
      setGeneName('');
      setSequence('');
      setCriteriaA('');
      setCriteriaB('');
      setCriteriaC('');
      setCustomGeneName('');
      setSequenceError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Add Gene Sequence</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={pcosGenes.find(gene => gene.value === geneName) ? geneName : 'custom'}
                onChange={handleGeneNameChange}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                {pcosGenes.map((gene, index) => (
                  <option key={index} value={gene.value}>
                    {gene.label}
                  </option>
                ))}
                <option value="custom">Custom gene name</option>
              </select>
              
              {geneName === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom gene name"
                  value={customGeneName}
                  onChange={handleCustomGeneChange}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  required
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
              value={sequence}
              onChange={handleSequenceChange}
              className={`w-full h-32 bg-gray-700 text-white rounded px-3 py-2 ${
                sequenceError ? 'border-2 border-red-500' : ''
              }`}
              placeholder="Enter gene sequence (e.g., ATCGTACAGT)"
              required
            />
            {sequenceError && (
              <p className="mt-1 text-sm text-red-400">{sequenceError}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">PCOS Diagnostic Criteria</h3>
              <Tooltip text="PCOS is diagnosed when at least 2 out of 3 criteria are present. Select the criteria that apply to your case.">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </Tooltip>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="Y"
                    checked={criteriaA === 'Y'}
                    onChange={(e) => setCriteriaA(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-300 font-medium cursor-pointer" onClick={() => setCriteriaA(criteriaA === 'Y' ? 'N' : 'Y')}>
                    Cysts in ovaries seen in ultrasound scan
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Multiple small cysts (≥12 follicles) in one or both ovaries, or increased ovarian volume
                  </p>
                </div>
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="N"
                    checked={criteriaA === 'N'}
                    onChange={(e) => setCriteriaA(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="Y"
                    checked={criteriaB === 'Y'}
                    onChange={(e) => setCriteriaB(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-300 font-medium cursor-pointer" onClick={() => setCriteriaB(criteriaB === 'Y' ? 'N' : 'Y')}>
                    Irregular menstrual cycle
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Cycles longer than 35 days, fewer than 8 cycles per year, or absence of menstruation
                  </p>
                </div>
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="N"
                    checked={criteriaB === 'N'}
                    onChange={(e) => setCriteriaB(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="Y"
                    checked={criteriaC === 'Y'}
                    onChange={(e) => setCriteriaC(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-300 font-medium cursor-pointer" onClick={() => setCriteriaC(criteriaC === 'Y' ? 'N' : 'Y')}>
                    Hyperandrogenism
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Elevated male hormones causing acne, excess facial/body hair, or male-pattern baldness
                  </p>
                </div>
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="N"
                    checked={criteriaC === 'N'}
                    onChange={(e) => setCriteriaC(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!sequenceError}
            className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${
              sequenceError 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Adding...' : 'Add Sequence'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900 text-white rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-900 text-white rounded-md">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneSequence; 