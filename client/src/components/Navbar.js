import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <svg className="relative h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
                  PCOSync
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/gene-sequence"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/gene-sequence') 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                  }`}
                >
                  Add Sequence
                </Link>
                <Link
                  to="/phenotype-predictor"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/phenotype-predictor') 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                  }`}
                >
                  Predictor
                </Link>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/profile') 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                  }`}
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/login') 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-sm border-t border-gray-700/50">
          <Link
            to="/"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
            }`}
          >
            Home
          </Link>
          <Link
            to="/gene-sequence"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              isActive('/gene-sequence') 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
            }`}
          >
            Add Sequence
          </Link>
          <Link
            to="/phenotype-predictor"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              isActive('/phenotype-predictor') 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
            }`}
          >
            Predictor
          </Link>
          <Link
            to="/profile"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              isActive('/profile') 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
            }`}
          >
            Profile
          </Link>
          {currentUser ? (
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Logout
            </button>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/login') 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 