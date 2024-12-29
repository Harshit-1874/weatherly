import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Image, StatusBar, Dimensions, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import Constants from 'expo-constants'

const openWeatherKey = Constants.expoConfig.extra.openWeatherApiKey
console.log(Constants);

let url = `http://api.openweathermap.org/data/2.5/weather?&units=metric&exclude=minutely&APPID=${openWeatherKey}`;

const Weatherly = () => {

  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currDateTime, setCurrDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false); // Track theme mode
  
  // Function to toggle dark/light mode
  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  function toProperCase(str) {
    return str
      .split(' ')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  
  const loadForecast = async () => {
    setRefreshing(true);
    // ask for access location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      Alert.alert('Location access is required to get weather forecast');
      setRefreshing(false);
    }
    // get the current location
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    // fetches data from weather map
    const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const data = await response.json();

    if(!response.ok){
      Alert.alert('Error', 'Something went wrong');
      setRefreshing(false);
    } else {
      setForecast(data);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadForecast();
  },[]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrDateTime(new Date())
    }, 1000);

    return ()=> clearInterval(timer);
  })

  if(!forecast){
    return(
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  }

  const curr = forecast.weather[0];
  
  // Select styles based on the theme mode
  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const titleStyle = isDarkMode ? styles.darkTitle : styles.lightTitle;
  const dscStyle = isDarkMode ? styles.darkDesc : styles.lightDesc;

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast()}
          />
        }
      >
        <View style={styles.switchContainer}>
            <Text style={textStyle}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleSwitch}
            />
          </View>
        <View style={styles.header}>
          <Text style={titleStyle}>
            Current Weather 
          </Text>
        </View>

        <Text style={[textStyle, {textAlign: 'center'}]}>
          Your Location - {forecast.name}
        </Text>
        <View style={styles.current}>
          <Image 
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${curr.icon}@4x.png`
            }}
          />
          <Text style={styles.currentTemp}>
            {Math.round(forecast.main.temp)}°C
          </Text>
        </View>

        <Text style={dscStyle}>
          {toProperCase(curr.description)}
        </Text>

        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Image
              source={require('../assets/humidity.png')}
              style={{width: 40, height:40, borderRadius: 20}}
            />
            <Text style={styles.InfoText}>
              {forecast.main.humidity}%
            </Text>
            <Text style={styles.InfoText}>
              Humidity
            </Text>
          </View>

          <View style={styles.info}>
            <Image
              source={require('../assets/humidity.png')}
              style={{width: 40, height:40, borderRadius: 20}}
            />
            <Text style={styles.InfoText}>
              {forecast.main.feels_like}°C
            </Text>
            <Text style={styles.InfoText}>
              Feels Like
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.subTitle}>
            {currDateTime.toLocaleString()}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Weatherly

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#333',
    width: '100%',
  },
  lightText: {
    color: '#000',
    fontWeight: 500,
  },
  darkText: {
    color: 'aqua',
  },
  InfoText: {
    color: '#000',
    fontWeight: 'bold'
  },
  lightTitle: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333'
  },
  darkTitle: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: 'aqua'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  current: {
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    gap: 40,
    alignContent: 'center',
  },
  largeIcon: {
    width: 200,
    height: 150,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0AF',
    textAlign: 'center',
  },
  darkDesc: {
    fontSize: 20,
    color: 'aqua',
    fontWeight: 600,
    textAlign: 'center',
    width: '100%',
    marginBottom: 5,
  },
  lightDesc: {
    fontSize: 20,
    color: 'black',
    fontWeight: 600,
    textAlign: 'center',
    width: '100%',
    marginBottom: 5,
  },
  info:{
    width: Dimensions.get('screen').width/2.5,
    backgroundColor: 'aqua',
    opacity: 0.7,
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  extraInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 10,
  },
  text:{
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 600,
  },
  subTitle:{
    fontSize: 24,
    color: '#0AF',
    marginVertical: 20,
    textAlign:'center',
    marginLeft: 17,
    fontWeight: 'bold',
  }
})
