import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { formatDate } from '@/utils/utils.js'
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ProjectList({ data, isLoading, username }) {

console.log(data);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading projects...</Text>
        ) : (
          data && data.map((project) => (
            <View key={project.id} style={styles.projectCard}>
              {/* Header with Avatar */}
              <View style={styles.header}>
                <Image
                  source={{ uri: project.owner.avatar_url }}
                  style={styles.avatar}
                />
                <View style={styles.headerText}>
                  <Text style={styles.projectName} numberOfLines={1}>
                    {project.name}
                  </Text>
                  <Text style={styles.username} numberOfLines={1}>
                    {username}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.description} numberOfLines={2}>
                {project.description || "No description available."}
              </Text>

              {/* Topics */}
              {project.topics && project.topics.length > 0 && (
                <View style={styles.topicsContainer}>
                  {project.topics.map((topic) => (
                    <View key={topic} style={styles.topicBadge}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Stats Row */}
              <View style={styles.statsRow}>
                {project.language && (
                  <View style={styles.stat}>
                    <Entypo name="code" size={16} color="black" />
                    <Text style={styles.statText}>{project.language}</Text>
                  </View>
                )}
                <View style={styles.stat}>
                  <EvilIcons name="star" size={16} color="black" />
                  <Text style={styles.statText}>{project.stargazers_count}</Text>
                </View>
                <View style={styles.stat}>
                  <AntDesign name="fork" size={16} color="black" />
                  <Text style={styles.statText}>{project.forks_count}</Text>
                </View>
              </View>

              {/* Last Updated */}
              <View style={styles.footer}>
                <View style={styles.lastUpdated}>
                  <AntDesign name="clockcircleo" size={16} color="black" />
                  <Text style={styles.footerText}>{formatDate(project.updated_at)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(project.html_url)}
                  style={styles.viewButton}
                >
                  <Text style={styles.viewText}>View</Text>
                  <EvilIcons name="external-link" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  topicBadge: {
    backgroundColor: '#E8E8FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  topicText: {
    fontSize: 12,
    color: '#8a56c7',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    color: '#8a56c7',
    fontSize: 14,
    marginRight: 4,
  },
});
