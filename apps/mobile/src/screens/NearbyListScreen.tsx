import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SectionList, RefreshControl, TouchableOpacity, Modal, Alert, Animated, Image} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
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

const ChannelImages: Record<string, any> = {
  'Ben Hill Griffin Stadium': require('../assets/channel-icons/Ben_Hill_Griffin.jpg'),
  'Broward Dining': require('../assets/channel-icons/Broward_Dining.jpeg'),
  'Carleton Auditorium': require('../assets/channel-icons/Carleton.jpg'),
  'Curtis M. Phillips Center': require('../assets/channel-icons/Curtis_M_Phillips.jpg'),
  'Flavet Field': require('../assets/channel-icons/Flavet_Field.png'),
  'Gator Corner': require('../assets/channel-icons/Gator_Corner.jpg'),
  'Lake Alice': require('../assets/channel-icons/Lake_Alice.jpeg'),
  'Library West': require('../assets/channel-icons/Lib_West.jpg'),
  'Little Hall': require('../assets/channel-icons/Little_Hall.jpg'),
  'Malachowsky Hall': require('../assets/channel-icons/Malachowsky.jpg'),
  'Marston Science Library': require('../assets/channel-icons/Marston_Library.jpg'),
  'Matherly Hall': require('../assets/channel-icons/Matherly_Hall.jpg'),
  'Plaza of the Americas': require('../assets/channel-icons/Plaza.jpg'),
  'Reitz Union': require('../assets/channel-icons/Reitz_Union.jpg'),
  'Southwest Rec Center': require('../assets/channel-icons/SW_Rec.jpeg'),
  'Student Rec Center': require('../assets/channel-icons/Student_Rec.png'),
  'The Hub': require('../assets/channel-icons/The_Hub.jpeg'),
  'Turlington Hall': require('../assets/channel-icons/Turlington.jpg'),
  'The Swamp': require('../assets/channel-icons/UF.png'),
};

const OfficialLocations: Record<string, { lat: string; lng: string; radius: string }> = {
  'Marston Science Library': { lat: "29.648200894251136", lng: "-82.34340824166277", radius: "50" },
  'Turlington Hall': { lat: "29.64930135428443", lng: "-82.34399647492198", radius: "50" },
  'Reitz Union': { lat: "29.64666502357952", lng: "-82.3479590979477", radius: "80" },
  'Library West': {lat: "29.651510420406968", lng: "-82.34204003701252", radius: "50"},
  'Plaza of the Americas': {lat: "29.65070636085747", lng: "-82.34280258149158", radius: "80"},
  'Student Rec Center': {lat: "29.650494991604592", lng: "-82.34670833351034", radius: "60"},
  'Ben Hill Griffin Stadium': {lat: "29.650018177304965", lng: "-82.34872707336257", radius: "150"},
  'Malachowsky Hall': {lat: "29.64410710874499", lng: "-82.34725918922416", radius: "60"},
  'Southwest Rec Center': {lat: "29.638845164498186", lng: "-82.36834360713067", radius: "100"},
  'Carleton Auditorium': {lat: "29.64925817663425", lng: "-82.34162489179809", radius: "40"},
  'Little Hall': {lat: "29.64891079595824", lng: "-82.34064958779955", radius: "40"},
  'Broward Dining': {lat: "29.647154655423552", lng: "-82.34140934822895", radius: "40"},
  'The Hub': {lat: "29.64824853577638", lng: "-82.3454233222773", radius: "40"},
  'Gator Corner': {lat: "29.648282969009838", lng: "-82.35006101484998", radius: "40"},
  'Flavet Field': {lat: "29.646891243700114", lng: "-82.35429342709683", radius: "150"},
  'Lake Alice': {lat: "29.64339692466425", lng: "-82.36227247711908", radius: "200"},
  'Matherly Hall': {lat: "29.651686466958722", lng: "-82.34102783162135", radius: "40"},
  'Curtis M. Phillips Center': {lat: "29.635481784725847", lng: "-82.36935964796055", radius: "80"},
  'The Swamp': {lat: "29.648064621555974", lng: "-82.35335097738442", radius: "1500"},
};

export default function ChannelListScreen({ navigation, route }: any) {
  const { userId, token, role } = route.params || {};
  const theme = useTheme();
  console.log('NearbyList params:', { userId, token });
  const { location, errorMsg } = useLocation();
  const [channels, setChannels] = useState<{ official: Channel[]; nearby: Channel[]; other: Channel[] }>({ official: [], nearby: [], other: [] });

  let text = 'Waiting to obtain location...';
  const [checkStatus, setCheckStatus] = useState(text);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelRadius, setNewChannelRadius] = useState('');
  const [newChannelLat, setNewChannelLat] = useState('');
  const [newChannelLng, setNewChannelLng] = useState('');

  const handleNameChange = (text: string) => {
  setNewChannelName(text); // Still update the name normally

  // If the typed name is in our dictionary, auto-fill
  if (OfficialLocations[text]) {
    setNewChannelLat(OfficialLocations[text].lat);
    setNewChannelLng(OfficialLocations[text].lng);
    setNewChannelRadius(OfficialLocations[text].radius);
  }
};

  // need this in order to have refresh capabilities
  const displayChannels = async () => {
    if (!location) {
      return;
    }

    if (!token) {
      setCheckStatus('User not authenticated. Please log in again.');
      return;
    }

    const latitude = location.coords.latitude; // store latitude
    const longitude = location.coords.longitude; // store longitude

    console.log(`[Fetching Channels] Lat: ${latitude}, Lng: ${longitude}`);

    try{
      const [nearbyResponse, allResponse] = await Promise.all([
        fetch(`${SERVER_URL}/channels/nearby?lat=${latitude}&lng=${longitude}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${SERVER_URL}/channels/all`),
      ]);

      const nearbyData = await nearbyResponse.json();
      const allData = await allResponse.json();

      const nearbyChannels: Channel[] = nearbyData.channels || [];
      const allChannels: Channel[] = allData.channels || [];

      // Filter out nearby channels from the full list to get "other" channels
      const nearbyIds = new Set(nearbyChannels.map(c => c.id));
      const otherChannels = allChannels.filter(c => !nearbyIds.has(c.id));

      setChannels({
        official: [],
        nearby: nearbyChannels,
        other: otherChannels,
      });

      if (nearbyChannels.length === 0 && otherChannels.length === 0) {
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

    // Admin must provide lat/lng manually for official channels
    if (role === 'admin') {
      if (!newChannelLat.trim() || !newChannelLng.trim() || isNaN(Number(newChannelLat)) || isNaN(Number(newChannelLng))) {
        Alert.alert('Please enter valid latitude and longitude.');
        return;
      }
    }

    try {
      // Lines 91-105 were researched through Google Gemini in order to get the token in the frontend
      if (!token) {
        Alert.alert('User not authenticated. Please log in again.');
        return;
      }

      if (!location && role !== 'admin') {
        Alert.alert('Error in obtaining location.');
        return;
      }

      // Admin uses manually entered coordinates, members use their current location
      const channelLat = role === 'admin' ? Number(newChannelLat) : location!.coords.latitude;
      const channelLng = role === 'admin' ? Number(newChannelLng) : location!.coords.longitude;

      const response = await fetch(`${SERVER_URL}/channels`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Will utilize requireAuth
             },
            body: JSON.stringify({
              name: newChannelName,
              lat: channelLat,
              lng: channelLng,
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
        setNewChannelLat('');
        setNewChannelLng('');
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

  const sections = [
    ...(channels.nearby.length > 0 ? [{ title: 'Nearby Communities', data: channels.nearby }] : []),
    ...(channels.other.length > 0 ? [{ title: 'All Communities', data: channels.other }] : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.colors.text.primary }]}>
          Communities
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
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.list, { flexGrow: 1 }]}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: theme.colors.text.secondary }]}>
            {title}
          </Text>
        )}
        renderItem={({ item, section }) => {
          const isOutOfRange = section.title === 'All Communities' && role !== 'admin';
          const canDelete = item.created_by === userId || role === 'admin';

          const renderDeleteAction = () => (
            <TouchableOpacity
              style={styles.deleteAction}
              onPress={() => {
                Alert.alert('Delete Channel', `Are you sure you want to delete "${item.name}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteChannel(item.id) },
                ]);
              }}
            >
              <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
          );

          const channelRow = (
            <TouchableOpacity
              style={[styles.channelRow, { backgroundColor: theme.colors.secondary.light, borderColor: theme.colors.secondary[200] }, isOutOfRange && styles.channelRowDisabled]}
              activeOpacity={isOutOfRange ? 0.8 : 0.6}
              onPress={() => {
                if (isOutOfRange) {
                  Alert.alert('Out of Range', 'This community is out of range. Move closer to join.');
                  return;
                }
                navigation.navigate('ChatScreen', {
                  channelId: item.id,
                  channelName: item.name,
                  userId: userId,
                  token: token,
                });
              }}
            >
              <View style={[styles.channelIcon, { backgroundColor: theme.colors.secondary[200], overflow: 'hidden' }]}>
                {item.type === 'official' && ChannelImages[item.name] ? (
                  // Uses image if it's an official channel with a known image
                  <Image
                    source={ChannelImages[item.name]}
                    style={{width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[styles.channelIconText, { color: theme.colors.secondary.dark }]}>
                    {item.type === 'official' ? '#' : '~'}
                  </Text>
                )}
              </View>
              <View style={styles.channelDetails}>
                <Text style={[styles.channelName, { color: theme.colors.text.primary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.channelType, { color: theme.colors.text.secondary }]}>
                  {item.type === 'official' ? 'Official' : 'Local'}
                </Text>
              </View>
            </TouchableOpacity>
          );

          if (!canDelete) return channelRow;

          return (
            <Swipeable
              renderRightActions={renderDeleteAction}
              overshootRight={false}
            >
              {channelRow}
            </Swipeable>
          );
        }}
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
              {role === 'admin' ? 'Create Official Channel' : 'Create Community'}
            </Text>
            <InputField placeHolderValue="Channel Name" value={newChannelName} onChangeText={handleNameChange} />
            <InputField placeHolderValue="Radius in Meters" value={newChannelRadius} onChangeText={setNewChannelRadius} />
            {role === 'admin' && (
              <>
                <InputField placeHolderValue="Latitude" value={newChannelLat} onChangeText={setNewChannelLat} />
                <InputField placeHolderValue="Longitude" value={newChannelLng} onChangeText={setNewChannelLng} />
              </>
            )}
            <View style={styles.modalButtons}>
              <ButtonComponent title="Cancel" actionWhenPressed={() => setModalVisible(false)} variant="secondary" compact />
              <ButtonComponent title="Create" actionWhenPressed={() => handleInsertCommunityChannel()} variant="primary" compact />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.secondary.dark }]}
        onPress={() => {
          Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Log Out',
              style: 'destructive',
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Landing' }],
                  })
                );
              },
            },
          ]);
        }}
      >
        <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
      </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 4,
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
  channelRowDisabled: {
    opacity: 0.5,
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
  deleteAction: {
    backgroundColor: '#D45B5B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginVertical: 3,
    borderRadius: 12,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
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
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
