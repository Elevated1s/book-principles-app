// googleSheetsService.js - Google Sheets Integration Service with OAuth2

// Google OAuth2 configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_NAME = process.env.REACT_APP_SHEET_NAME || 'Users';

// OAuth2 scopes needed for Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Debug: Log configuration on module load
console.log('=== GOOGLE OAUTH2 CONFIGURATION DEBUG ===');
console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
console.log('REACT_APP_SPREADSHEET_ID:', SPREADSHEET_ID ? 'Present' : 'Missing');
console.log('Client ID length:', GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.length : 0);
console.log('Spreadsheet ID length:', SPREADSHEET_ID ? SPREADSHEET_ID.length : 0);
console.log('========================================');

// Google OAuth2 client
let googleAuthClient = null;
let isInitializing = false;

// Initialize Google OAuth2 client
const initializeGoogleAuth = async () => {
  if (isInitializing) {
    console.log('Google Auth already initializing, waiting...');
    return;
  }
  
  if (googleAuthClient) {
    console.log('Google Auth already initialized');
    return;
  }

  isInitializing = true;
  console.log('Initializing Google OAuth2...');

  try {
    console.log('Step 1: Waiting for Google API to be available...');
    // Wait for Google API to be available
    await new Promise((resolve) => {
      if (window.gapi && window.gapi.auth2) {
        console.log('Google API already available, proceeding...');
        resolve();
      } else {
        console.log('Google API not available yet, waiting for load event...');
        window.addEventListener('load', () => {
          console.log('Load event fired, waiting 1 second...');
          setTimeout(() => {
            console.log('Timeout completed, checking if gapi is available...');
            resolve();
          }, 1000);
        });
      }
    });

    console.log('Step 2: Checking if gapi.auth2 is available...');
    if (!window.gapi || !window.gapi.auth2) {
      console.log('gapi.auth2 still not available, waiting a bit more...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('Step 3: Starting gapi.auth2.init...');
    // Initialize the auth client
    await new Promise((resolve, reject) => {
      console.log('Loading auth2 module...');
      
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('OAuth2 initialization timed out after 10 seconds'));
      }, 10000);
      
      window.gapi.load('auth2', () => {
        console.log('auth2 module loaded, initializing...');
        window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES.join(' ')
        }).then((auth2) => {
          console.log('gapi.auth2.init completed successfully');
          clearTimeout(timeout);
          googleAuthClient = auth2;
          console.log('Google OAuth2 client initialized successfully');
          resolve();
        }).catch((error) => {
          console.error('Error in gapi.auth2.init:', error);
          clearTimeout(timeout);
          reject(error);
        });
      });
    });

    console.log('Step 4: OAuth2 initialization completed successfully');
    isInitializing = false;
  } catch (error) {
    console.error('Failed to initialize Google OAuth2 with method 1:', error);
    
    // Try fallback method
    console.log('Trying fallback initialization method...');
    try {
      await initializeGoogleAuthFallback();
      isInitializing = false;
    } catch (fallbackError) {
      console.error('Fallback initialization also failed:', fallbackError);
      isInitializing = false;
      throw fallbackError;
    }
  }
};

// Fallback initialization method
const initializeGoogleAuthFallback = async () => {
  console.log('Using fallback OAuth2 initialization...');
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Fallback OAuth2 initialization timed out'));
    }, 15000);
    
    try {
      // Try to initialize with a simpler approach
      if (window.gapi && window.gapi.auth2) {
        window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES.join(' ')
        }).then((auth2) => {
          console.log('Fallback OAuth2 initialization successful');
          clearTimeout(timeout);
          googleAuthClient = auth2;
          resolve();
        }).catch((error) => {
          console.error('Fallback OAuth2 initialization failed:', error);
          clearTimeout(timeout);
          reject(error);
        });
      } else {
        clearTimeout(timeout);
        reject(new Error('Google API not available for fallback'));
      }
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
};

// Load Google API
const loadGoogleAPI = async () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }

    if (window.gapi && window.gapi.auth2) {
      console.log('Google API already loaded');
      resolve();
      return;
    }

    console.log('Loading Google API...');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      console.log('Google API script loaded');
      
      // Wait a bit for the API to initialize
      setTimeout(() => {
        console.log('Checking if gapi is available after script load...');
        console.log('window.gapi exists:', !!window.gapi);
        if (window.gapi) {
          console.log('gapi object properties:', Object.keys(window.gapi));
        }
        resolve();
      }, 1000);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google API script'));
    };
    document.head.appendChild(script);
  });
};

// Check if user is authenticated
const isAuthenticated = () => {
  return googleAuthClient && googleAuthClient.isSignedIn.get();
};

// Test Google API availability
export const testGoogleAPI = async () => {
  try {
    console.log('Testing Google API availability...');
    console.log('window.gapi exists:', !!window.gapi);
    console.log('window.gapi.auth2 exists:', !!(window.gapi && window.gapi.auth2));
    
    if (window.gapi) {
      console.log('Google API is available');
      return true;
    } else {
      console.log('Google API is not available');
      return false;
    }
  } catch (error) {
    console.error('Error testing Google API:', error);
    return false;
  }
};

// Sign in user
const signInUser = async () => {
  try {
    console.log('Attempting to sign in user...');
    
    // Ensure Google API is loaded
    await loadGoogleAPI();
    
    // Ensure Google Auth is initialized
    await initializeGoogleAuth();
    
    if (!googleAuthClient) {
      throw new Error('Google Auth client not initialized');
    }
    
    if (!isAuthenticated()) {
      console.log('User not authenticated, showing sign-in prompt...');
      const user = await googleAuthClient.signIn();
      console.log('User signed in successfully:', user.getBasicProfile().getName());
      return true;
    }
    
    console.log('User already authenticated');
    return true;
  } catch (error) {
    console.error('Error signing in user:', error);
    return false;
  }
};

// Get access token
const getAccessToken = () => {
  if (googleAuthClient && isAuthenticated()) {
    return googleAuthClient.currentUser.get().getAuthResponse().access_token;
  }
  return null;
};

// Store user data in Google Sheets using OAuth2
export const storeUserInGoogleSheets = async (userData) => {
  console.log('storeUserInGoogleSheets called with:', userData);
  console.log('GOOGLE_CLIENT_ID exists:', !!GOOGLE_CLIENT_ID);
  console.log('SPREADSHEET_ID exists:', !!SPREADSHEET_ID);
  
  try {
    // Check if Google OAuth2 is configured
    if (!GOOGLE_CLIENT_ID || !SPREADSHEET_ID) {
      console.log('Google OAuth2 not configured, skipping user storage');
      console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
      console.log('Spreadsheet ID:', SPREADSHEET_ID ? 'Present' : 'Missing');
      return { success: false, message: 'Google OAuth2 not configured' };
    }

    // Ensure user is authenticated
    if (!isAuthenticated()) {
      console.log('User not authenticated, attempting to sign in...');
      const signedIn = await signInUser();
      if (!signedIn) {
        return { success: false, message: 'Failed to authenticate with Google' };
      }
    }

    const { name, email, uid, signupMethod, timestamp } = userData;
    
    // Prepare the data for Google Sheets
    const rowData = [
      timestamp || new Date().toISOString(),
      name || 'N/A',
      email || 'N/A',
      uid || 'N/A',
      signupMethod || 'email',
      'Active'
    ];

    // Get access token
    const accessToken = getAccessToken();
    if (!accessToken) {
      return { success: false, message: 'No access token available' };
    }

    // Google Sheets API endpoint with OAuth2
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    
    console.log('Making authenticated request to Google Sheets API');
    console.log('Sending data:', { name, email, uid, signupMethod, timestamp: timestamp || new Date().toISOString() });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData]
      })
    });
    
    console.log('Google Sheets API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error response:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('User data stored in Google Sheets:', result);
    return { success: true, message: 'User data stored successfully' };
    
  } catch (error) {
    console.error('Error storing user in Google Sheets:', error);
    return { success: false, message: `Failed to store user data: ${error.message}` };
  }
};

// Check if Google OAuth2 is configured
export const isGoogleSheetsConfigured = () => {
  return !!(GOOGLE_CLIENT_ID && SPREADSHEET_ID);
};

// Get Google OAuth2 configuration status
export const getGoogleSheetsStatus = () => {
  if (!GOOGLE_CLIENT_ID) {
    return {
      configured: false,
      message: 'Google OAuth2 Client ID not configured',
      details: 'Add REACT_APP_GOOGLE_CLIENT_ID to your .env file'
    };
  }
  
  if (!SPREADSHEET_ID) {
    return {
      configured: false,
      message: 'Spreadsheet ID not configured',
      details: 'Add REACT_APP_SPREADSHEET_ID to your .env file'
    };
  }
  
  return {
    configured: true,
    message: 'Google OAuth2 integration ready',
    details: 'User signup data will be automatically stored via Google Sheets API with OAuth2'
  };
};

// Initialize Google Auth when module loads
if (typeof window !== 'undefined') {
  // Load Google API when the component mounts
  window.addEventListener('load', () => {
    console.log('Window loaded, initializing Google API...');
    setTimeout(() => {
      loadGoogleAPI().then(() => {
        console.log('Google API loaded successfully');
      }).catch((error) => {
        console.error('Failed to load Google API:', error);
      });
    }, 1000);
  });
}
