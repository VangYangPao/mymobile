// @flow
import React, { Component } from "react";
import type { Node as ReactNode } from "react";
import { StyleSheet } from "react-native";
import Parse from "parse/react-native";

export { getCountryCode } from "./src/models/localization";
import AppStore from "./stores/AppStore";
export MicroUmbrellaApp from "./src/MicroUmbrellaApp";

type createAppOptionsType = {
  parseAppId?: string,
  parseServerURL?: string,
  appIcon?: number,
  headerTitle?: ReactNode,
  headerStyle?: StyleSheet.Styles,
  renderIntroScreen?: ({ navigation: any }) => ReactNode
};

// export function createMicroUmbrellaApp(options: createAppOptionsType) {
//   for (var i in options) {
//     if (typeof options[i] !== "undefined") {
//       AppStore[i] = options[i];
//     }
//   }
//   Parse.initialize(AppStore.parseAppId);
//   Parse.serverURL = AppStore.parseServerURL;
//   AppStore.Parse = Parse;
//   const MicroUmbrellaApp = require("./src/MicroUmbrellaApp").default;

//   if (!options.introScreen) {
//     const IntroScreen = require("./src/screens/IntroScreen").default;
//     AppStore.IntroScreen = ({ navigation }) => (
//       <IntroScreen
//         navigation={navigation}
//         screenProps={{ rootNavigation: navigation }}
//       />
//     );
//   }

//   return () => <MicroUmbrellaApp />;
// }
