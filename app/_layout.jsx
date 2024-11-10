import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SocketProvider } from '@/context/SocketContext.js'
import registerNNPushToken from 'native-notify';
import { APPID, APP_TOKEN } from '@/config/config';

export default function Layout() {

  registerNNPushToken(APPID, APP_TOKEN);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = useRouter();

  const checkAuthToken = async () => {
    const token = await AsyncStorage.getItem('githubAccessToken');
    if (!token || token === 'undefined') {
      setIsLoggedIn(false);
      
    } else {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkAuthToken();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false && router.pathname !== '/') {
      router.push('/');
    }
  }, [isLoggedIn, router.pathname]);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <SocketProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="index" options={{ headerShown: false }} />
        )}
      </Stack>
    </SocketProvider>
  );
}