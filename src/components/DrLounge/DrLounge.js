import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostList from './PostList';
import CreatePost from './CreatePost';
import { supabase } from '../../supabaseClient';

const CATEGORIES = [
  'All Posts',
  'Compensation',
  'Career Advice',
  'Job Market',
  'Contract Review',
  'Clinical Practice',
  'Work-Life Balance',
];

const DrLounge = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Posts');

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession();
      setIsAuthenticated(!!session.data.session);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    // Implement sign in logic
  };

  const handleSignUp = async () => {
    // Implement sign up logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg 
                  className="w-6 h-6" 
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
                <span className="font-medium">Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">The Dr's Lounge</h1>
            </div>
            {!isAuthenticated && (
              <div className="flex gap-4">
                <button 
                  onClick={handleSignIn}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </button>
                <button
                  onClick={handleSignUp}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Categories/Filter Bar */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex gap-4 overflow-x-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Create Post Button */}
          {isAuthenticated && (
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <button 
                onClick={() => setShowCreatePost(true)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              >
                Share your thoughts...
              </button>
            </div>
          )}

          {/* Posts Feed */}
          <PostList 
            selectedCategory={selectedCategory}
            onShowSignupPrompt={() => setShowSignupPrompt(true)}
          />

          {/* Create Post Modal */}
          {showCreatePost && (
            <CreatePost
              onClose={() => setShowCreatePost(false)}
            />
          )}

          {/* Sign Up Prompt Modal */}
          {showSignupPrompt && !isAuthenticated && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Join the conversation</h3>
                <p className="text-gray-600 mb-6">
                  Sign up to join discussions, like posts, and connect with other physicians.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSignupPrompt(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Maybe later
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DrLounge; 