import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [recentSequences, setRecentSequences] = useState([]);
  const [recentPhenotypes, setRecentPhenotypes] = useState([]);

  useEffect(() => {
    if (userProfile) {
      setRecentSequences(userProfile.geneSequences?.slice(-3).reverse() || []);
      setRecentPhenotypes(userProfile.phenotypeHistory?.slice(-3).reverse() || []);
    }
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.firstName}!</h1>
          <p className="mt-2 text-gray-600">Here's an overview of your recent activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/add-sequence"
                  className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition duration-150"
                >
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Add New Sequence</h3>
                    <p className="text-sm text-gray-500">Upload a new gene sequence for analysis</p>
                  </div>
                </Link>
                <Link
                  to="/compare-sequence"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-150"
                >
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Compare Sequences</h3>
                    <p className="text-sm text-gray-500">Analyze and compare gene sequences</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Phenotype Predictions</h2>
                <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-500">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentPhenotypes.length > 0 ? (
                  recentPhenotypes.map((phenotype, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Type {phenotype.type}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(phenotype.recordedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.round(phenotype.probability * 100)}% match
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent phenotype predictions</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Gene Sequences</h2>
              <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentSequences.length > 0 ? (
                recentSequences.map((sequence, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{sequence.geneName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(sequence.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {sequence.sequence.length} base pairs
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent gene sequences</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 