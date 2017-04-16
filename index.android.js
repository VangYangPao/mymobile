/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { DrawerNavigator, StackNavigator } from "react-navigation";

import ChatScreen from "./src/Chat";

const HomeNavigator = DrawerNavigator({
  Chat: {
    screen: ChatScreen
  }
});

export default (Microsurance = StackNavigator({
  Home: { screen: HomeNavigator }
}));

// export default class Microsurance extends Component {
//   render() {
//     return (
//       <AppNavigator
//         ref={nav => {
//           this.navigator = nav;
//         }}
//       />
//     );
//   }
// }

AppRegistry.registerComponent("Microsurance", () => Microsurance);
