import * as AuthSession from 'expo-auth-session';

export const GITHUB_CLIENT_ID = 'Ov23lib0eVqumFOMqN0K';
export const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'github-details',
  useProxy: true,
});

export const GITHUB_CLIENT_SECRET = 'd1a1bbef9f0ede57098bfcfb712496869bf1ef28'; 

export const APPID = 24756;
export const APP_TOKEN = 'TeIZFKTM27RMXyHhYhzWBP';

export const SOCKET_SERVER_URL = 'http://localhost:3333';
export const BASE_URl = 'http://localhost:3333/'

// export const SOCKET_SERVER_URL = 'https://github-mobile-app-backend-production.up.railway.app';
// export const BASE_URl = 'https://github-mobile-app-backend-production.up.railway.app/'
