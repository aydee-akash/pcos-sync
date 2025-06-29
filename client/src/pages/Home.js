import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Custom plugin for center text
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: function(chart) {
    const { ctx, chartArea } = chart;
    
    if (!chartArea) return;
    
    ctx.save();
    
    // Calculate center position
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw main number
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1,247', centerX, centerY - 8);
    
    // Draw subtitle
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Total', centerX, centerY + 8);
    ctx.fillText('Sequences', centerX, centerY + 20);
    
    ctx.restore();
  }
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  centerTextPlugin
);

const Home = () => {
  const { currentUser } = useAuth();
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  // Mock data for stats
  const statsData = {
    totalSequences: 1247,
    totalPredictions: 892,
    mostFrequentPhenotype: "Type A"
  };

  // Mock data for phenotype distribution pie chart
  const pieChartData = {
    labels: ['Type A - Classic PCOS', 'Type B - Ovulatory PCOS', 'Type C - Non-PCOS Hyperandrogenism', 'Type D - Normoandrogenic PCOS'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)', // Purple gradient start
          'rgba(59, 130, 246, 0.8)', // Blue gradient start
          'rgba(16, 185, 129, 0.8)', // Green gradient start
          'rgba(245, 158, 11, 0.8)', // Amber gradient start
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverOffset: 12,
        cutout: '65%',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Completely hide the default legend
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(147, 51, 234, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}% (${value.toLocaleString()} sequences)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2500,
      easing: 'easeOutCubic'
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 4
      }
    }
  };

  // Phenotype details for the info cards
  const phenotypeDetails = [
    {
      type: 'Type A',
      name: 'Classic PCOS',
      percentage: 40,
      description: 'Characterized by hyperandrogenism, ovulatory dysfunction, and polycystic ovaries',
      color: 'from-purple-500 via-purple-600 to-purple-700',
      gradient: 'from-purple-400/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      icon: '🧬'
    },
    {
      type: 'Type B',
      name: 'Ovulatory PCOS',
      percentage: 30,
      description: 'Features hyperandrogenism and polycystic ovaries with regular ovulation',
      color: 'from-blue-500 via-blue-600 to-blue-700',
      gradient: 'from-blue-400/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      icon: '⚡'
    },
    {
      type: 'Type C',
      name: 'Non-PCOS Hyperandrogenism',
      percentage: 20,
      description: 'Hyperandrogenism without polycystic ovaries or ovulatory dysfunction',
      color: 'from-emerald-500 via-emerald-600 to-emerald-700',
      gradient: 'from-emerald-400/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/30',
      icon: '🔬'
    },
    {
      type: 'Type D',
      name: 'Normoandrogenic PCOS',
      percentage: 10,
      description: 'Ovulatory dysfunction and polycystic ovaries without hyperandrogenism',
      color: 'from-amber-500 via-amber-600 to-amber-700',
      gradient: 'from-amber-400/20 to-amber-600/20',
      borderColor: 'border-amber-500/30',
      icon: '📊'
    }
  ];

  const timelineSteps = [
    {
      step: 1,
      title: "Enter Clinical Symptoms",
      description: "Input your PCOS clinical criteria including menstrual irregularities, hyperandrogenism, and polycystic ovaries",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      step: 2,
      title: "Upload Gene Sequence",
      description: "Provide your gene sequence data in standard format (A, T, C, G nucleotides)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      step: 3,
      title: "Run Prediction",
      description: "Our AI analyzes your data against our database of PCOS gene sequences",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      step: 4,
      title: "View Personalized Insights",
      description: "Get detailed phenotype predictions and personalized treatment recommendations",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Predict PCOS Phenotypes Using{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Gene Sequences
              </span>{' '}
              & Clinical Features
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering early diagnosis and personalized treatment through bioinformatics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={currentUser ? "/phenotype-predictor" : "/signup"}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Prediction
              </Link>
              <Link
                to={currentUser ? "/gene-sequence" : "/signup"}
                className="px-8 py-4 bg-transparent border-2 border-indigo-400 text-indigo-400 font-semibold rounded-lg hover:bg-indigo-400 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Upload Gene Data
              </Link>
            </div>
          </div>
        </div>
        
        {/* DNA Helix Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Gene Sequences</p>
                  <p className="text-3xl font-bold text-white mt-2">{statsData.totalSequences.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Predictions Run</p>
                  <p className="text-3xl font-bold text-white mt-2">{statsData.totalPredictions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Most Frequent Phenotype</p>
                  <p className="text-3xl font-bold text-white mt-2">{statsData.mostFrequentPhenotype}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phenotype Distribution Chart */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Phenotype Distribution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our database contains diverse PCOS phenotypes, each with unique genetic markers and clinical characteristics
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Pie Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl"></div>
                <div className="relative h-60">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                {pieChartData.labels.map((label, index) => {
                  const percentage = ((pieChartData.datasets[0].data[index] / pieChartData.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] }}
                      ></div>
                      <span className="text-white font-medium text-sm">
                        {label} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phenotype Details Cards */}
            <div className="space-y-6">
              {phenotypeDetails.map((phenotype, index) => (
                <div 
                  key={phenotype.type}
                  className={`bg-gradient-to-r ${phenotype.gradient} backdrop-blur-lg rounded-xl p-6 border ${phenotype.borderColor} hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${phenotype.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                      {phenotype.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{phenotype.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-white">{phenotype.percentage}%</span>
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${phenotype.color}`}></div>
                        </div>
                      </div>
                      <p className="text-gray-200 leading-relaxed mb-3">{phenotype.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 font-medium">{phenotype.type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${phenotype.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{ width: `${phenotype.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-300">
                            {Math.round((phenotype.percentage / 100) * 1247).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Most Common Gene</p>
                  <p className="text-2xl font-bold text-white mt-1">INSR</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-sm font-medium">Average Accuracy</p>
                  <p className="text-2xl font-bold text-white mt-1">94.2%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-700/10 backdrop-blur-lg rounded-xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm font-medium">Research Papers</p>
                  <p className="text-2xl font-bold text-white mt-1">156</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/40 to-amber-600/40 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {timelineSteps.map((step, index) => (
                <div key={step.step} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  
                  {/* Content card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-4">
                          <div className="text-indigo-400">
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Preview */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {isChatbotVisible && (
            <div className="absolute bottom-16 right-0 w-80 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">PCOSync Assistant</h3>
                <button
                  onClick={() => setIsChatbotVisible(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Need help understanding your gene data? I can help you interpret your results and explain the science behind PCOS phenotypes.
              </p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                  Start Chat
                </button>
                <button className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsChatbotVisible(!isChatbotVisible)}
            className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 