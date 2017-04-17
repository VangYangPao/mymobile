/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { DrawerNavigator, StackNavigator } from "react-navigation";

import ChatScreen from "./src/Chat";

const BuyStackNavigator = StackNavigator({
  Buy: { screen: ChatScreen }
});

const MyDrawerNavigator = DrawerNavigator({
  BuyStack: {
    screen: BuyStackNavigator
  },
  ClaimStack: {
    screen: BuyStackNavigator
  }
});

export default (Microsurance = StackNavigator(
  {
    Drawer: { screen: MyDrawerNavigator }
  },
  { headerMode: "none" }
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
