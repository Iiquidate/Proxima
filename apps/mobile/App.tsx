import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from './src/hooks/useLocation';
import { NavigationContainer } from '@react-navigation/native'; // 1. Add this
import AppNavigator from './src/navigation/AppNavigator'; // 2. Add this

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
    <NavigationContainer>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
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
