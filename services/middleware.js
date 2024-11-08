import { redirectToHome } from './navigationService.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestInterceptor = async (config) => {
    try {
      const token = await AsyncStorage.getItem('githubAccessToken');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  };

  export const responseInterceptor = async (response) => {

    if (response.status === 403) {
      await AsyncStorage.removeItem('githubAccessToken');
      redirectToHome(); 
    }
  
    return response;
  };

export const errorInterceptor = async (error) => {
  if (error.response) {
    console.error(`Error: ${error.response.status}`, error.response.data);
  } else if (error.request) {
    console.error('Network error', error.request);
  } else {
    console.error('Error', error.message);
  }

  if (error.status === 403) {
    await AsyncStorage.removeItem('githubAccessToken');
    redirectToHome(); 
  }

  return Promise.reject(error);
};
