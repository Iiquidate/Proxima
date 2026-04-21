import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ButtonComponent from '../components/button-style';
import ProximaLogo from '../components/ProximaLogo';
import { useTheme } from '../context/ThemeContext';

// landing page with sign in and create account buttons
export default function LandingScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <View style={styles.content}>
        <ProximaLogo width={280} />
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
  buttonGroup: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
});
