import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
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
            <div className="block">
              <a 
                href="mailto:thesalarydr@gmail.com"
                className="text-[#2D3748] hover:text-blue-600 text-lg"
              >
                Contact Us
              </a>
              <span className="text-gray-500 text-base ml-2">
                (thesalarydr@gmail.com)
              </span>
            </div>
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
  );
};

export default Footer; 