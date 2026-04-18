// Input logo on login page
import { Image, StyleSheet, View } from 'react-native';

export default function ImageLogo() {
    return(
        <View style={styles.logoContainer}>
            <Image style={styles.imageDimensions}
                source={require('../../assets/android-icon-foreground.png')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  imageDimensions: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
});
