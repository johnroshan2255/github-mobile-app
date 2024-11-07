import Card from '@/components/card';
import { StyleSheet, Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {

  const { width, height } = Dimensions.get('window');
  return (
    <View>
      <ScrollView contentContainerStyle={ styles.container } >
        {
          [1, 0.8, 0.5].map(opacity => (
            <View 
              key={opacity}
              style={[ styles.color, {backgroundColor: "rgb(124, 126, 255)", opacity} ]}
            >
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '100%',
  },
  color: {
    width: '100%',
    height: 150,
    borderRadius: 25,
    borderCurve: 'continuous',
    marginBottom: 15,
  }
});
