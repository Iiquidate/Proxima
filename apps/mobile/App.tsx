import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from './src/hooks/useLocation';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: colors.surface.default,
              card: colors.surface.light,
              text: colors.text.primary,
              border: colors.border.light,
              primary: colors.primary[500],
            },
          }}>
          <View style={[styles.container, { backgroundColor: colors.surface.default }]}>
            <AppNavigator />
            <StatusBar style="dark" />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// changed alignItems to stretch so text boxes sizes can stay constant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF7',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
