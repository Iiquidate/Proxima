// This is a custom hook, since useLocation doesn't exist in Expo
//Location library and tools needed (conducted form online research)
import * as Location from 'expo-location';
import { useEffect, useState } from 'react'; // useState stores data, useffect runs when screen loads

export function useLocation() {
    //Code was researched from Expo documentation itself at https://docs.expo.dev/versions/latest/sdk/location/
      const [location, setLocation] = useState<Location.LocationObject | null>(null);
      const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
      // UseEFfect allows logic to run constantly while user is in the app
      useEffect(() => {
        async function getCurrentLocation(){
          let {status} = await Location.requestForegroundPermissionsAsync(); // Ask user for GPS permissions
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          // Keep checking user location
          await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // ping every 10 seconds
            distanceInterval: 10 // only change location data when there is more than 10 meters difference from last position
          },
          (location) => {
            setLocation(location);
          });
        }
        getCurrentLocation();
      }, []);

      return {location, errorMsg};
}
