import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

export default function LoginFormScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();

  async function handleLogin() {
    setErrorMsg('');
    const response = await fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log('Login data:', { userId: data.user.id, token: data.accessToken });
      navigation.navigate('MainApp', {
        screen: 'NearbyList',
        params: {
          userId: data.user.id,
          token: data.accessToken,
        },
      });
    } else {
      setErrorMsg(data.error || 'Login failed');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <Text style={[styles.title, { color: theme.colors.primary[500] }]}>
        Welcome Back
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Sign in to your account
      </Text>

      <View style={styles.formContainer}>
        <InputField
          placeHolderValue="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeHolderValue="Password"
          value={password}
          onChangeText={setPassword}
        />

        {errorMsg ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errorMsg}
          </Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <ButtonComponent
            title="Sign In"
            actionWhenPressed={handleLogin}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    width: '85%',
    fontSize: 14,
    fontWeight: '500',
  },
});
