import React, { Component } from "react";
import { Dimensions, View, StyleSheet, Image, StatusBar } from "react-native";
import VectorDrawableView from "../components/VectorDrawableView";

import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.page}>
        {/*<Image
          style={styles.backgroundImage}
          source={require("../../images/background.png")}
        />*/}
        <StatusBar
          backgroundColor={colors.primaryAccent}
          barStyle="light-content"
        />
        <View>
          <Image
            resizeMode="contain"
            style={styles.appLogo}
            source={{ uri: "microumbrella-word-white.png" }}
          />
        </View>
      </View>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const containerPaddingHorizontal = 0.15;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.authBackgroundColor,
    paddingHorizontal: windowWidth * containerPaddingHorizontal
  },
  appLogo: {
    height: 50,
    width: windowWidth - windowWidth * containerPaddingHorizontal * 2
    // marginBottom: 50
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
    height: null
  }
});
