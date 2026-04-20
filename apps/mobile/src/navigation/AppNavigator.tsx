// This code was inspired by https://reactnavigation.org/ and Gemini
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // 1. Import Tabs
import { colors } from '../theme';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import NearbyListScreen from '../screens/NearbyListScreen';
import ChatsScreen from '../screens/ChatsScreen';
import DMScreen from '../screens/DMScreen';
import SettingsScreen from '../screens/SettingsScreen'
import SignUpScreen from '../screens/SignUpScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // 2. Initialize Tabs

// 3. Create the Bottom Menu Map
function MainTabNavigator({ route }: any) {
  const { userId, token } = route.params || {};
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface.light,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 88,
        },
        tabBarActiveTintColor: colors.secondary.dark,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen name="NearbyList" component={NearbyListScreen} initialParams={{ userId, token }} options={{ title: 'Nearby' }} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
      <Tab.Screen name="DMs" component={DMScreen} options={{ title: 'DMs' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

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

      {/* The Main App (This loads the entire Tab menu!) */}
      <Stack.Screen
        name="MainApp"
        component={MainTabNavigator}
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
