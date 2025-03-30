import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SalaryDashboard from './SalaryDashboard';
import SalarySubmissionForm from './components/SalarySubmissionForm';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Home from './pages/Home';
import TakeHomePayCalculator from './pages/TakeHomePayCalculator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SalaryDashboard />} />
        <Route path="/submit-salary" element={<SalarySubmissionForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/calculator" element={<TakeHomePayCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;