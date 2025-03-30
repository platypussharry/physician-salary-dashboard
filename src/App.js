import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SalaryDashboard from './pages/SalaryDashboard';
import SubmitSalary from './pages/SubmitSalary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Home from './pages/Home';
import TakeHomePayCalculator from './pages/TakeHomePayCalculator';
import AllSalaries from './pages/AllSalaries';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SalaryDashboard />} />
        <Route path="/submit-salary" element={<SubmitSalary />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/calculator" element={<TakeHomePayCalculator />} />
        <Route path="/all-salaries" element={<AllSalaries />} />
      </Routes>
    </Router>
  );
}

export default App;