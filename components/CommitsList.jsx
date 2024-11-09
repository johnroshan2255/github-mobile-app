// Named export
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const CommitsList = ({ data, isLoading, repos, selectedRepo, setSelectedRepo }) => {
  const handleRepoChange = (repoName) => {
    setSelectedRepo(repoName);
  };

  const dropdownData = repos.map((repo) => ({
    key: repo.name,
    value: repo.name
  }));

  return (
    <View style={styles.container}>
        <SelectList 
            setSelected={handleRepoChange}
            data={dropdownData} 
            save="value" 
            defaultOption={{ key: selectedRepo, value: selectedRepo }}
            boxStyles={styles.dropdown} 
            placeholder="Select Repository" 
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
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
});

export default CommitsList;
