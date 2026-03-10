// This is the login screen
import React from 'react';
import {StyleSheet, TextInput, View, Image, Text} from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import ImageLogo from '../components/login-logo';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <ImageLogo />
            <Text style={styles.labelDesign}>{'ProXIma'}</Text>
            <InputField placeHolderValue='Username'/>
            <InputField placeHolderValue='Password'/>
            <View style={styles.buttonLoginDesign}>
                <ButtonComponent title="Login" actionWhenPressed={() => {}}/>
                <ButtonComponent title="Sign Up" actionWhenPressed={() => {}}/>
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
