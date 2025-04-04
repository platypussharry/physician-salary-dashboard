// Create a file called WixAuth.js

import React from 'react';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Get environment variables
const clientId = process.env.REACT_APP_WIX_CLIENT_ID;
const redirectUrl = process.env.REACT_APP_WIX_REDIRECT_URL;

if (!clientId || !redirectUrl) {
  throw new Error('Missing required environment variables. Please set REACT_APP_WIX_CLIENT_ID and REACT_APP_WIX_REDIRECT_URL.');
}

// Function to handle login
function initiateLogin() {
  const client = createClient({
    auth: OAuthStrategy({ clientId })
  });
  
  // Use environment variable for redirect URL
  client.auth.logIn({
    redirectUrl
  });
}

// Login Button Component
export function WixLoginButton() {
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={initiateLogin}
    >
      Login with Wix
    </button>
  );
}

// Callback Handler Component
export function WixCallback() {
  const [status, setStatus] = React.useState('Processing...');

  React.useEffect(() => {
    async function handleCallback() {
      try {
        const client = createClient({
          auth: OAuthStrategy({ clientId })
        });
        
        // This will extract the token from the URL and complete the auth flow
        const tokens = await client.auth.handleOAuthCallback();
        console.log('Authentication successful!');
        
        // Store tokens if needed
        localStorage.setItem('wixTokens', JSON.stringify(tokens));
        
        setStatus('Login successful! Redirecting...');
        
        // Redirect to main page
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus(`Error: ${error.message}`);
      }
    }
    
    handleCallback();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Wix Authentication</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}