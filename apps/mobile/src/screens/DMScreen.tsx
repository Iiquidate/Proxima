import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function DMScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Direct Messages
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 15, fontWeight: '400' },
});
