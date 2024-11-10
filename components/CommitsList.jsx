// Named export
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, Button, TouchableOpacity } from 'react-native';
import RepoSelect from './RepoSelect';
import EventSelector from './EventSelector';

const CommitsList = ({ data, isLoading, repos, selectedRepo, setSelectedRepo }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleRepoChange = (repoName) => {
    setSelectedRepo(repoName);
  };

  const dropdownData = repos.map((repo) => ({
    key: repo.name,
    value: repo.name
  }));

  const submitForm = () => {

  }

  return (
    <View style={styles.container}>
   
        <RepoSelect
            handleRepoChange={handleRepoChange}
            dropdownData={dropdownData}
            selectedRepo={selectedRepo}
          />
        <TouchableOpacity
            style={styles.eventButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add Event</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingBottom: 60, zIndex: 99 }}>
            {isLoading ? (
                <Text>Loading commits...</Text>
            ) : data?.data?.length > 0 ? (
                data?.data?.map((commit, index) => {
                const commitDetails = commit?.commit;
                const authorDetails = commit?.author;
                return (
                    <View key={index} style={styles.commit}>
                    <Text style={styles.commitMessage}>{commitDetails?.message}</Text>
                    <View style={styles.authorContainer}>
                        {authorDetails && authorDetails.avatar_url && (
                        <Image
                            source={{ uri: authorDetails.avatar_url }}
                            style={styles.avatar}
                        />
                        )}
                        <Text style={styles.commitAuthor}>{commitDetails?.author?.name}</Text>
                    </View>
                    <Text style={styles.commitDate}>
                        {commitDetails?.author?.date
                        ? new Date(commitDetails?.author?.date).toLocaleString()
                        : 'Unknown date'}
                    </Text>
                    </View>
                );
                })
            ) : (
                <Text>No commits available</Text>
            )}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true} 
          visible={modalVisible} 
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <EventSelector
                onSubmit={submitForm} 
                repoData={dropdownData} 
              />
              
            </View>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  dropdown: {
    marginBottom: 16,
  },
  commit: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commitMessage: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commitAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  commitDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    padding: 10,
    zIndex: 999
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    zIndex: 999,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  eventButton: {
    position: 'absolute',
    right: 20,
    top: '8%',
    width:100,
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(124, 126, 255)',
    borderRadius: 25,
    zIndex: 999,
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommitsList;
