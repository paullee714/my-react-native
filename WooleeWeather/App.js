import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Image } from 'react-native';
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "81299852006f836010fcfc8a56544ea8";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [isKr, setIsKr] = useState(false);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    )
    setCity(location[0].city);
    if (location[0].isoCountryCode === "KR") {
      setIsKr(true);
    }
    const url = isKr ? `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr` : `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();
    setDays(json.daily)
    // console.log(json.daily.length)
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
        horizontal
      >
        {days.length === 0 ?
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator size="large" color="white" />
          </View>
          :
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>

                <Image source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` }}
                  style={{ width: 80, height: 80, marginBottom: -20 }} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.desc}>{day.weather[0].main}</Text>
                <Fontisto style={{ marginLeft: 10 }} name={icons[day.weather[0].main]} size={25} color="white" />
              </View>
              <Text style={styles.weatherDesc}>{day.weather[0].description}</Text>
              {index === 0 ? <Text style={styles.weatherDesc}>Today</Text>
                :
                <Text style={styles.weatherDesc}>Day + {index}</Text>
              }
            </View>
          )
        }
      </ScrollView >

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 78,
    fontWeight: "700",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  desc: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  weatherDesc: {
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  }
});