// This is for input fields, such as username and pssword for login or sign up
// Code was influenced by React Native source at https://reactnative.dev/docs/textinput

import React from 'react';
import { useEffect, useState } from 'react';
import {StyleSheet, TextInput} from 'react-native';

type InputFieldBasics = {
    placeHolderValue: string;
    onChangeText: (text: string) => void;
}

export default function InputField({placeHolderValue, onChangeText}: InputFieldBasics) {
    return(
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder={placeHolderValue}
        />
    );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '85%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
