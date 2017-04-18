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
import colors from "./src/colors";
import DrawerContent from "./src/DrawerContent";

const BuyStackNavigator = StackNavigator({
  Buy: {
    screen: ChatScreen,
    navigationOptions: navigationProps => ({
      title: "Buy Policies",
      drawerLabel: "Buy Policies",
      drawerIcon: ({ tintColor }) => (
        <Icon name="message" size={22} color={tintColor} />
      ),
      headerTitleStyle: {
        color: colors.primaryText,
      },
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
            color={colors.primaryOrange}
          />
        </TouchableOpacity>
      )
    })
  }
});

const MyDrawerNavigator = DrawerNavigator(
  {
    BuyStack: {
      screen: BuyStackNavigator
    },
    ClaimStack: {
      screen: BuyStackNavigator
    }
  },
  {
    contentComponent: props => <DrawerContent {...props} />,
    contentOptions: {
      activeTintColor: colors.primaryOrange,
      inactiveTintColor: colors.primaryText
    }
  }
);

export default (Microsurance = StackNavigator(
  {
    Drawer: { screen: MyDrawerNavigator }
  },
  { headerMode: "none" }
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
