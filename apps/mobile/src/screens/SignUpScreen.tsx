import React from 'react';
import {StyleSheet, TextInput, View, Image, Text, Alert} from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { useNavigation } from '@react-navigation/native';

//<Text style={styles.smallTextDesign}>{'Ensuring High-Speed Connectivity'}</Text>

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  const handleSignUp = async () => {
    //Lines 15-25 were researched from Google Gemini
    try{
      // Send JSON format of user infromation to my laptop's server/supabase
      const response = await fetch('http://YOUR_LAPTOP_IP:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      // Wait to get response from supabase/server
      const data = await response.json();

      // Lines 30-38 were researched from VScode
      if (response.ok) {
        Alert.alert("Success", data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert("Error", data.error || "Registration failed");
      } 

    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  }

  return(<View style={styles.container}>
        <Text style={styles.labelDesign}>{'Sign Up'}</Text>
        <InputField placeHolderValue='Username' onChangeText={setUsername}/>
        <InputField placeHolderValue='Email' onChangeText={setEmail}/>
        <InputField placeHolderValue='Password' onChangeText={setPassword}/>
        <View style={styles.buttonLoginDesign}>
            <ButtonComponent title="Create Account" actionWhenPressed={handleSignUp}/>
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
  labelDesign:{
    fontSize:70,
    color: '#60a9da',
    fontWeight: '500',
    position: 'absolute',
    top: 150,
  },
  buttonLoginDesign: {
    marginTop: 15,
  },
});
