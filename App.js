import { StyleSheet, View } from 'react-native';
import Weatherly from './src';

export default function App() {
  return (
    <View style={styles.container}>
      <Weatherly />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
