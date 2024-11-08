import AsyncStorage from '@react-native-async-storage/async-storage';

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