import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ModelViewer from './components/ModelViewer';

export default function App() {
  return (
    <View style={styles.container}>
      <ModelViewer />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
});