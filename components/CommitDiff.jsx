import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const CommitDiff = ({ commitDiff }) => {
  
  const files = Array.isArray(commitDiff?.files) ? commitDiff.files : [];  

  if (files.length === 0) {
    return <Text>No commit diff available</Text>;
  }

  console.log('files', files);  // Log to inspect the commitDiff structure

  return (
    <ScrollView style={styles.container}>
      {files.map((file, index) => (
        <View key={index} style={styles.diffContainer}>
          <Text style={styles.filename}>{file.filename}</Text>
          <Text>Status: {file.status}</Text>
          <Text>+ Additions: {file.additions}</Text>
          <Text>- Deletions: {file.deletions}</Text>

          <Text style={styles.diff}>
            {file.patch.split('\n').map((line, idx) => {
              if (line.startsWith('+')) {
                return <Text key={idx} style={styles.addedLine}>{line}</Text>;
              } else if (line.startsWith('-')) {
                return <Text key={idx} style={styles.deletedLine}>{line}</Text>;
              }
              return <Text key={idx}>{line}</Text>;
            })}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  diffContainer: {
    marginBottom: 15,
  },
  filename: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addedLine: {
    color: 'green', // Green for added lines
  },
  deletedLine: {
    color: 'red', // Red for deleted lines
  },
  diff: {
    fontFamily: 'Courier New', // Monospaced font for diff
    marginTop: 5,
  },
});

export default CommitDiff;
