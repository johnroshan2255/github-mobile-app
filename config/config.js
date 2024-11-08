import * as AuthSession from 'expo-auth-session';

export const GITHUB_CLIENT_ID = 'Ov23lib0eVqumFOMqN0K';
export const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'github-details',
  useProxy: true,
});

export const GITHUB_CLIENT_SECRET = 'd1a1bbef9f0ede57098bfcfb712496869bf1ef28'; 

export const SOCKET_SERVER_URL = 'http://localhost:8081/socket.io';
export const BASE_URl = 'http://192.168.29.79:3334/'