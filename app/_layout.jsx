import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Layout() {
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
    alert('here');
    if (isLoggedIn === false && router.pathname !== '/') {
      router.push('/');
    }
  }, [isLoggedIn, router.pathname]);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Stack>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="index" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}