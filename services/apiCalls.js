import api from './api';

export const getData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getRepos = async (username) => {
  try {
    const response = await api.get(`/user/github/repos?username=${username}`);
    
    return response?.data?.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};


export const exchangeCodeForToken = async (code, redirect_uri) => {
  try {
    const response = await api.post('/auth/exchange-code', {
      code: code,
      redirect_uri: redirect_uri,
    });
  
    // const { access_token } = response.data;
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw new Error('Failed to exchange code for token.');
  }
};