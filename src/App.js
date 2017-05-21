/* @flow */
import React, { Component } from "react";
import { AppRegistry, StyleSheet, View, TouchableOpacity } from "react-native";
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

const MENU_ICON_SIZE = 27;
const MENU_ICON_PADDING_LEFT = 15;
const MENU_ICON_PADDING_RIGHT = 10;

const styles = StyleSheet.create({
  header: {
    height: 52.5
  },
  headerTitle: {
    // fontSize: 20,
    alignSelf: "center",
    paddingRight: MENU_ICON_PADDING_LEFT +
      MENU_ICON_SIZE +
      MENU_ICON_PADDING_RIGHT,
    color: colors.primaryText,
    fontWeight: "400",
    fontFamily: "Comfortaa-Bold"
  },
  headerMenuIcon: {
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: colors.primaryText
  },
  planHeaderTitle: {
    fontWeight: "500",
    fontFamily: "Lato"
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
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerLeft: button
      };
    }
  },
  Policy: {
    screen: PolicyScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: [styles.headerTitle, styles.planHeaderTitle],
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

class SettingsScreen extends Component {
  static navigationOptions = {
    drawerLabel: "Settings",
    drawerIcon: ({ tintColor }) => (
      <Icon name="settings" size={22} color={tintColor} />
    )
  };

  render() {}
}

class HelpScreen extends Component {
  static navigationOptions = {
    drawerLabel: "Help",
    drawerIcon: ({ tintColor }) => (
      <Icon name="feedback" size={22} color={tintColor} />
    )
  };
  render() {}
}

const MyDrawerNavigator = DrawerNavigator(
  {
    BuyStack: {
      screen: BuyStackNavigator
    },
    ClaimStack: {
      screen: ClaimStackNavigator
    },
    Settings: {
      screen: SettingsScreen
    },
    Help: {
      screen: HelpScreen
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
