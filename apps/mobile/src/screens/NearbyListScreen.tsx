import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';

interface Channel {
  id: string;
  name: string;
  type: 'official' | 'community';
  created_by: string;
}

export default function ChannelListScreen({ navigation, route }: any) {
  const { userId, token, role } = route.params || {};
  const theme = useTheme();
  console.log('NearbyList params:', { userId, token });
  const { location, errorMsg } = useLocation();
  const [channels, setChannels] = useState<{ official: Channel[]; community: Channel[] }>({ official: [], community: [] });

  let text = 'Waiting to obtain location...';
  const [checkStatus, setCheckStatus] = useState(text);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelRadius, setNewChannelRadius] = useState('');


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
    //console.log('Channels refreshed'); Used for testing
    setRefreshing(false);
  };

  const handleInsertCommunityChannel = async () => {

    if (!newChannelName.trim()) {
      Alert.alert('Channel name cannot be empty.');
      return;
    }

    if (isNaN(Number(newChannelRadius)) || Number(newChannelRadius) <= 0) {
      Alert.alert('Please enter a valid radius in meters.');
      return;
    }

    try {
      // Lines 91-105 were researched through Google Gemini in order to get the token in the frontend
      if (!token) {
        Alert.alert('User not authenticated. Please log in again.');
        return;
      }

      if (!location) {
        Alert.alert('Error in obtaining location.');
        return;
      }

      const response = await fetch(`${SERVER_URL}/channels`, {                                                                                                   
            method: 'POST',                                                                                                                                                      
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Will utilize requireAuth
             },
            body: JSON.stringify({
              name: newChannelName, 
              lat: location.coords.latitude, 
              lng: location.coords.longitude,
              radiusMeters: Number(newChannelRadius),
              type: 'community'
            })                                                                                                                            
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating channel:', errorData);
        Alert.alert('Error creating channel. Please try again.');
        return;
      }

      if (response.ok) {
        setModalVisible(false);
        setNewChannelName('');
        setNewChannelRadius('');
        await displayChannels(); // Refresh channels to get the most updated list
      }
    }
    catch (error) {
      console.error('Error creating channel', error);
      return;
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    try {
      if (!token) {
        Alert.alert('User not authenticated. Please log in again.');
        return;
      }

      const response = await fetch(`${SERVER_URL}/channels/${channelId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Will utilize requireAuth
         },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error deleting channel. Please try again.');
        console.error('Error deleting channel:', data);
        return;
      }

      if (response.ok) {
        Alert.alert('Channel deleted successfully.');
        console.log('Deleted channel ID:', channelId); // Used for testing
        await displayChannels(); // Refresh channels to get the most updated list
      }
    } catch (error) {
      console.error('Error deleting channel', error);
      return;
    }
  }

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
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.colors.text.primary }]}>
          Nearby Communities
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.secondary.dark }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface.light }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
              Create Community
            </Text>
            <InputField placeHolderValue="Channel Name" value={newChannelName} onChangeText={setNewChannelName} />
            <InputField placeHolderValue="Radius in Meters" value={newChannelRadius} onChangeText={setNewChannelRadius} />
            <View style={styles.modalButtons}>
              <ButtonComponent title="Cancel" actionWhenPressed={() => setModalVisible(false)} variant="secondary" compact />
              <ButtonComponent title="Create" actionWhenPressed={() => handleInsertCommunityChannel()} variant="primary" compact />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -1,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(53, 47, 41, 0.25)',
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
