import React, { useState } from 'react';
import {StyleSheet, TextInput, View, Image, Text} from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { useNavigation } from '@react-navigation/native';

//<Text style={styles.smallTextDesign}>{'Ensuring High-Speed Connectivity'}</Text>

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignUp() {
      const response = await fetch('http://192.168.1.218:3000/auth/register', {                                                                                                    
          method: 'POST',                                                                                                                                                          
          headers: { 'Content-Type': 'application/json' },                                                                                                                         
          body: JSON.stringify({ username, email, password })                                                                                                                      
      })          
      const data = await response.json()
      console.log(data) 
      if (response.ok) {
          navigation.navigate('MainApp')
      } 
      else {                                                                                                                                                                     
          alert(data.message || 'Sign up failed')
      }                                                                                                                                                                            
  }        

  return(<View style={styles.container}>
        <Text style={styles.labelDesign}>{'Sign Up'}</Text>
        <InputField placeHolderValue='Email' value={email} onChangeText={setEmail}/>
        <InputField placeHolderValue='Username' value={username} onChangeText={setUsername}/>
        <InputField placeHolderValue='Password' value={password} onChangeText={setPassword}/>
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
    top: 135,
  },
  buttonLoginDesign: {
    marginTop: 15,
  },
});
