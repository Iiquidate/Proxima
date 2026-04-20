// This code was inspired by https://reactnavigation.org/ and Gemini
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import NearbyListScreen from '../screens/NearbyListScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

// Master Stack App
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{
        headerStyle: { backgroundColor: colors.surface.default },
        headerTintColor: colors.secondary.dark,
        headerTitleStyle: { color: colors.text.primary, fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.surface.default },
      }}>

      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: true, title: '' }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: true, title: '' }}
      />

      <Stack.Screen
        name="MainApp"
        component={NearbyListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params?.channelName || 'Chat',
        })}
      />

    </Stack.Navigator>
  );
}
