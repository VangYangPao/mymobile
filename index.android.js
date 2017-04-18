/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { DrawerNavigator, StackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreen from "./src/Chat";

const BuyStackNavigator = StackNavigator({
  Buy: {
    screen: ChatScreen,
    navigationOptions: navigationProps => ({
      title: "Buy insurance",
      drawerLabel: "Buy insurance",
      drawerIcon: ({ tintColor }) => (
        <Icon name="credit-card" size={22} color={tintColor} />
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigationProps.navigation.navigate("DrawerOpen");
          }}
        >
          <Icon
            name="menu"
            size={25}
            style={{ padding: 10, paddingLeft: 15 }}
            color="black"
          />
        </TouchableOpacity>
      )
    })
  }
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
