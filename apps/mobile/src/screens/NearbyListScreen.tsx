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

  const allChannels = [...channels.official, ...channels.community];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <Text style={[styles.header, { color: theme.colors.text.primary }]}>
        Nearby Communities
      </Text>
      {checkStatus ? (
        <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>
          {checkStatus}
        </Text>
      ) : null}
      <FlatList
        data={allChannels}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.channelRow, { backgroundColor: theme.colors.secondary.light, borderColor: theme.colors.secondary[200] }]}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('ChatScreen', {
              channelId: item.id,
              channelName: item.name,
              userId: userId,
              token: token,
            })}
          >
            <View style={[styles.channelIcon, { backgroundColor: theme.colors.secondary[200] }]}>
              <Text style={[styles.channelIconText, { color: theme.colors.secondary.dark }]}>
                {item.type === 'official' ? '#' : '~'}
              </Text>
            </View>
            <View style={styles.channelDetails}>
              <Text style={[styles.channelName, { color: theme.colors.text.primary }]}>
                {item.name}
              </Text>
              <Text style={[styles.channelType, { color: theme.colors.text.tertiary }]}>
                {item.type}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secondary.dark}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  channelIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500',
  },
  channelType: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
    marginTop: 2,
  },
});
