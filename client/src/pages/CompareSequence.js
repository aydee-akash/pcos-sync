import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CompareSequence = () => {
  const [formData, setFormData] = useState({
    geneName: '',
    sequence: ''
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/compare-sequences', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error comparing sequences:', error);
      alert('Error comparing sequences. Please try again.');
    }
  };

  const chartData = results ? {
    labels: ['Type A', 'Type B', 'Type C', 'Type D'],
    datasets: [
      {
        label: 'Phenotype Probability (%)',
        data: [
          results.typeA,
          results.typeB,
          results.typeC,
          results.typeD
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'PCOS Phenotype Probability Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Compare Gene Sequence</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gene Name</label>
          <input
            type="text"
            name="geneName"
            value={formData.geneName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gene Sequence</label>
          <textarea
            name="sequence"
            value={formData.sequence}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Compare Sequence
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Type A</h3>
              <p className="text-2xl font-bold">{results.typeA.toFixed(2)}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Type B</h3>
              <p className="text-2xl font-bold">{results.typeB.toFixed(2)}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Type C</h3>
              <p className="text-2xl font-bold">{results.typeC.toFixed(2)}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Type D</h3>
              <p className="text-2xl font-bold">{results.typeD.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareSequence; 