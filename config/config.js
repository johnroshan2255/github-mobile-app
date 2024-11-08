import * as AuthSession from 'expo-auth-session';

export const GITHUB_CLIENT_ID = 'Ov23lib0eVqumFOMqN0K';
export const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'github-details',
  useProxy: true,
});

console.log(REDIRECT_URI);


export const GITHUB_CLIENT_SECRET = 'd1a1bbef9f0ede57098bfcfb712496869bf1ef28';

export const SOCKET_URL = 'http://localhost:3333/';