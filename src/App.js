import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import { loadFonts } from './utils/fontLoader';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const SalaryDashboard = lazy(() => import('./pages/SalaryDashboard'));
const SubmitSalary = lazy(() => import('./pages/SubmitSalary'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const TakeHomePayCalculator = lazy(() => import('./pages/TakeHomePayCalculator'));
const AllSalaries = lazy(() => import('./pages/AllSalaries'));
const Feedback = lazy(() => import('./pages/Feedback'));

// Initialize GA4
ReactGA.initialize('G-642YJXJWZS');

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Route tracking component
function RouteTracker() {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Load fonts
    loadFonts();
    
    // Add performance mark
    if (window.performance) {
      window.performance.mark('app_loaded');
    }
  }, []);

  return (
    <Router>
      <RouteTracker />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<SalaryDashboard />} />
          <Route path="/submit-salary" element={<SubmitSalary />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/calculator" element={<TakeHomePayCalculator />} />
          <Route path="/all-salaries" element={<AllSalaries />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Suspense>
      <Analytics />
    </Router>
  );
}

export default App;