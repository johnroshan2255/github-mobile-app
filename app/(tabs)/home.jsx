import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CarouselComponent from '@/components/CarouselComponent';
import ProjectList from '@/components/ProjectList';
import { getUserDetails, getReposData, notify } from '@/utils/utils';
import { useSocket } from '@/context/SocketContext';
import GitHubActivityGraph from '@/components/GitHubActivityGraph';
import { getChartData } from '@/services/apiCalls';

export default function HomeScreen() {

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  
  const [chartData, setChartData] = useState({});
  const [isChartLoading, setIsChartLoading] = useState(true);

  const { socket } = useSocket();

  const { width, height } = Dimensions.get('window');
  const isTablet = width > 600;
  useEffect(() => {
    if (socket) {
      socket.on('testEvent', (data) => {
        notify('Test Notification', 'This is a test message', '', {}, 'https://ibb.co/S3HDP41');
        console.log('Received test event:', data);
      });

      socket.on('githubEvent', (data) => {
        notify('Test Notification', 'This is a test message', '', {}, 'https://ibb.co/S3HDP41');
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
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData);
      } catch (err) {
        console.log(err);
        setError('Failed to load user details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails?.username) {
      const fetchRepos = async () => {
        try {
          const data = await getReposData(userDetails.username);
          setRepos(data);
        } catch (err) {
          console.log(err);
          setError('Failed to load repositories.');
        }
      };

      fetchRepos();
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails?.username) {
      const fetchChartDetails = async () => {
        try {
          const data = await getChartData(userDetails.username);
          setChartData(data);
        } catch (err) {
          console.log(err);
          setError('Failed to load chart data.');
        } finally {
          setIsChartLoading(false);
        }
      };

      fetchChartDetails();
    }
  }, [userDetails]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {[
          0.5,
        ].map(opacity => (
          <View
            key={opacity}
            style={[
              styles.color,
              {
                backgroundColor: 'rgb(96, 98, 210)', // Chart background color
                opacity,
                height: isTablet ? height / 3 : 180, // Adjust height based on device size
              },
            ]}
          >
            {isChartLoading ? (
              <ActivityIndicator size="large" color="rgb(124, 126, 255)" />
            ) : (
              <GitHubActivityGraph
                activityData={chartData}
                loading={isChartLoading}
                height={isTablet ? height / 3 : 180}
              />
            )}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <ProjectList data={repos} isLoading={isLoading} username={userDetails.username} />

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  color: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
