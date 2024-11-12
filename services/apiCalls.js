import api from './api';
import { APPID, APP_TOKEN } from '@/config/config';
import axios from 'axios';

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

export const getCommits = async (username, repo) => {
  try {
    const response = await api.get(`/user/github/commits?username=${username}&repo=${repo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commits from API', error);
    throw new Error('Error fetching commits from API.');
  }
}

export const getChartData = async (username) => {
  try {
    const response = await api.get(`/user/github/activity?username=${username}`);
    
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching activities from API', error);
    throw new Error('Error fetching activities from API.');
  }
}

export const sendNotification = async (title, body, dateSent, pushData, bigPictureURL) => {
  try {
    const response = await axios.post('https://app.nativenotify.com/api/notification',{
      appId: APPID,
      appToken: APP_TOKEN,
      title: title,
      body: body,
      dateSent: dateSent,
      pushData: pushData,
      bigPictureURL: bigPictureURL
    });
  } catch (error) {
    console.error('Error sending notification', error);
    throw new Error('Error sending notification.');
  }
}

export const createEvents = async (events, selectedRepo, webhookUrl, username) => {
  try {
    const response = await api.post('/user/github/create/events', {
      repoOwner: username,
      repoName: selectedRepo,
      webhookUrl: webhookUrl,
      events: events,
    });
  
    // const { access_token } = response.data;
    return response.data;
  } catch (error) {
    console.error('Error creating hook:', error);
    throw new Error('Failed create hook.');
  }
};

export const getCommitsDiff = async (username, repo, sha) => {
  try {
    const response = await api.get(`/user/github/commits/diff?username=${username}&repo=${repo}&sha=${sha}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commits difference from API', error);
    throw new Error('Error fetching commits difference from API.');
  }
}

export const getUserProfileDetails = async (username) => {
  try {
    const response = await api.get(`/user/github/user/details?username=${username}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching user details from API', error);
    throw new Error('Error fetching user details from API.');
  }
}

export const getUserContributions = async (username) => {
  try {
    const response = await api.get(`/user/github/contributions?username=${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details from API', error);
    throw new Error('Error fetching user details from API.');
  }
}