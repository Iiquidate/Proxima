import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { TouchableOpacity } from 'react-native';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

interface Channel {
  id: string;
  name: string;
  type: 'official' | 'community';
}

export default function ChannelListScreen({ navigation, route }: any) {
  const { userId, token } = route.params || {};
  const theme = useTheme();
  console.log('NearbyList params:', { userId, token });
  const { location, errorMsg } = useLocation();
  const [channels, setChannels] = useState<{ official: Channel[]; community: Channel[] }>({ official: [], community: [] });

  let text = 'Waiting to obtain location...';
  const [checkStatus, setCheckStatus] = useState(text);
  const [refreshing, setRefreshing] = useState(false);

  // need this in order to have refresh capabilities
  const displayChannels = async () => {
    if (!location) {
      return;
    }

    const latitude = location.coords.latitude; // store latitude
    const longitude = location.coords.longitude; // store longitude

    console.log(`[Fetching Channels] Lat: ${latitude}, Lng: ${longitude}`);

    try{
      // Use your IP address for the links that say YOUR_IP
      const communityResponse = await fetch(`${SERVER_URL}/channels/nearby?lat=${latitude}&lng=${longitude}`);
      const communityData = await communityResponse.json();
      // The prev state was researched through Google Gemini
      setChannels(prev => ({
        ...prev,
        community: communityData.communityChannels || []
      }));

      const officialResponse = await fetch(`${SERVER_URL}/channels/official`);
      const officialData = await officialResponse.json();
      // The prev state was researched through Google Gemini
      setChannels(prev => ({
        ...prev,
        official: officialData.officialChannels || []
      }));

      if (communityData.count === 0 && officialData.count === 0) {
        setCheckStatus('Finding channels in your area...');
      }
      else {
        setCheckStatus('');
      }

    } catch (error) {
      console.error('Error fetching nearby channels:', error);
      setCheckStatus('Error fetching nearby channels');
      return;
    }
  }

  // onRefresh was researched in React Native documentation for RefreshControl at https://reactnative.dev/docs/refreshcontrol
  const onRefresh = async () => {
    setRefreshing(true);
    await displayChannels();
    //console.log('Channels refreshed');
    setRefreshing(false);
  };

  useEffect(() => {
    if (errorMsg) {
      setCheckStatus(errorMsg);
    }
    if (location) {
      displayChannels();
    }
  }, [location, errorMsg]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>
        {checkStatus}
      </Text>
      <FlatList
        data={[...channels.official, ...channels.community]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { borderColor: theme.colors.border.light }]}
            onPress={() => navigation.navigate('ChatScreen', {
              channelId: item.id,
              channelName: item.name,
              userId: userId,
              token: token,
            })}
          >
            <Text style={[styles.itemText, { color: theme.colors.text.primary }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
