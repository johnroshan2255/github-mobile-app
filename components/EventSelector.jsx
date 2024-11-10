import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import RepoSelect from './RepoSelect';

const EventSelector = ({ onSubmit, repoData }) => {
  const [selectedEvents, setSelectedEvents] = useState({
    push: false,
    pull_request: false,
    issues: false,
    create: false,
    delete: false,
    release: false,
    fork: false,
  });

  const [selectedRepo, setSelectedRepo] = useState('');

  const handleRepoChange = (repoName) => {
    setSelectedRepo(repoName);
  };

  const handleToggleEvent = (event) => {
    setSelectedEvents((prevState) => ({
      ...prevState,
      [event]: !prevState[event],
    }));
  };

  const handleSubmit = () => {
    // Collect selected events
    const selectedEventTypes = Object.keys(selectedEvents).filter(event => selectedEvents[event]);

    if (selectedEventTypes.length === 0) {
      Alert.alert('Please select at least one event');
    } else {
      // Submit the selected events
      onSubmit(selectedEventTypes);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <RepoSelect handleRepoChange={handleRepoChange} dropdownData={repoData} selectedRepo={''} />

      {/* Events Section */}
      <View style={styles.eventsSection}>
        {Object.keys(selectedEvents).map(event => (
          <TouchableOpacity
            key={event}
            style={[
              styles.eventButton,
              selectedEvents[event] ? styles.selectedEvent : styles.deselectedEvent,
            ]}
            onPress={() => handleToggleEvent(event)}
          >
            <Text
              style={[
                styles.eventText,
                selectedEvents[event] ? styles.selectedText : styles.deselectedText,
              ]}
            >
              {event}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
    marginBottom: 20,
  },
  eventButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEvent: {
    backgroundColor: 'rgb(124, 126, 255)',
    borderColor: 'rgb(124, 126, 255)',
    opacity: 0.5
  },
  deselectedEvent: {
    backgroundColor: 'white',
    borderColor: 'rgb(124, 126, 255)',
    opacity: 0.8
  },
  eventText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  deselectedText: {
    color: 'rgb(124, 126, 255)',
  },
  submitContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgb(124, 126, 255)', // Custom background color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: '500',
  },
});
