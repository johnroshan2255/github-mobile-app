import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSocket } from '@/context/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCommits } from '@/services/apiCalls';
import CommitsList from '@/components/CommitsList';
import { getUserDetails, getReposData } from '@/utils/utils';

export default function Commits() {
  const { socket } = useSocket();
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repos, setRepos] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const storedCommits = await AsyncStorage.getItem('commits');
        if (storedCommits && storedCommits !== 'undefined') {         
          setCommits(JSON.parse(storedCommits));
        }
        if(userDetails?.username && selectedRepo !== ''){
          const commitsFromAPI = await getCommits(userDetails?.username, selectedRepo);
          setCommits(commitsFromAPI);
          await AsyncStorage.setItem('commits', JSON.stringify(commitsFromAPI));
        }
      } catch (error) {
        console.error('Error loading commits from AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommits();
    
    if (socket) {
      socket.on('newCommit', handleNewCommit);
    }

    return () => {
      if (socket) {
        socket.off('newCommit', handleNewCommit);
      }
    };
  }, [socket, selectedRepo]);

  const handleNewCommit = async (newCommit) => {
    setCommits((prevCommits) => {
      const updatedCommits = [newCommit, ...prevCommits];
      
      if (updatedCommits.length > 10) {
        updatedCommits.pop();
      }
      
      AsyncStorage.setItem('commits', JSON.stringify(updatedCommits))
        .then(() => {
          console.log('Commits saved to AsyncStorage');
        })
        .catch((error) => {
          console.error('Error saving commits to AsyncStorage:', error);
        });
      
      return updatedCommits;
    });
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      AsyncStorage.removeItem('commits');
      setCommits([]);
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
     
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {repos.length > 0 ? (
        <CommitsList 
          data={commits}
          isLoading={isLoading} 
          repos={repos} 
          selectedRepo={selectedRepo} 
          setSelectedRepo={setSelectedRepo}   
          username={userDetails?.username}   
        />
      ) : (
        !isLoading && <Text>No commits available</Text>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

});