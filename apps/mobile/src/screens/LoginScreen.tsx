import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';                                                                                                                   
import ButtonComponent from '../components/button-style';                                                                                                                        
import InputField from '../components/input-fields';                                                                                                                             
                                                                                                                                                                                
export default function LoginFormScreen({ navigation }: any) {
    const [email, setEmail] = useState('')                                                                                                                                       
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
                                                                                                                                                                               
    async function handleLogin() {
        setErrorMsg('')  // clear any previous error before trying
    //  find your ip with `ipconfig getifaddr en0` on mac or `ipconfig` on windows (IPv4)
        const response = await fetch('http://YOUR_IP:3000/auth/login', {                                                                                                   
            method: 'POST',                                                                                                                                                      
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })                                                                                                                            
        })                                                                                                                                                                       
        const data = await response.json()
        console.log(data);
        if (response.ok) {                                                                                                                                                       
            navigation.navigate('MainApp')
        } 
        else {
          setErrorMsg(data.error || 'Login failed')
        }                                                                                                                                                                        
    }
                                                                                                                                                                                
    return (    
        <View style={styles.container}>
            <Text style={styles.labelDesign}>Login</Text>
            <InputField placeHolderValue='Email' value={email} onChangeText={setEmail}/>                                                                                         
            <InputField placeHolderValue='Password' value={password} onChangeText={setPassword}/>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            <View style={styles.buttonDesign}>                                                                                                                                   
                <ButtonComponent title="Login" actionWhenPressed={handleLogin}/>
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
    labelDesign: {
        fontSize: 70,                                                                                                                                                            
        color: '#60a9da',
        fontWeight: '500',
        position: 'absolute',
        top: 175
    },                                                                                                                                                                           
    buttonDesign: {
        marginTop: 15,                                                                                                                                                           
    },
    errorText: {
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
        width: '85%',
    },         
});