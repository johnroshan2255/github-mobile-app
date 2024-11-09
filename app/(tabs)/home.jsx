import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CarouselComponent from '@/components/CarouselComponent';
import ProjectList from '@/components/ProjectList';
import { getUserDetails, getReposData } from '@/utils/utils';
import { useSocket } from '@/context/SocketContext';
import { useNotification } from '@/context/NotificationContext';

export default function HomeScreen() {

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const carouselData = [1, 2, 3, 4, 5];

  const { socket } = useSocket();
  const { sendPushNotification } = useNotification();

  useEffect(() => {
    if (socket) {
      socket.on('testEvent', (data) => {
        sendPushNotification('Test Notification', 'This is a test message');
        console.log('Received test event:', data);
      });
    }

    return () => {
      if (socket) {
        socket.off('testEvent');
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData);
        const data = await getReposData(userData.username);
        setRepos(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to load repositories.');
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
        <View style={ styles.container }>
          {
            [0.5].map(opacity => (
              <View 
                key={opacity}
                style={[ styles.color, {backgroundColor: "rgb(124, 126, 255)", opacity} ]}
              >
              </View>
            ))
          }
        </View>
      <ScrollView contentContainerStyle={ styles.container } >
        
        {/* <CarouselComponent data={carouselData} /> */}

        <ProjectList data={repos} isLoading={isLoading} username={userDetails.username} />

        {error && <Text style={styles.error}>{error}</Text>}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    // height: '100%',
  },
  color: {
    width: '100%',
    height: 150,
    borderRadius: 25,
    borderCurve: 'continuous',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

});
