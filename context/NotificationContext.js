import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Initialize the context with a default value
const NotificationContext = createContext({
  expoPushToken: null,
  sendPushNotification: async () => {},
  permissionStatus: null,
  isLoading: true,
  error: null,
});

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if device is physical (not simulator)
      if (!Device.isDevice) {
        setError('Push notifications are not available on simulator/emulator');
        return;
      }

      // Check platform-specific requirements
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);

      if (finalStatus !== 'granted') {
        setError('Permission not granted for push notifications');
        return;
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId ?? '7d0d7172-362a-4496-a800-d11e2fc5f67f',
      });

      setExpoPushToken(tokenData.data);
    } catch (err) {
      setError(err.message);
      console.error('Error setting up push notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up notification handlers
  useEffect(() => {
    
    registerForPushNotifications();

    // Handle notifications received while app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received in foreground:', notification);
        // You can add custom handling here
      }
    );

    // Handle notification responses (when user taps notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { notification: { request: { content } } } = response;
        console.log('Notification response:', response);
        // You can add custom handling here, like navigation
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  // Send local or push notification
  const sendPushNotification = async ({
    title,
    body,
    data = {},
    sound = true,
    priority = 'default',
    badge = 1,
  }) => {
    try {
      if (!expoPushToken) {
        throw new Error('Push token not available');
      }

      // For local notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound,
          badge,
          priority,
        },
        trigger: null, // null means immediate delivery
      });

      return true;
    } catch (err) {
      console.error('Error sending notification:', err);
      setError(err.message);
      return false;
    }
  };

  // For remote push notifications (to be used on your server)
  const sendRemotePushNotification = async ({
    title,
    body,
    data = {},
  }) => {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      return true;
    } catch (err) {
      console.error('Error sending remote notification:', err);
      setError(err.message);
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        sendPushNotification,
        sendRemotePushNotification,
        permissionStatus,
        isLoading,
        error,
        registerForPushNotifications, // Expose this to allow manual retry
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Usage example:
export const NotificationExample = () => {
  const { 
    sendPushNotification, 
    expoPushToken, 
    error, 
    isLoading,
    permissionStatus 
  } = useNotification();

  const handleNotification = async () => {
    await sendPushNotification({
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { screen: 'Home' },
    });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Permission Status: {permissionStatus}</Text>
      <Text>Push Token: {expoPushToken}</Text>
      <Button 
        onPress={handleNotification} 
        title="Send Test Notification" 
      />
    </View>
  );
};