import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from './src/hooks/useLocation';
import LoginScreen from './src/screens/LoginScreen';

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
      <LoginScreen />
      <StatusBar style="auto" />
    </View>
  );
}

// changed alignItems to stretch so text boxes sizes can stay constant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
