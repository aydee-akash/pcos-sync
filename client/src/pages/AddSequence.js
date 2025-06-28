import React, { useState } from 'react';
import axios from 'axios';

const AddSequence = () => {
  const [formData, setFormData] = useState({
    geneName: '',
    sequence: '',
    cysts: 'N',
    irregularCycle: 'N',
    hyperandrogenism: 'N'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'geneName') {
      // Handle gene name dropdown
      if (value === 'custom') {
        setFormData(prev => ({
          ...prev,
          [name]: customGeneName
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'sequence') {
      // Validate sequence input
      const validSequence = /^[ATCGatcg\s]*$/.test(value);
      if (!validSequence && value !== '') {
        setSequenceError('Gene sequences can only contain letters A, T, C, G (case-insensitive)');
      } else {
        setSequenceError('');
      }
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCustomGeneChange = (e) => {
    const value = e.target.value;
    setCustomGeneName(value);
    setFormData(prev => ({
      ...prev,
      geneName: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate sequence before submission
    if (sequenceError) {
      alert('Please fix the sequence validation errors before submitting.');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/add-sequence', formData);
      alert('Sequence added successfully!');
      setFormData({
        geneName: '',
        sequence: '',
        cysts: 'N',
        irregularCycle: 'N',
        hyperandrogenism: 'N'
      });
      setCustomGeneName('');
      setSequenceError('');
    } catch (error) {
      console.error('Error adding sequence:', error);
      alert('Error adding sequence. Please try again.');
    }
  };

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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Gene Sequence</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">Gene Name</label>
            <Tooltip text="Genes like INS or FSHR are linked to PCOS. Choose a gene you're analyzing.">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Tooltip>
          </div>
          
          <div className="mt-1 space-y-2">
            <select
              name="geneName"
              value={pcosGenes.find(gene => gene.value === formData.geneName) ? formData.geneName : 'custom'}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {pcosGenes.map((gene, index) => (
                <option key={index} value={gene.value}>
                  {gene.label}
                </option>
              ))}
              <option value="custom">Custom gene name</option>
            </select>
            
            {(pcosGenes.find(gene => gene.value === formData.geneName) ? false : true) && (
              <input
                type="text"
                placeholder="Enter custom gene name"
                value={customGeneName}
                onChange={handleCustomGeneChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">Gene Sequence</label>
            <Tooltip text="Gene sequences are made up of A, T, C, G. Example: ATCGTACAGT">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Tooltip>
          </div>
          
          <textarea
            name="sequence"
            value={formData.sequence}
            onChange={handleChange}
            rows="4"
            placeholder="Enter gene sequence (e.g., ATCGTACAGT)"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              sequenceError ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {sequenceError && (
            <p className="mt-1 text-sm text-red-600">{sequenceError}</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Clinical Parameters</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="cysts"
              value={formData.cysts === 'Y' ? 'N' : 'Y'}
              checked={formData.cysts === 'Y'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Presence of cysts in ovaries</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="irregularCycle"
              value={formData.irregularCycle === 'Y' ? 'N' : 'Y'}
              checked={formData.irregularCycle === 'Y'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Irregular menstrual cycle</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hyperandrogenism"
              value={formData.hyperandrogenism === 'Y' ? 'N' : 'Y'}
              checked={formData.hyperandrogenism === 'Y'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Hyperandrogenism</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!!sequenceError}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            sequenceError 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Add Sequence
        </button>
      </form>
    </div>
  );
};

export default AddSequence; 