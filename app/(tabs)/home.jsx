import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CarouselComponent from '@/components/CarouselComponent';
import { getRepos } from '@/services/apiCalls';
import ProjectList from '@/components/ProjectList';
import { getUserDetails } from '@/utils/utils';
import { useSocket } from '@/context/SocketContext';

export default function HomeScreen() {

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const carouselData = [1, 2, 3, 4, 5];

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('testEvent', (data) => {
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
        let userData = await getUserDetails();
        setUserDetails(userData);
        const data = await getRepos(userData.username);
        setRepos(data);
      } catch (err) {
        setError('Failed to load repositories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [])

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
