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

const MENU_ICON_SIZE = 25;
const MENU_ICON_PADDING_LEFT = 15;
const MENU_ICON_PADDING_RIGHT = 10;

function renderNavigation({ navigation }) {
  return {
    headerTitleStyle: styles.headerTitle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DrawerOpen");
        }}
      >
        <Icon name="menu" size={MENU_ICON_SIZE} style={styles.headerMenuIcon} />
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
    }
  },
  {
    contentComponent: props => {
      console.log(props);
      if (!drawerProps) {
        drawerProps = props;
      }
      console.log(drawerProps.get);
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

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Courgette",
    color: colors.primaryText,
    alignSelf: "center",
    paddingRight: MENU_ICON_PADDING_LEFT +
      MENU_ICON_SIZE +
      MENU_ICON_PADDING_RIGHT
  },
  headerMenuIcon: {
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: colors.primaryOrange
  }
});

AppRegistry.registerComponent("Microsurance", () => Microsurance);
