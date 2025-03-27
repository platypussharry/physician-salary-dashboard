// wixClient.js
import { items } from '@wix/data';
import { createClient, OAuthStrategy } from '@wix/sdk';

// Retrieve client ID from environment variables
const clientId = process.env.REACT_APP_WIX_CLIENT_ID;

if (!clientId) {
  throw new Error('Missing Wix Client ID in environment variables. Please set REACT_APP_WIX_CLIENT_ID.');
}

// Initialize the Wix client
const myWixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({
    clientId,
  }),
});

export default myWixClient;