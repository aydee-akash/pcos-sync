import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GeneSequence from './pages/GeneSequence';
import PhenotypePredictor from './pages/PhenotypePredictor';
import History from './pages/History';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import TestGemini from './components/TestGemini';
import DummyDataUploader from './components/DummyDataUploader';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <DummyDataUploader />
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/gene-sequence"
                element={
                  <PrivateRoute>
                    <GeneSequence />
                  </PrivateRoute>
                }
              />
              <Route
                path="/phenotype-predictor"
                element={
                  <PrivateRoute>
                    <PhenotypePredictor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/test-gemini" element={<TestGemini />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 