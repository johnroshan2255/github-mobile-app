import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CarouselComponent from '@/components/CarouselComponent';
import { getRepos } from '@/services/apiCalls';
import ProjectList from '@/components/ProjectList';
import { useSocket } from '@/context/SocketContext';

export default function HomeScreen() {

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const carouselData = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const username = 'johnroshan2255';
        const data = await getRepos(username);
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

        <ProjectList data={repos} isLoading={isLoading} username='johnroshan2255' />

        {error && <Text style={styles.error}>{error}</Text>}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // height: '100%',
  },
  color: {
    width: '100%',
    height: 150,
    borderRadius: 25,
    borderCurve: 'continuous',
    marginBottom: 15,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

});
