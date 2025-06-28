import React, { useState } from 'react';
import { generatePhenotypeExplanation, generateRecommendations } from '../services/geminiService';

const TestGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Test with sample sequences
      const sampleSequence1 = "ATCGATCGATCG";
      const sampleSequence2 = "ATCGATCGATCG";
      const similarity = 1.0; // 100% similarity for testing

      // Test explanation generation
      const explanation = await generatePhenotypeExplanation(similarity, [sampleSequence1, sampleSequence2]);
      
      // Test recommendations generation
      const recommendations = await generateRecommendations(similarity, explanation);

      setResult({
        explanation,
        recommendations
      });
    } catch (err) {
      setError(err.message || 'Failed to connect to Gemini API');
      console.error('API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Gemini API Test</h2>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-900 text-white rounded-md">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Explanation:</h3>
            <div 
              className="text-gray-300 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: result.explanation }}
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Recommendations:</h3>
            <ul className="list-disc list-inside space-y-2">
              {result.recommendations.map((rec, index) => (
                <li 
                  key={index} 
                  className="text-gray-300"
                  dangerouslySetInnerHTML={{ __html: rec }}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestGemini; 