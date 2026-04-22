// This code was inspired by https://reactnavigation.org/ and Gemini
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { colors } from '../theme';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import NearbyListScreen from '../screens/NearbyListScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ChatScreen from '../screens/ChatScreen';
import ManageMembersScreen from '../screens/ManageMembersScreen';
import ChannelMembersScreen from '../screens/ChannelMembersScreen';

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
        options={({ route, navigation }: any) => ({
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton
              tintColor="#000000"
              label="Back"
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleAlign: 'center',
          headerTitle: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChannelMembers', {
                channelId: route.params?.channelId,
                channelName: route.params?.channelName,
                token: route.params?.token,
              })}
              activeOpacity={0.6}
              style={{ alignSelf: 'center' }}
            >
              <Text style={{ color: colors.text.primary, fontWeight: '600', fontSize: 17, textAlign: 'center' }}>
                {route.params?.channelName || 'Chat'}
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="ManageMembers"
        component={ManageMembersScreen}
        options={({ route, navigation }: any) => ({
          headerShown: true,
          title: `Members — ${route.params?.channelName || 'Channel'}`,
          headerLeft: () => (
            <HeaderBackButton
              tintColor="#000000"
              label="Back"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="ChannelMembers"
        component={ChannelMembersScreen}
        options={({ route }: any) => ({
          headerShown: true,
          title: `${route.params?.channelName || 'Channel'} — Participants`,
        })}
      />

    </Stack.Navigator>
  );
}
