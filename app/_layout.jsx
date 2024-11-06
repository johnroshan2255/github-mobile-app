import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    checkAuthToken();
  }, []);

  return (
    <Stack>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="/" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
