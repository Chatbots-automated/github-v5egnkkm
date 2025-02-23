import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '349983539029-2fio4otr5ju2sdkopqso7vmhu86vb61n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://candid-yeot-67ff85.netlify.app/auth/callback';

export const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the Google OAuth URL
export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
};

// Exchange code for tokens
export const getTokens = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};