import React from "react";
import IntroScreen from "./screens/IntroScreen";

export default (defaultOptions = {
  parseAppId: "microumbrella",
  parseServerURL: "https://api-dev.microumbrella.com/parse",
  renderIntroScreen: ({ navigation }) => (
    <IntroScreen
      navigation={navigation}
      screenProps={{ rootNavigation: navigation }}
    />
  )
});
