import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, REDIRECT_URI } from '../config/config.js';
import Button from '@/components/button.jsx';

function useGitHubLogin() {
  const [accessToken, setAccessToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // const [request, response, promptAsync] = AuthSession.useAuthRequest(
  //   {
  //     clientId: GITHUB_CLIENT_ID,
  //     redirectUri: REDIRECT_URI,
  //     scopes: ['read:user'],
  //     usePKCE: true,
  //   },
  //   {}
  // );

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
   };
   
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["identity", "user:email", "user:follow"],
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('githubAccessToken');
        if (storedToken) {
          setAccessToken(storedToken);
          return;
        }

        // If there's no stored token, check the response from the authentication flow
        if (response?.type === 'success') {
          const { authentication } = response;
          if (authentication?.accessToken) {
            // Exchange the code for an access token
            const token = await exchangeCodeForToken(authentication.code);
            setAccessToken(token);
            await AsyncStorage.setItem('githubAccessToken', token);
          }
        }
      } catch (error) {
        console.error('Error during GetAccessToken:', error);
        setErrorMessage('Failed to authenticate with GitHub. Please try again later.');
      }
    };

    getAccessToken();
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const { access_token } = await tokenResponse.json();
      return access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setErrorMessage('Failed to exchange code for token.');
    }
  };

  const handleGitHubLogin = async () => {
    try {
      if (request) {
        await promptAsync();
      }
    } catch (error) {
      console.error('Error during GitHubLogin:', error);
      setErrorMessage('Failed to authenticate with GitHub. Please try again later.');
    }
  };

  return { accessToken, errorMessage, handleGitHubLogin };
}

export default function GitHubLogin() {
  const { accessToken, errorMessage, handleGitHubLogin } = useGitHubLogin();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {errorMessage && <Text>{errorMessage}</Text>}
      {accessToken ? (
        <Text>Logged in with GitHub. Access token: {accessToken}</Text>
      ) : (
        <Button title="Login with GitHub" onPress={handleGitHubLogin} />
      )}
    </View>
  );
}
