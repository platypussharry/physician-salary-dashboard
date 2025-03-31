import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [count, setCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch the actual count from Supabase
    const fetchCount = async () => {
      const { count: submissionCount } = await supabase
        .from('salary_submissions')
        .select('*', { count: 'exact', head: true });
      
      if (submissionCount) {
        setMaxCount(submissionCount);
        setCount(Math.max(0, submissionCount - 10)); // Start 10 below the max
      }
    };

    fetchCount();
  }, []);

  useEffect(() => {
    // Only start the counter if we have a valid maxCount
    if (maxCount > 0) {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= maxCount) return maxCount;
          return prev + 1;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [maxCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>SalaryDr - Physician Salary Transparency and Compensation Data</title>
        <meta name="description" content="Access real physician salary data across 30+ medical specialties. Compare compensation, view market rates, and make informed career decisions with anonymous salary insights." />
        <meta name="keywords" content="physician salary, doctor compensation, medical salaries, physician compensation data, doctor salary comparison, physician salary transparency" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="SalaryDr - Physician Salary Transparency" />
        <meta property="og:description" content="Access real physician salary data across 30+ medical specialties. Anonymous salary sharing platform for doctors." />
        <meta property="og:image" content="https://www.salarydr.com/og-image.jpg" />
        <meta property="og:url" content="https://www.salarydr.com" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.salarydr.com" />

        {/* Schema.org markup */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SalaryDr",
              "description": "Physician salary transparency and compensation data platform",
              "url": "https://www.salarydr.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.salarydr.com/dashboard?specialty={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Navigation */}
      <header>
        <nav className="w-full p-4 sm:p-6" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <Link 
                to="/" 
                className="text-[3rem] sm:text-[3.5rem] lg:text-[4rem] tracking-normal font-['Outfit'] flex-shrink-0"
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
      </header>

      {/* Main content */}
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32" aria-label="Hero section">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
              Salary Transparency
              <br />
              for Doctors
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Access real compensation data from {count.toLocaleString()}+ physician salary submissions across 30+ medical specialties.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                aria-label="View salary data dashboard"
              >
                View Salary Data
              </Link>
              <Link
                to="/submit-salary"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                aria-label="Submit your salary information"
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
        </section>

        {/* Why Salary Transparency Matters Section */}
        <section className="bg-white py-20" aria-label="Benefits of salary transparency">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
              Why Physician Salary Transparency Matters
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
        </section>

        {/* Features Section - New */}
        <section className="py-20 bg-gray-50" aria-label="Platform features">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
              Comprehensive Salary Insights
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Real-Time Data</h3>
                <p>Access up-to-date compensation data from practicing physicians across the United States.</p>
              </article>
              <article className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Specialty Breakdown</h3>
                <p>Compare salaries across different medical specialties, subspecialties, and practice settings.</p>
              </article>
              <article className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Geographic Analysis</h3>
                <p>Explore regional salary variations and compensation trends by state and region.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About SalaryDr</h3>
              <p className="text-gray-600">Empowering physicians with salary transparency and compensation insights.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2">
                  <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Salary Data</Link></li>
                  <li><Link to="/calculator" className="text-gray-600 hover:text-blue-600">Take Home Calculator</Link></li>
                  <li><Link to="/submit-salary" className="text-gray-600 hover:text-blue-600">Submit Salary</Link></li>
                </ul>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="https://twitter.com/salarydr" className="text-gray-600 hover:text-blue-600 block">Twitter/X</a>
                <a href="https://www.instagram.com/salarydr_/" className="text-gray-600 hover:text-blue-600 block">Instagram</a>
                <a href="https://www.tiktok.com/@salarydr" className="text-gray-600 hover:text-blue-600 block">TikTok</a>
                <a href="mailto:thesalarydr@gmail.com" className="text-gray-600 hover:text-blue-600 block">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} SalaryDr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 