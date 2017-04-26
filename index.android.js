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
import {
  DrawerNavigator,
  StackNavigator,
  NavigationActions
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreenWrapper from "./src/Chat";
import PlanScreen from "./src/PlanScreen";
import colors from "./src/colors";
import DrawerContent from "./src/DrawerContent";

const MENU_ICON_SIZE = 30;
const MENU_ICON_PADDING_LEFT = 15;
const MENU_ICON_PADDING_RIGHT = 10;

const styles = StyleSheet.create({
  headerTitle: {
    // fontWeight: "400",
    // fontSize: 20,
    color: colors.primaryText,
    alignSelf: "center",
    paddingRight: MENU_ICON_PADDING_LEFT +
      MENU_ICON_SIZE +
      MENU_ICON_PADDING_RIGHT
  },
  headerMenuIcon: {
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: colors.primaryText
  }
});

function renderBackButton(navigation) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(NavigationActions.back());
      }}
    >
      <Icon
        name="arrow-back"
        size={MENU_ICON_SIZE}
        style={styles.headerMenuIcon}
      />
    </TouchableOpacity>
  );
}

const BuyStackNavigator = StackNavigator({
  Buy: {
    screen: ChatScreenWrapper(true),
    navigationOptions: ({ navigation }) => {
      const isQuestions = navigation.state.params;
      var button;

      if (!isQuestions) {
        button = (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DrawerOpen");
            }}
          >
            <Icon
              name="menu"
              size={MENU_ICON_SIZE}
              style={styles.headerMenuIcon}
            />
          </TouchableOpacity>
        );
      } else {
        button = renderBackButton(navigation);
      }
      return {
        headerTitleStyle: styles.headerTitle,
        headerLeft: button
      };
    }
  },
  Plan: {
    screen: PlanScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: styles.headerTitle,
      headerLeft: renderBackButton(navigation)
    })
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
      if (!drawerProps) {
        drawerProps = props;
      }
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
