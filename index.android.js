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
import PlanScreen from "./src/PlanScreen";
import colors from "./src/colors";
import DrawerContent from "./src/DrawerContent";

function renderNavigation({ navigation }) {
  return {
    headerTitleStyle: {
      color: colors.primaryText
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DrawerOpen");
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
  };
}

const BuyStackNavigator = StackNavigator({
  Buy: {
    screen: ChatScreen,
    navigationOptions: renderNavigation
  },
  Plan: {
    screen: PlanScreen,
    navigationOptions: renderNavigation
  }
});

var drawerProps;

const MyDrawerNavigator = DrawerNavigator(
  {
    BuyStack: {
      screen: BuyStackNavigator
    },
  },
  {
    contentComponent: props => {
      console.log(props);
      if (!drawerProps) {
        drawerProps = props;
      }
      console.log(drawerProps.get)
      return <DrawerContent {...drawerProps} />;
    },
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
