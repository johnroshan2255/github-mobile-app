import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const GitHubActivityGraph = ({ activityData, loading, height }) => {


  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  
  const chartData = {
    labels: activityData.map(item => item.date),
    datasets: [
      {
        data: activityData.map(item => item.count),
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={width - 40}
        height={height}
        chartConfig={{
          backgroundColor: 'rgb(124, 126, 255)',
          backgroundGradientFrom: 'rgb(124, 126, 255)',
          backgroundGradientTo: 'rgb(96, 98, 210)',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: 'rgb(124, 126, 255)',
          },
        }}
        style={{
          marginBottom: 5,
          borderRadius: 16,
        }}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GitHubActivityGraph;
