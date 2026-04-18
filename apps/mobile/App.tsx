import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from './src/hooks/useLocation';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { colors } from './src/theme';

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
    <ThemeProvider>
      <NavigationContainer>
        <View style={[styles.container, { backgroundColor: colors.surface.default }]}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </ThemeProvider>
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
