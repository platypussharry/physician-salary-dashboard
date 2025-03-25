// wixClient.js
import { items } from '@wix/data';
import { createClient, OAuthStrategy } from '@wix/sdk';

// Retrieve client ID from environment variables
const clientId = process.env.REACT_APP_WIX_CLIENT_ID;

// Log the client ID for debugging
console.log('Client ID from environment:', clientId);

if (!clientId) {
  console.warn(
    'Missing Wix Client ID in environment variables. Falling back to hardcoded value for local testing.'
  );
}

// Initialize the Wix client
const myWixClient = createClient({
  modules: { items }, // Include the items module for querying data
  auth: OAuthStrategy({
    clientId: clientId || 'e4a69ced-7979-4ff0-9aed-dc436a08003b', // Fallback for local testing
  }),
});

// Debug logs to verify the client and its methods
console.log('Wix client initialized with Client ID:', clientId || 'e4a69ced-7979-4ff0-9aed-dc436a08003b');
console.log('Wix client:', myWixClient);
console.log('Wix client items module:', myWixClient.items);
console.log('Wix client queryDataItems method:', myWixClient.items.queryDataItems);
console.log('Is queryDataItems a function?', typeof myWixClient.items.queryDataItems === 'function');

// Export the client
export default myWixClient;