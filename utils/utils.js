import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRepos } from '@/services/apiCalls';

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  export const getUserDetails = async () => {
    try{
      const [username, avatar_url] = await AsyncStorage.multiGet([
        'githubUsername',
        'githubAvatarUrl',
      ]);
      
      return { username:username[1], avatar_url:avatar_url[1] }
    } catch(error){
      console.error('Error getting user info from AsyncStorage:', error);
    }
  }

  export const getReposData = async (username) => {
    try{
      const cachedRepos = await AsyncStorage.getItem('repos');
      const cachedTime = await AsyncStorage.getItem('reposCacheTime');

      const currentTime = new Date().getTime();

      if (cachedRepos && cachedTime && currentTime - cachedTime < 3600000) {
        return JSON.parse(cachedRepos);
      } else{

        const data = await getRepos(username);

        await AsyncStorage.setItem('repos', JSON.stringify(data));
        await AsyncStorage.setItem('reposCacheTime', currentTime.toString());

        return data;
      }

    } catch(error){
      console.error('Error getting user info from AsyncStorage:', error);
    }
  }