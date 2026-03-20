import React from 'react';
import {StyleSheet, TextInput, View, Image, Text} from 'react-native';
import ButtonComponent from '../components/button-style';
import InputField from '../components/input-fields';
import { useNavigation } from '@react-navigation/native';

//<Text style={styles.smallTextDesign}>{'Ensuring High-Speed Connectivity'}</Text>

export default function SignUpScreen({ navigation }: any) {
  return(<View style={styles.container}>
        <Text style={styles.labelDesign}>{'Sign Up'}</Text>
        <InputField placeHolderValue='Username'/>
        <InputField placeHolderValue='Password'/>
        <View style={styles.buttonLoginDesign}>
            <ButtonComponent title="Create Account" actionWhenPressed={() => {}}/>
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
