import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Card from '@/components/card';  // Assuming you have a Card component

const CarouselComponent = ({ data }) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={width * 0.9}
        height={200}
        autoPlay={false}
        data={data}
        renderItem={({ index }) => (
          <Card key={index} style={styles.card}>
            <Text>
              {index}
            </Text>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(124, 126, 255)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    opacity: 0.1,
  },
});

export default CarouselComponent;
