// This code was inspired by https://reactnavigation.org/ and Gemini
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // 1. Import Tabs

// Import screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen'; 
import NearbyListScreen from '../screens/NearbyListScreen';
import ChatsScreen from '../screens/ChatsScreen';
import DMScreen from '../screens/DMScreen';
import SettingsScreen from '../screens/SettingsScreen'
import SignUpScreen from '../screens/SignUpScreen';
// import SettingsScreen from '../screens/SettingsScreen'; // Make sure you create this file!

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // 2. Initialize Tabs

// 3. Create the Bottom Menu Map
function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="NearbyList" component={NearbyListScreen} options={{ title: 'Nearby List' }} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
      <Tab.Screen name="DMs" component={DMScreen} options={{ title: 'DMs' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

// Master Stack App
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing">
      
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: true, title: '', headerBackTitle: 'Back' }}                                                                                                                                   
      />                                            

      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ headerShown: true, title: '', headerBackTitle: 'Back' }} 
      />

      {/* The Main App (This loads the entire Tab menu!) */}
      <Stack.Screen 
        name="MainApp" 
        component={MainTabNavigator} 
        options={{ headerShown: false }} 
      />

    </Stack.Navigator>
  );
}
