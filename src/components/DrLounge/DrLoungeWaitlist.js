import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const DrLoungeWaitlist = () => {
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('drlounge_waitlist')
        .insert([
          {
            email,
            specialty,
            signup_date: new Date().toISOString(),
          }
        ]);

      if (error) throw error;
      setSubmitted(true);
      setEmail('');
      setSpecialty('');
    } catch (err) {
      setError(err.message === 'duplicate key value violates unique constraint "drlounge_waitlist_email_key"'
        ? 'This email is already on the waitlist!'
        : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full p-4 sm:p-6 bg-white shadow-sm">
        <nav className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-[2rem] sm:text-[2.5rem] tracking-normal font-['Outfit'] flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <span className="text-[#4169E1] font-[400]">salary</span>
              <span className="text-[#E94E4A] font-[500]">Dr</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span className="font-medium">Back to Main Site</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">The Dr's Lounge</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            A private community for physicians to discuss compensation, share experiences, and connect with colleagues.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Anonymous Discussions</h2>
                <p className="mt-2 text-gray-600">Share experiences and insights without revealing your identity.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Salary Insights</h2>
                <p className="mt-2 text-gray-600">Get real compensation data and negotiation strategies.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Physician Network</h2>
                <p className="mt-2 text-gray-600">Connect with colleagues across specialties and locations.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Private & Secure</h2>
                <p className="mt-2 text-gray-600">Your privacy is our top priority. All discussions are protected.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {submitted ? 'Thanks for joining the waitlist!' : 'Join the Waitlist'}
            </h3>
            
            {submitted ? (
              <div className="text-gray-600">
                <p>We'll notify you as soon as The Dr's Lounge is ready. In the meantime, check out our salary data and take-home pay calculator!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                    Specialty (Optional)
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Internal Medicine"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p className="text-sm">
            By joining the waitlist, you'll be among the first to access The Dr's Lounge when it launches.
            <br />
            We'll never share your email address with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrLoungeWaitlist; 