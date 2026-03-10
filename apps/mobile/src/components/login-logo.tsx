// Input logo on login page
import {Image, StyleSheet, View} from 'react-native';

export default function ImageLogo() {
    return(
        <Image style={styles.imageDimensions}
            source={require('../../assets/android-icon-foreground.png')}
        />
    );
}

const styles = StyleSheet.create({
  imageDimensions: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 70,
  },
});
