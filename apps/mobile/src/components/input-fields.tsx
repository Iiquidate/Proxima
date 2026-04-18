import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type InputFieldBasics = {
  placeHolderValue: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputField({
  placeHolderValue,
  value,
  onChangeText
}: InputFieldBasics) {
  const theme = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: theme.colors.border.light,
          color: theme.colors.text.primary,
          backgroundColor: theme.colors.surface.light,
        },
      ]}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeHolderValue}
      placeholderTextColor={theme.colors.text.tertiary}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: '85%',
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
