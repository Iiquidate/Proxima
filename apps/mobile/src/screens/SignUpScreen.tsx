import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();

  async function handleSignUp() {
    setErrorMsg('');
    const response = await fetch(`${SERVER_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      navigation.navigate('MainApp', {
        screen: 'NearbyList',
        params: {
          userId: data.user.id,
          token: data.session?.access_token,
        },
      });
    } else {
      setErrorMsg(data.error || 'Signup failed');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.default }]}>
      <Text style={[styles.title, { color: theme.colors.primary[500] }]}>
        Create Account
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Join the community
      </Text>

      <View style={styles.formContainer}>
        <InputField
          placeHolderValue="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeHolderValue="Username"
          value={username}
          onChangeText={setUsername}
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
            title="Create Account"
            actionWhenPressed={handleSignUp}
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
