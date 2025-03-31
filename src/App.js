import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import './App.css';
import SalaryDashboard from './pages/SalaryDashboard';
import SubmitSalary from './pages/SubmitSalary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Home from './pages/Home';
import TakeHomePayCalculator from './pages/TakeHomePayCalculator';
import AllSalaries from './pages/AllSalaries';
import Feedback from './pages/Feedback';

// Initialize GA4
ReactGA.initialize('G-642YJXJWZS');

// Route tracking component
function RouteTracker() {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <RouteTracker />
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
    </Router>
  );
}

export default App;