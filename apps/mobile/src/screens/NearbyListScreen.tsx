import React, {useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import { useLocation } from '../hooks/useLocation';

interface Channel {
  id: string;
  name: string;
  type: 'official' | 'community';
}

export default function ChannelListScreen({ navigation }: any) {
  const {location, errorMsg} = useLocation();
  // The line below was researched through Google Gemini
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

    //console.log(`[Fetching Channels] Lat: ${latitude}, Lng: ${longitude}`);

    try{
      // Use your IP address for the links that say YOUR_IP
      const communityResponse = await fetch(`http://YOUR_IP:3000/channels/nearby?lat=${latitude}&lng=${longitude}`);
      const communityData = await communityResponse.json();
      // The prev state was researched through Google Gemini
      setChannels(prev => ({
        ...prev,
        community: communityData.communityChannels || []
      }));

      const officialResponse = await fetch('http://YOUR_IP:3000/channels/official');
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
    <View style={styles.container}>
      <Text style={styles.text}>{checkStatus}</Text>
      <FlatList
        data={[...channels.official, ...channels.community]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style = {styles.text}>{item.name}</Text>
          </View>
        )}
        // Researched from RefreshControl documentation at https://reactnative.dev/docs/refreshcontrol
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingTop: 100},
  text: { fontSize: 20, fontWeight: 'bold', textAlign: 'center'},
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#60a9da', width: '100%' },
});
