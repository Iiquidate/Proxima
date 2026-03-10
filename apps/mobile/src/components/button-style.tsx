// This create the style for all buttons in general
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Establish title as string an actionWhenPressed to do nothing
type ButtonBasics = {
  title: string;
  actionWhenPressed: () => void;
};

// This implementation was influenced from React Native source at https://reactnative.dev/docs/handling-touches
export default function ButtonComponent({title, actionWhenPressed}: ButtonBasics) {
    return(
        <TouchableOpacity onPress={actionWhenPressed} activeOpacity={0.7}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  // Styles came from React Native source at https://reactnative.dev/docs/view-style-props
  button: {
    marginBottom: 30,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#5895d3',
    borderRadius: 30,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
