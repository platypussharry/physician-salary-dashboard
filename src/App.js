import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SalaryDashboard from './SalaryDashboard';
import SalarySubmissionForm from './components/SalarySubmissionForm';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SalaryDashboard />} />
        <Route path="/submit-salary" element={<SalarySubmissionForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;