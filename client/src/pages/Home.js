import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { currentUser } = useAuth();
  const [news, setNews] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch PCOS-related news
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=PCOS&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        const data = await response.json();
        setNews(data.articles.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    // Fetch PCOS tips
    const fetchTips = async () => {
      try {
        const response = await fetch('https://api.adviceslip.com/advice/search/PCOS');
        const data = await response.json();
        setTips(data.slips || []);
      } catch (error) {
        console.error('Error fetching tips:', error);
        // Fallback tips if API fails
        setTips([
          { advice: "Maintain a balanced diet and regular exercise routine" },
          { advice: "Monitor your symptoms and keep track of your menstrual cycle" },
          { advice: "Consult with healthcare professionals regularly" }
        ]);
      }
    };

    fetchNews();
    fetchTips();
    setLoading(false);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'PCOS Research Publications',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Welcome to <span className="text-indigo-500">PCOSync</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your advanced PCOS phenotype prediction platform. Analyze gene sequences and predict phenotypes with precision.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          {!currentUser ? (
            <div className="rounded-md shadow">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="rounded-md shadow">
              <Link
                to="/phenotype-predictor"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Start Predicting
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Research Trends Chart */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">PCOS Research Trends</h2>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* News and Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Latest News */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Latest PCOS News</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              news.map((article, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {article.description?.substring(0, 100)}...
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    Read more →
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">PCOS Management Tips</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              tips.map((tip, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-300">{tip.advice}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Gene Sequence Analysis</h3>
            <p className="text-gray-300">
              Add and analyze gene sequences with our advanced comparison algorithms.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Phenotype Prediction</h3>
            <p className="text-gray-300">
              Predict PCOS phenotypes based on genetic data and clinical criteria.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">History Tracking</h3>
            <p className="text-gray-300">
              Keep track of all your predictions and analyses in one place.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-16 bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4">About PCOSync</h2>
        <p className="text-gray-300 mb-4">
          PCOSync is a cutting-edge platform designed to help healthcare professionals and researchers analyze PCOS phenotypes through genetic data. Our advanced algorithms provide accurate predictions based on gene sequence analysis and clinical criteria.
        </p>
        <p className="text-gray-300">
          By combining genetic data with clinical observations, PCOSync helps in early diagnosis and personalized treatment strategies for PCOS patients.
        </p>
      </div>
    </div>
  );
};

export default Home; 