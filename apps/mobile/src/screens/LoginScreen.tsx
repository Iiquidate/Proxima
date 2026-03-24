// This is the login screen
import React from 'react';
import {StyleSheet, TextInput, View, Image, Text, Button, Alert} from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import ImageLogo from '../components/login-logo';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ navigation }: any) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
      //Lines 15-25 were researched from Google Gemini
      try{
      // Send JSON format of user infromation to my laptop's server/supabase
        const response = await fetch('http://YOUR_LAPTOP_IP:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        // Wait to get response from supabase/server
        const data = await response.json();

        // Lines 30-38 were researched from VScode
        if (response.ok) {
          Alert.alert("Success", data.message);
          navigation.navigate('MainApp');
        } else {
          Alert.alert("Error", data.error || "Login failed");
        }
      } catch (error) {
        Alert.alert('Error', 'Server is unreachable. Check Terminal 2.');
      }
    };


    return (
        <View style={styles.container}>
            <ImageLogo />
            <Text style={styles.labelDesign}>{'ProXIma'}</Text>
            <InputField placeHolderValue='Email' onChangeText={setEmail}/>
            <InputField placeHolderValue='Password' onChangeText={setPassword}/>
            <View style={styles.buttonLoginDesign}>
                <ButtonComponent title="Login" actionWhenPressed={handleLogin}/>
                <ButtonComponent title="Sign Up" actionWhenPressed={() => {navigation.navigate('SignUp')}}/>
            </View>  
        <View style={{ position: 'absolute', bottom: 40 }}>
                <Button 
                    title="Developer Skip" 
                    color="red" 
                    onPress={() => navigation.navigate('MainApp')}
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
  },
  labelDesign:{
    fontSize:50,
    color: '#60a9da',
    fontWeight: '500',
    position: 'absolute',
    top: 200,
    fontStyle: 'italic',
  },
  smallTextDesign:{
    color: '#60a9da',
    position: 'absolute',
    top: 270,
  },
  buttonLoginDesign: {
    // Lines 39-41 were researched from Google Gemini
    flexDirection: 'row',
    gap: 20,
    marginTop: 15,
  },
});
