import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';

const Home = () => {
  const [count, setCount] = useState(2308); // Start at 2,308 (2,318 - 10)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate counter updates
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 2318) return 2318; // Stop at actual total
        return prev + 1;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="w-full p-4 sm:p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] tracking-normal font-['Outfit'] flex-shrink-0"
            >
              <span className="text-[#4169E1] font-[400]">salary</span>
              <span className="text-[#E94E4A] font-[500]">Dr</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 justify-end">
                <Link 
                  to="/dashboard" 
                  className="text-lg lg:text-xl font-semibold text-[#2D3748] whitespace-nowrap hover:text-blue-600 transition-colors"
                >
                  Salary Data
                </Link>
                <Link 
                  to="/calculator" 
                  className="text-lg lg:text-xl font-semibold text-[#2D3748] whitespace-nowrap hover:text-blue-600 transition-colors"
                >
                  Take Home Pay Calculator
                </Link>
                <Link
                  to="/submit-salary"
                  className="text-lg lg:text-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap ml-2 lg:ml-4"
                >
                  Add a Salary
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/dashboard" 
                  className="text-lg font-semibold text-[#2D3748] hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Salary Data
                </Link>
                <Link 
                  to="/calculator" 
                  className="text-lg font-semibold text-[#2D3748] hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Take Home Pay Calculator
                </Link>
                <Link
                  to="/submit-salary"
                  className="text-lg font-semibold px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add a Salary
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
            Salary Transparency
            <br />
            for Doctors
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Know your worth. Anonymous salary sharing for physicians.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              View Salary Data
            </Link>
            <Link
              to="/submit-salary"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Submit Your Salary
            </Link>
          </div>

          {/* Social Proof Section */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto mb-16">
            {/* Submissions Counter */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3">
                {count.toLocaleString()}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Salary Submissions
              </h3>
              <p className="text-sm text-gray-600">
                and counting
              </p>
            </div>

            {/* Specialties Coverage */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3">
                30+
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Medical Specialties
              </h3>
              <p className="text-sm text-gray-600 text-center">
                comprehensive salary data across specialties
              </p>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3">
                5.5K+
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Community Members
              </h3>
              <p className="text-sm text-gray-600 text-center">
                following us on social media
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-blue-50 rounded-xl p-4 max-w-3xl mx-auto mb-16 flex items-center justify-center gap-3">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-800 font-medium">
              Trusted by physicians nationwide for anonymous salary insights
            </p>
          </div>
        </div>
      </div>

      {/* Why Salary Transparency Matters Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
            Why Salary Transparency Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Medical School Debt */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">$250K+</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Average Medical School Debt</h3>
              <p className="text-gray-600">With rising education costs, salary transparency helps physicians make informed decisions about their financial future and career path.</p>
            </div>

            {/* Gender Pay Gap */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">25%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gender Pay Gap</h3>
              <p className="text-gray-600">Transparency helps identify and address pay disparities, ensuring fair compensation regardless of gender or background.</p>
            </div>

            {/* Career Satisfaction */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">85%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Satisfaction</h3>
              <p className="text-gray-600">Physicians who feel fairly compensated report higher job satisfaction and better work-life balance.</p>
            </div>

            {/* Negotiation Power */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">40%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Negotiation Success Rate</h3>
              <p className="text-gray-600">Access to market data increases successful salary negotiations and helps physicians advocate for fair compensation.</p>
            </div>

            {/* Specialty Choice */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">60%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Better Career Decisions</h3>
              <p className="text-gray-600">Salary transparency helps medical students and residents make more informed decisions about their specialty choice.</p>
            </div>

            {/* Practice Setting */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">3x</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Salary Variation</h3>
              <p className="text-gray-600">Compensation can vary significantly between practice settings. Transparency helps physicians find the right fit.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-xl text-gray-700 mb-6">
              Join thousands of physicians who are making salary transparency a reality
            </p>
            <Link
              to="/submit-salary"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Share Your Salary
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">100% Anonymous</h3>
              <p className="text-gray-600">Your identity is always protected. Share freely without concern.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Insights</h3>
              <p className="text-gray-600">Access up-to-date salary data across specialties and locations.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2">Empower Decisions</h3>
              <p className="text-gray-600">Make informed career choices with comprehensive salary data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Legal Links */}
            <div className="space-y-2">
              <Link to="/privacy-policy" className="block text-[#2D3748] hover:text-blue-600 text-lg">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-[#2D3748] hover:text-blue-600 text-lg">
                Terms and Conditions
              </Link>
              <a 
                href="mailto:thesalarydr@gmail.com"
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                Contact Us
              </a>
            </div>
            
            {/* Social Links */}
            <div className="space-y-2">
              <a 
                href="https://www.instagram.com/salarydr_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                Instagram
              </a>
              <a 
                href="https://x.com/salarydr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                X/Twitter
              </a>
              <a 
                href="https://www.tiktok.com/@salarydr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-[#2D3748] text-lg">© 2025 All Rights Reserved by salaryDr.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 