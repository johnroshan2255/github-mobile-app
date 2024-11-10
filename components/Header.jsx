import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Animated, Easing, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getUserDetails } from '@/utils/utils';

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const scaleValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(-60)).current;
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = await getUserDetails();
      setUserDetails(details);
    };
    fetchUserDetails();
  }, []);

  const allSuggestions = [
    'React Native',
    'JavaScript',
    'React',
    'Expo',
    'Node.js',
    'CSS',
    'HTML',
    'TypeScript',
  ];

  const handleSearchToggle = () => {
    setIsModalVisible(true);
    
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(translateYValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setIsFocused(false)
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(translateYValue, {
      toValue: -60,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setIsModalVisible(false);
      setSearchQuery('');
      setRecommendations([]);
    }, 300);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);

    if (text) {
      const filteredSuggestions = allSuggestions.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setRecommendations(filteredSuggestions);
    } else {
      setRecommendations([]);
    }
  };

  const handleRecommendationClick = (recommendation) => {
    setSearchQuery(recommendation);
    setRecommendations([]);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image style={styles.userImage} source={userDetails.avatar_url} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}></Text>
      </View>
      <TouchableOpacity style={styles.searchIcon} onPress={handleSearchToggle}>
        <Feather name="search" size={26} color="rgb(124, 126, 255)" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: scaleValue }, { translateY: translateYValue }],
              },
            ]}
          >
            <TextInput
              style={[styles.searchInput, isFocused && styles.focusedInput]}
              placeholder="Search..."
              value={searchQuery || ''}
              onChangeText={handleSearchChange}
              autoFocus={true}
              onBlur={closeModal}
              underlineColorAndroid="transparent"
              onFocus={() => setIsFocused(true)}
            />
            
            {recommendations.length > 0 && (
              <FlatList
                data={recommendations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recommendationItem}
                    onPress={() => handleRecommendationClick(item)}
                  >
                    <Text style={styles.recommendationText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                style={styles.recommendationsList}
              />
            )}

          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 20
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginRight: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  searchInput: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: 'rgb(124, 126, 255)',
    marginBottom: 20,
  },
  focusedInput: {
    borderColor: 'rgb(124, 126, 255)',
    outlineStyle: 'none',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },

  recommendationsList: {
    width: '100%',
    maxHeight: 200, // Maximum height for recommendations
    marginTop: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  recommendationItem: {
    padding: 12,
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
  },
  recommendationItemHover: {
    backgroundColor: 'rgb(124, 126, 255)', // Highlight color for hover/focus
    color: 'white',
  },
});

export default Header;