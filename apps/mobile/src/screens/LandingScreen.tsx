import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ButtonComponent from '../components/button-style';
import ImageLogo from '../components/login-logo';
import { useTheme } from '../context/ThemeContext';

export default function LandingScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <View style={styles.content}>
        <ImageLogo />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          ProXima
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Discover conversations nearby
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <ButtonComponent
          title="Sign In"
          actionWhenPressed={() => navigation.navigate('LoginScreen')}
          variant="primary"
        />
        <ButtonComponent
          title="Create Account"
          actionWhenPressed={() => navigation.navigate('SignUp')}
          variant="secondary"
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('MainApp')}
        style={styles.devSkip}
        activeOpacity={0.5}
      >
        <Text style={[styles.devSkipText, { color: theme.colors.text.tertiary }]}>
          Skip to app
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  devSkip: {
    position: 'absolute',
    bottom: 48,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  devSkipText: {
    fontSize: 13,
    fontWeight: '400',
  },
});
