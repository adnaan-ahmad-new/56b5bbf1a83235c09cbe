import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios'

import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationList, setLocationList] = useState([] as any)
  const [currentTimestamp, setCurrentTimestamp] = useState('')
  const [currentLatitude, setCurrentLatitude] = useState('')

  useEffect(() => {

    const interval = setInterval(() => {

      (async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        setLocation(location);
        setCurrentLatitude(location.coords.latitude)
        setCurrentTimestamp(location.timestamp)
        if (locationList.length === 30) {
          locationList.pop(location)
        }
        locationList.push(location)
      })();
      // setLocationList([...locationList, location])
    }, 10000);



    updateLocation()

    return () => clearInterval(interval);

  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location)
    // setLocationList([...locationList, location])
  }

  const updateLocation = () => {

    const postBody = {
      "location_name": currentLatitude,
      "time": currentTimestamp
    }

    axios({
      method: 'post',
      url: 'https://httpstat.us/200',
      headers: { 'Content-Type': 'application/json' },
      data: postBody
    })
      .then((response) => {
        console.log('response', response.status)
      })
      .catch(function (error: any) {
        console.log('error', error.response.data.message)
      })
  }

  return (
    <ScrollView style={styles.container}>
      {locationList.map((item: any) => (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.paragraph}>Latitude - {item.coords.latitude}</Text>
          <Text style={styles.paragraph}>Longitude - {item.coords.longitude}</Text>
          <Text style={styles.paragraph}>Timestamp - {item.timestamp}</Text>
        </View>
      ))}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    marginLeft: 20,
    marginBottom: 20
  },
  paragraph: {

  }
})