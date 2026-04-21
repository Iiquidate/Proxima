import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

// sign up form that registers a new user and navigates to the main app
export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();

  // sends registration request to the server and navigates on success
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
      Keyboard.dismiss();
      const userRole = data.user?.role || 'member';
      navigation.navigate('MainApp', {
        userId: data.user.id,
        token: data.session?.access_token,
        role: userRole,
      });
    } else {
      setErrorMsg(data.error || 'Signup failed');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.surface.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Create account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Join your local community
          </Text>
        </View>

        <View style={styles.form}>
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
            secureTextEntry
          />

          {errorMsg ? (
            <View style={[styles.errorBox, { backgroundColor: '#FDF2F2', borderColor: '#F5DBDB' }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errorMsg}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <ButtonComponent
              title="Create Account"
              actionWhenPressed={handleSignUp}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
