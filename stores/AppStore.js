import React from "react";
import { extendObservable, computed, asStructure } from "mobx";
import defaultOptions from "../defaultOptions";

class AppStore {
  constructor() {
    extendObservable(this, {
      parseAppId: "microumbrella",
      parseServerURL: "https://api-dev.microumbrella.com/parse",
      renderIntroScreen: ({ navigation }) => (
        <IntroScreen
          navigation={navigation}
          screenProps={{ rootNavigation: navigation }}
        />
      )
    });
  }
}

singleton = new AppStore();
export default singleton;
