import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type InputFieldBasics = {
  placeHolderValue: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

// reusable themed text input with placeholder and optional secure entry
export default function InputField({
  placeHolderValue,
  value,
  onChangeText,
  secureTextEntry,
}: InputFieldBasics) {
  const theme = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: theme.colors.border.default,
          color: theme.colors.text.primary,
          backgroundColor: theme.colors.surface.light,
        },
      ]}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeHolderValue}
      placeholderTextColor={theme.colors.text.tertiary}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    width: '100%',
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
  },
});
