import React, {useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Alert, Touchable} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { SERVER_URL } from '../config';

interface Channel {
  id: string;
  name: string;
  type: 'official' | 'community';
  created_by: string;
}

export default function ChannelListScreen({ navigation, route }: any) {
  const { userId, token, role} = route.params || {};
  console.log('NearbyList params:', { userId, token, role});

  const {location, errorMsg} = useLocation();
  // The line below was researched through Google Gemini
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

    //console.log(`[Fetching Channels] Lat: ${latitude}, Lng: ${longitude}`);
        
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{checkStatus}</Text>
      <FlatList
        data={[...channels.official, ...channels.community]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/*The first TouchableOpacity is a placeholder for the one that connects to invidual chat screens.*/}
            <TouchableOpacity 
              style={styles.itemContainer}
              onPress={() => {alert(`You clicked on: ${item.name}`);}}
            >
              <Text style = {styles.text}>{item.name}</Text>
            </TouchableOpacity>
            
            {/*Line 196 was researched through Google Gemini in order to only show the delete button to the user that created the channel*/}
            {(item.created_by === userId || role === 'admin') && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChannel(item.id)}>
                <Text style={styles.deleteButtonText}>-</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        // Researched from RefreshControl documentation at https://reactnative.dev/docs/refreshcontrol
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/*The modal was researched through React documentation at https://reactnative.dev/docs/modal*/}
      <Modal 
        animationType = "fade" 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverview}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Create Your Channel Here!</Text> 
            <InputField placeHolderValue='Channel Name' value={newChannelName} onChangeText={setNewChannelName}/>
            <InputField placeHolderValue='Radius in Meters' value={newChannelRadius} onChangeText={setNewChannelRadius}/>
              <View style={styles.buttonDesign}>
                <ButtonComponent title="Close" actionWhenPressed={() => setModalVisible(false)}/>
                <ButtonComponent title="Enter" actionWhenPressed={() => handleInsertCommunityChannel()}/>
              </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity 
        style={styles.fab} onPress={() => setModalVisible(true)}>
        {/*Display plus sign for button*/}
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingTop: 100},
  text: { fontSize: 20, fontWeight: 'bold', textAlign: 'center'},
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#60a9da', width: '100%', flexDirection: 'row', alignItems: 'center' },
  itemContainer: { flex: 1},
  fab: {position: 'absolute', 
    right: 25, 
    bottom: 30, 
    zIndex: 10, 
    backgroundColor: '#5895d3', 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    alignItems: 'center', 
    justifyContent: 'center',
    //This was taken from Google Gemini in order to shadow correctly for Android and iOS
    elevation: 8, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { fontSize: 30, 
    color: 'white', 
    fontWeight: 'bold', 
    marginTop: -4},
  // The modal was researched through React documentation at https://reactnative.dev/docs/modal
  modalOverview: { 
    flex: 1, 
    justifyContent: 'flex-end', // did this to position model at bottom of screen in order to make it convinient for users to type while walking 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal:{
    height: 300,
    margin: 25, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 35, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 2, height: 5 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 6, 
    elevation: 4},
  modalText: { marginBottom: 15, 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: 'bold'},
  buttonDesign: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

    //This was taken from Google Gemini in order to shadow correctly for Android and iOS
    elevation: 8, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: -5,
  },
});
