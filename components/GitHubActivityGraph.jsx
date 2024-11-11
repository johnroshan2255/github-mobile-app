import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Svg, Path, G, Text as SvgText, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const GitHubActivityGraph = ({ activityData, loading, height }) => {
  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const labels = activityData.map(item => item.date);
  const data = activityData.map(item => item.count);

  const chartHeight = height - 20;
  const chartWidth = width - 40; // Reduced width for better alignment
  const padding = 40; // Padding for better alignment

  const maxDataValue = Math.max(...data);

  const scaleY = (value) => (chartHeight - padding) - ((value / maxDataValue) * (chartHeight - 2 * padding));
  const scaleX = (index) => (chartWidth / (data.length - 1)) * index + padding;

  const linePath = data
    .map((point, index) => {
      const x = scaleX(index);
      const y = scaleY(point);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.centeredContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[...Array(6)].map((_, i) => {
          const y = scaleY(i * (maxDataValue / 5));
          return (
            <Line
              key={i}
              x1={padding}
              y1={y}
              x2={chartWidth - padding / 2}
              y2={y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Axis lines */}
        <Line x1={padding} y1={padding / 2} x2={padding} y2={chartHeight - padding} stroke="white" strokeWidth="2" />
        <Line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding / 2} y2={chartHeight - padding} stroke="white" strokeWidth="2" />

        {/* Data line */}
        <Path d={linePath} fill="none" stroke="rgb(124, 126, 255)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

        {/* Data dots */}
        {data.map((point, index) => {
          const x = scaleX(index);
          const y = scaleY(point);
          return <Path key={index} d={`M${x},${y}m-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0`} fill="rgb(124, 126, 255)" />;
        })}

        {/* X-axis labels */}
        {labels.map((label, index) => {
          const x = scaleX(index);
          return (
            <SvgText key={index} x={x} y={chartHeight - padding + 20} fontSize="10" fill="white" textAnchor="middle">
              {label}
            </SvgText>
          );
        })}

        {/* Y-axis labels */}
        {[...Array(6)].map((_, i) => {
          const value = i * (maxDataValue / 5);
          const y = scaleY(value);
          return (
            <SvgText key={i} x={padding - 10} y={y + 4} fontSize="10" fill="white" textAnchor="end">
              {Math.round(value)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    overflow: 'visible',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a6a3ff',
    borderRadius: 20,
  },
});

export default GitHubActivityGraph;
