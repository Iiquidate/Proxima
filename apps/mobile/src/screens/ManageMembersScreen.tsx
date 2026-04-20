import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function ManageMembersScreen({ route }: any) {
  const { channelId, channelName, token } = route.params;
  const theme = useTheme();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    try {
      const [usersRes, membersRes] = await Promise.all([
        fetch(`${SERVER_URL}/channels/users/all`, { headers: authHeaders }),
        fetch(`${SERVER_URL}/channels/${channelId}/members`, { headers: authHeaders }),
      ]);

      const usersData = await usersRes.json();
      const membersData = await membersRes.json();

      setAllUsers(usersData.users || []);
      setMembers(membersData.members || []);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const memberIds = new Set(members.map(m => m.id));

  const addMember = async (userId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/channels/${channelId}/members`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchData();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const removeMember = async (userId: string, username: string) => {
    Alert.alert('Remove Member', `Remove ${username} from this channel?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${SERVER_URL}/channels/${channelId}/members/${userId}`, {
              method: 'DELETE',
              headers: authHeaders,
            });

            if (response.ok) {
              await fetchData();
            } else {
              const data = await response.json();
              Alert.alert('Error', data.error || 'Failed to remove member');
            }
          } catch (error) {
            console.error('Error removing member:', error);
          }
        },
      },
    ]);
  };

  const filteredUsers = allUsers.filter(
    u => u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      {/* Current Members */}
      {members.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text.secondary }]}>
            Current Members
          </Text>
          {members.map(member => (
            <View key={member.id} style={[styles.userRow, { backgroundColor: theme.colors.secondary.light, borderColor: theme.colors.secondary[200] }]}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.secondary[200] }]}>
                <Text style={[styles.avatarText, { color: theme.colors.secondary.dark }]}>
                  {member.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.username, { color: theme.colors.text.primary }]}>
                {member.username}
              </Text>
              <TouchableOpacity
                onPress={() => removeMember(member.id, member.username)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="close-circle" size={22} color="#D45B5B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Add Members */}
      <View style={[styles.section, { flex: 1 }]}>
        <Text style={[styles.sectionHeader, { color: theme.colors.text.secondary }]}>
          Add Members
        </Text>
        <TextInput
          style={[styles.searchInput, {
            borderColor: theme.colors.border.default,
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.surface.light,
          }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search users..."
          placeholderTextColor={theme.colors.text.tertiary}
          autoCapitalize="none"
        />
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isMember = memberIds.has(item.id);
            return (
              <View style={[styles.userRow, { backgroundColor: theme.colors.secondary.light, borderColor: theme.colors.secondary[200] }]}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.secondary[200] }]}>
                  <Text style={[styles.avatarText, { color: theme.colors.secondary.dark }]}>
                    {item.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.username, { color: theme.colors.text.primary }]}>
                  {item.username}
                </Text>
                {isMember ? (
                  <MaterialCommunityIcons name="check-circle" size={22} color={theme.colors.secondary.dark} />
                ) : (
                  <TouchableOpacity
                    onPress={() => addMember(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialCommunityIcons name="plus-circle" size={22} color={theme.colors.primary[400]} />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
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
  listContent: {
    paddingBottom: 20,
  },
});
