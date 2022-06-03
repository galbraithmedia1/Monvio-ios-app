import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { db, ref, onValue } from "../firebase";

const HomeScreen = () => {
  // const [loaded] = useFonts({
  //     AdventPro: require('./assets/fonts/AdventPro-Regular.ttf'),
  //   });

  //   if (!loaded) {
  //     return null;
  //   }
  const Key = "ed088ac32004347c3513041d87c48e51";
  const [weather, setWeather] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [city, setCity] = useState("");
  const [humidity, setHumidity] = useState("");
  const [humid, setHumid] = useState("");
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [temp, setTemp] = useState("");
  const [uinta, setUinta] = useState("");
  const [convertFtemp, setConvertFtemp] = useState("");
  const [Ftemp, setFtemp] = useState("");

  const [meters, setMeters] = useState("");
  const [convertToFeet, setConverToFeet] = useState("");
  const [Altitude, setAltitude] = useState("");

  const [getPressure, setGetPressure] = useState("");
  const [pressure, setPressure] = useState("");

  const weatherURI = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  //read form db
  useEffect(() => {
    onValue(ref(db, "DHT22/Dhtdata"), (snapshot) => {
      setTemp(Math.round(snapshot.val().temp));
      setHumid(Math.round(snapshot.val().humi));

      setConvertFtemp(temp * (9 / 5) + 32);
      setFtemp(Math.round(convertFtemp));
    });

    onValue(ref(db, "BMP180/Bmpdata"), (snapshot) => {
      setMeters(Math.round(snapshot.val().RealAltitude));
    });

    onValue(ref(db, "BMP180/Bmpdata"), (snapshot) => {
      setGetPressure(Math.round(snapshot.val().Pressure));
    });

    setPressure(Math.round(getPressure / 3386));
    setConverToFeet(3.281 * meters);

    setAltitude(Math.round(convertToFeet));
  }, []);

  console.log(getPressure);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    getWeather(location.coords);
  };

  const lat = 40.860942;
  const long = -110.861963;

  const getWeather = (coords) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${Key}`
        // `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=imperial&appid=${Key}`
      )
      .then((res) => {
        setWeatherIcon(res.data.weather[0].icon);
        setWeather(Math.round(res.data.main.temp));
        setHigh(Math.round(res.data.main.temp_max));
        setLow(Math.round(res.data.main.temp_min));
        setHumidity(res.data.main.humidity);
        setCity(res.data.name);
      });
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["##827a79", "#42444d"]}
        style={styles.backgroundImg}
      >
        <ImageBackground
          source={require("../assets/background2.jpg")}
          style={styles.backgroundImg}
          resizeMode="cover"
          imageStyle={{ opacity: 0.9 }}
        >
          <View style={styles.pageWrapper}>
            <View style={styles.topView}>
              {/* <Text style={styles.title}>{city}</Text> */}
              <Text style={styles.title}>Monviso</Text>
              <Text style={styles.temp}>{Ftemp}°</Text>

              {/* <Image
                source={{ uri: weatherURI }}
                style={{ width: 50, height: 50 }}
              /> */}
              {/* <Image
                source={{ uri: weatherURI }}
                style={{ width: 50, height: 50 }}
              /> */}
            </View>

            <View style={styles.bottomView}>
              <View style={styles.bottomTexts}>
                <View style={styles.textWrapper}>
                  <Text style={styles.number}>{high}°</Text>
                  <View style={styles.line}></View>
                  <Text style={styles.name}>Today's High</Text>
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.number}>{low}°</Text>
                  <View style={styles.line}></View>
                  <Text style={styles.name}>Today's Low</Text>
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.number}>{humid}%</Text>
                  <View style={styles.line}></View>
                  <Text style={styles.name}>Humidity{uinta}</Text>
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.number}>{Altitude}</Text>
                  <View style={styles.line}></View>
                  <Text style={styles.name}>Altitude</Text>
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.number}>{pressure} </Text>
                  <View style={styles.line}></View>
                  <Text style={styles.name}>inHg</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  backgroundImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },

  pageWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  topView: {
    // backgroundColor: "green",
    width: "100%",
    height: "50%",
    justifyContent: "center",
    // alignItems: "center",
    // textAlign: "left",

    // paddingHorizontal: 70,
  },
  bottomView: {
    // backgroundColor: "blue",
    width: "100%",
    height: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    color: "#6c5c64",
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 20,
  },
  temp: {
    fontSize: 150,
    color: "#6c5c64",
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 20,
    fontFamily: "AdventPro-Regular",
  },
  bottomTexts: {
    display: "flex",
    width: "100%",
    marginBottom: 60,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  number: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 3,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  name: {
    fontSize: 12,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
    paddingVertical: 3,
  },
});
