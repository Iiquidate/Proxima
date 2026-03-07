import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from '@/src/hooks/useLocation'; // or use './src/hooks/useLocation' if this shows errors

export default function App() {
  const {location, errorMsg} = useLocation();

  let text = 'Waiting to obtain location...';
  if (errorMsg) {
    text = errorMsg;
  }
  else if (location) {
    const latitude = location.coords.latitude; // store latitude
    const longitude = location.coords.longitude; // store longitude
    text = `Your location is Latitude: ${latitude}, Longitude: ${longitude}`;
  }
  
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <StatusBar style="auto" />
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
