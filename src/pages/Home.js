import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';

const FlipCard = ({ digit, isFlipping }) => {
  return (
    <div className="relative w-16 h-24 mx-1">
      <div className={`flip-card bg-gray-900 rounded-lg ${isFlipping ? 'animate-flip' : ''}`}>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
          {digit}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>
    </div>
  );
};

const Home = () => {
  const [count, setCount] = useState(2318); // Starting count
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Simulate counter updates
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 600);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Convert count to array of digits
  const digits = String(count).split('').map(Number);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="w-full p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-[3.5rem] tracking-normal font-['Outfit']"
          >
            <span className="text-[#4169E1] font-[400]">salary</span>
            <span className="text-[#E94E4A] font-[500]">Dr</span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-[#2D3748]">
              Salary Data
            </Link>
            <Link to="/calculator" className="text-xl font-semibold text-[#2D3748]">
              Take Home Pay Calculator
            </Link>
            <Link to="/faqs" className="text-xl font-semibold text-[#2D3748]">
              FAQs
            </Link>
            <Link
              to="/submit-salary"
              className="text-xl font-semibold px-6 py-3 bg-[#2D3748] text-white rounded-lg hover:bg-[#1A202C] transition-colors"
            >
              Add a Salary
            </Link>
          </div>
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

          {/* Counter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Physician Salary Submissions
            </h2>
            <div className="flex justify-center mb-4">
              {digits.map((digit, index) => (
                <FlipCard 
                  key={index} 
                  digit={digit} 
                  isFlipping={isFlipping && index === digits.length - 1}
                />
              ))}
            </div>
            <p className="text-gray-600">
              anonymous contributions and counting
            </p>
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

      {/* Animation Styles */}
      <style>{`
        @keyframes flip {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out;
          transform-origin: bottom;
        }
        .flip-card {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default Home; 