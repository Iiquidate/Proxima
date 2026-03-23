// This is the login screen
import React from 'react';
import {StyleSheet, View, Image, Text, Button} from 'react-native';
import ButtonComponent from '../components/button-style';
import ImageLogo from '../components/login-logo';

export default function LandingScreen({ navigation }: any) {

    return (
      <View style={styles.container}>
          <ImageLogo/>
          <Text style={styles.labelDesign}>{'ProXIma'}</Text>
          <View style={styles.buttonLoginDesign}>
              <ButtonComponent title="Login"   actionWhenPressed={() => {navigation.navigate('LoginScreen')}}/>
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
