import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SalaryDashboard from './SalaryDashboard';
import SalarySubmissionForm from './components/SalarySubmissionForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalaryDashboard />} />
        <Route path="/submit-salary" element={<SalarySubmissionForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;