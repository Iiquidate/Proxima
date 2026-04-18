import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ButtonBasics = {
  title: string;
  actionWhenPressed: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
};

export default function ButtonComponent({
  title,
  actionWhenPressed,
  variant = 'primary'
}: ButtonBasics) {
  const theme = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary[500],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary[500],
        };
      default:
        return {
          backgroundColor: theme.colors.primary[500],
        };
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: theme.colors.primary[500] };
    }
    return { color: theme.colors.text.inverse };
  };

  return (
    <TouchableOpacity onPress={actionWhenPressed} activeOpacity={0.75}>
      <View style={[styles.button, getButtonStyle()]}>
        <Text style={[styles.buttonText, getTextStyle()]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
