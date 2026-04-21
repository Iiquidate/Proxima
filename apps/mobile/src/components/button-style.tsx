import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ButtonBasics = {
  title: string;
  actionWhenPressed: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  compact?: boolean;
};

// reusable button component with primary, secondary, outline, and danger variants
export default function ButtonComponent({
  title,
  actionWhenPressed,
  variant = 'primary',
  compact = false,
}: ButtonBasics) {
  const theme = useTheme();

  // returns the background and border styles for the current variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.light,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.primary[400],
        };
      case 'danger':
        return {
          backgroundColor: '#D45B5B',
        };
      default:
        return {
          backgroundColor: theme.colors.primary[400],
        };
    }
  };

  // returns the text color for the current variant
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return { color: theme.colors.secondary.dark };
      case 'outline':
        return { color: theme.colors.primary[400] };
      case 'danger':
        return { color: '#FFFFFF' };
      default:
        return { color: theme.colors.text.inverse };
    }
  };

  return (
    <TouchableOpacity onPress={actionWhenPressed} activeOpacity={0.7}>
      <View style={[styles.button, getButtonStyle(), compact && styles.buttonCompact]}>
        <Text style={[styles.buttonText, getTextStyle()]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 12,
    minWidth: 200,
  },
  buttonCompact: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
