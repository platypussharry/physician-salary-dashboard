import React from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';

const TermsAndConditions = () => {
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions for salaryDr</h1>
        <div className="text-sm text-gray-600 mb-8">Last Updated: Jan 1, 2025</div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to SalaryDr! These Terms and Conditions govern your use of the SalaryDr website ("Website" or "Service"), an anonymous salary-sharing platform for physicians. By accessing or using SalaryDr, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Use of the Service</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>SalaryDr is a platform where users can anonymously share and view physician salary data.</li>
            <li>Users must be at least 18 years old to use this Website.</li>
            <li>You agree to use SalaryDr only for lawful purposes and in compliance with all applicable laws and regulations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. User-Generated Content & Data Ownership</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>By submitting salary data or any other content to SalaryDr, you grant us a perpetual, irrevocable, worldwide, royalty-free, and transferable license to use, reproduce, modify, distribute, and display the content for any purpose, including commercial use.</li>
            <li>SalaryDr owns the rights to all submitted data and may aggregate, analyze, republish, or monetize the data in the future.</li>
            <li>SalaryDr does not review, verify, or fact-check any submitted salary data. All content is provided "as-is" without guarantees of accuracy.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Privacy & Cookies</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>We may collect optional email addresses from users, but submission is not required to access the Website.</li>
            <li>SalaryDr uses cookies and tracking technologies (including those implemented by Wix, our hosting platform) to enhance user experience and analyze Website traffic. By using SalaryDr, you consent to our use of cookies.</li>
            <li>Please refer to our <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> for more details on how we collect and handle user data.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Changes to the Service & Future Monetization</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>SalaryDr is currently free to use. However, we reserve the right to introduce premium features, paid access, or other monetization strategies similar to platforms like Glassdoor in the future.</li>
            <li>We may modify, update, or discontinue any aspect of the Website at any time without prior notice.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimers & Limitation of Liability</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>SalaryDr does not verify the accuracy of salary submissions. Information on this Website is provided "as-is" and should not be relied upon for employment, financial, or professional decisions.</li>
            <li>We are not responsible for any inaccuracies, omissions, or consequences arising from the use of the Website.</li>
            <li>SalaryDr shall not be liable for any damages, including but not limited to indirect, incidental, or consequential damages arising from your use of the Service.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Prohibited Activities</h2>
          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Submit false, misleading, or defamatory salary information.</li>
            <li>Attempt to de-anonymize or identify any user who has submitted data.</li>
            <li>Use SalaryDr for spam, harassment, or any illegal activity.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Termination & Changes to These Terms</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>We reserve the right to suspend or terminate access to SalaryDr for any user who violates these Terms.</li>
            <li>SalaryDr may update these Terms at any time. Continued use of the Website after modifications constitutes acceptance of the revised Terms.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
          <p className="text-gray-700 mb-6">
            These Terms shall be governed by and interpreted in accordance with the laws of the United States.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:thesalarydr@gmail.com" className="text-blue-600 hover:text-blue-800">
              thesalarydr@gmail.com
            </a>.
          </p>
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

export default TermsAndConditions; 