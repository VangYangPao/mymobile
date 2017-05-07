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

import ChatScreenWrapper from "./Chat";
import IntroScreen from "./IntroScreen";
import PolicyScreen from "./PolicyScreen";
import colors from "./colors";
import DrawerContent from "./DrawerContent";

// global.___DEV___ = false

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

function renderMenuButton(navigation) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DrawerOpen");
      }}
    >
      <Icon name="menu" size={MENU_ICON_SIZE} style={styles.headerMenuIcon} />
    </TouchableOpacity>
  );
}

const BuyStackNavigator = StackNavigator({
  Chat: {
    screen: ChatScreenWrapper(null),
    navigationOptions: ({ navigation }) => {
      const isQuestions = navigation.state.params;
      var button;

      if (!isQuestions) {
        button = renderMenuButton(navigation);
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
    screen: PolicyScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: styles.headerTitle,
      headerLeft: renderBackButton(navigation)
    })
  }
});

const ClaimStackNavigator = StackNavigator({
  Claim: {
    screen: ChatScreenWrapper("claim"),
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: styles.headerTitle,
      headerLeft: renderMenuButton(navigation)
    })
  }
});

const MyDrawerNavigator = DrawerNavigator(
  {
    BuyStack: {
      screen: BuyStackNavigator
    },
    ClaimStack: {
      screen: ClaimStackNavigator
    }
  },
  {
    contentComponent: props => {
      return <DrawerContent {...props} />;
    },
    contentOptions: {
      activeTintColor: colors.primaryOrange,
      inactiveTintColor: colors.primaryText
    }
  }
);

export default (Microsurance = StackNavigator(
  {
    Intro: { screen: IntroScreen },
    Drawer: { screen: MyDrawerNavigator }
  },
  { headerMode: "none" }
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
