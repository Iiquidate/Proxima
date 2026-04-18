import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import ButtonComponent from '../components/button-style';
import ImageLogo from '../components/login-logo';
import { useTheme } from '../context/ThemeContext';

export default function LandingScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <View style={styles.content}>
        <ImageLogo />
        <Text style={[styles.title, { color: theme.colors.primary[500] }]}>
          ProXima
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Connect with people nearby
        </Text>

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
      </View>

      <View style={styles.devSkip}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainApp')}
          style={[styles.devButton, { borderColor: theme.colors.error }]}
        >
          <Text style={[styles.devButtonText, { color: theme.colors.error }]}>
            Developer Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 32,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 12,
    minWidth: 200,
  },
  devSkip: {
    position: 'absolute',
    bottom: 40,
  },
  devButton: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
