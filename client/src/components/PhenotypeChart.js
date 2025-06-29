import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PhenotypeChart = ({ phenotypeData, title = "Phenotype Probability Results" }) => {
  // Validate input data
  if (!phenotypeData || typeof phenotypeData !== 'object') {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 text-center">No phenotype data available</p>
      </div>
    );
  }

  // Prepare data for Chart.js
  const labels = Object.keys(phenotypeData);
  const data = Object.values(phenotypeData);

  // Define colors for each phenotype type
  const backgroundColors = [
    'rgba(59, 130, 246, 0.8)',   // Blue for typeA
    'rgba(16, 185, 129, 0.8)',   // Green for typeB
    'rgba(245, 158, 11, 0.8)',   // Yellow for typeC
    'rgba(239, 68, 68, 0.8)',    // Red for typeD
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',     // Blue border
    'rgba(16, 185, 129, 1)',     // Green border
    'rgba(245, 158, 11, 1)',     // Yellow border
    'rgba(239, 68, 68, 1)',      // Red border
  ];

  const chartData = {
    labels: labels.map(label => {
      // Convert phenotype labels to more readable format
      const labelMap = {
        'typeA': 'Type A',
        'typeB': 'Type B',
        'typeC': 'Type C',
        'typeD': 'Type D'
      };
      return labelMap[label] || label;
    }),
    datasets: [
      {
        label: 'Probability (%)',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Probability: ${context.parsed.y.toFixed(2)}%`;
          },
          title: function(context) {
            return `Phenotype ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Phenotype Types',
          color: '#d1d5db',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#d1d5db',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Probability (%)',
          color: '#d1d5db',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#d1d5db',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value + '%';
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        min: 0,
        max: 100,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Calculate total probability for validation
  const totalProbability = data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {totalProbability > 0 && (
          <p className="text-sm text-gray-400">
            Total probability: {totalProbability.toFixed(2)}%
          </p>
        )}
      </div>
      
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Summary table */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-white mb-3">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {labels.map((label, index) => (
            <div key={label} className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">{labelMap[label] || label}</div>
              <div className="text-lg font-bold text-white">{data[index].toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper object for label mapping
const labelMap = {
  'typeA': 'Type A',
  'typeB': 'Type B', 
  'typeC': 'Type C',
  'typeD': 'Type D'
};

export default PhenotypeChart; 