import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: string;
  username: string;
  role: string;
}

// displays a list of users who have participated in a channel's chat
export default function ChannelMembersScreen({ route }: any) {
  const { channelId, channelName, token } = route.params;
  const theme = useTheme();
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/channels/${channelId}/participants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setParticipants(data.participants || []);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [channelId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <FlatList
        data={participants}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>
            No messages yet in this channel.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.userRow, { backgroundColor: theme.colors.secondary.light, borderColor: theme.colors.secondary[200] }]}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.secondary[200] }]}>
              <Text style={[styles.avatarText, { color: theme.colors.secondary.dark }]}>
                {item.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.username, { color: theme.colors.text.primary }]}>
              {item.username}
            </Text>
            {item.role === 'admin' && (
              <Text style={[styles.roleTag, { color: theme.colors.secondary.dark }]}>Admin</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 40,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  roleTag: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
