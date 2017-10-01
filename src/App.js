/* @flow */
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  InteractionManager,
  Dimensions,
  Platform
} from "react-native";
import { DrawerNavigator, StackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import ChatScreenWrapper from "./Chat";
import IntroScreen from "./IntroScreen";
import PolicyScreen from "./PolicyScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import StatusScreen from "./StatusScreen";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import TermsOfUse from "./TermsOfUse";
import NotificationsScreen from "./NotificationsScreen";
import { TermsOfUseStack, PrivacyPolicyStack } from "./TermsAndPrivacyPolicy";
import HelpScreen from "./HelpScreen";
import colors from "./colors";
import TableScreen from "./TableScreen";
import DrawerContent from "./DrawerContent";
import {
  styles,
  backButtonNavOptions,
  renderBackButton,
  renderMenuButton,
  createDrawerNavOptions
} from "./navigations";
import { ENV, SERVER_URL } from "react-native-dotenv";

import Parse from "parse/react-native";
Parse.initialize("microumbrella");
Parse.serverURL = SERVER_URL;

// global.___DEV___ = false

const WINDOW_WIDTH = Dimensions.get("window").width;

const BuyStackNavigator = StackNavigator({
  Chat: {
    screen: ChatScreenWrapper("buy"),
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params;
      let button;

      if (!params) {
        button = null;
      } else if (params && params.currentUser && !params.policy) {
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
  Table: {
    screen: TableScreen
  },
  Auth: { screen: AuthScreen },
  Policy: {
    screen: PolicyScreen,
    navigationOptions: backButtonNavOptions
  },
  Confirmation: {
    screen: ConfirmationScreen,
    navigationOptions: backButtonNavOptions
  },
  Status: {
    screen: StatusScreen,
    navigationOptions: backButtonNavOptions
  }
});

const ClaimStackNavigator = StackNavigator({
  Claim: {
    screen: ChatScreenWrapper("claim"),
    navigationOptions: ({ navigation }) => ({
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerLeft: renderMenuButton(navigation)
    })
  }
});

const StatusStackNavigator = StackNavigator({
  Status: {
    screen: StatusScreen,
    navigationOptions: backButtonNavOptions
  }
});

class SettingsScreen extends Component {
  static navigationOptions = createDrawerNavOptions("Settings", "settings");

  render() {}
}

const HelpStackNavigator = StackNavigator({
  Help: {
    screen: HelpScreen,
    navigationOptions: backButtonNavOptions
  }
});

const NotificationsStackNavigator = StackNavigator({
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: backButtonNavOptions
  }
});

const MyDrawerNavigator = DrawerNavigator(
  {
    BuyStack: {
      screen: BuyStackNavigator
    },
    ClaimStack: {
      screen: ClaimStackNavigator
    },
    MyPolicies: {
      screen: StatusStackNavigator,
      navigationOptions: createDrawerNavOptions("My Polices & Status", "book")
    }
    // Notification: {
    //   screen: NotificationsStackNavigator
    // }
    // Profile: {
    //   screen: StatusStackNavigator,
    //   navigationOptions: createDrawerNavOptions("My Profile", "account-circle")
    // },
  },
  {
    drawerWidth: WINDOW_WIDTH * 0.65,
    contentComponent: props => {
      return <DrawerContent {...props} />;
    },
    contentOptions: {
      activeTintColor: colors.primaryOrange,
      inactiveTintColor: colors.primaryText
    }
  }
);

const stackNavigatorScreens = {
  Intro: { screen: IntroScreen },
  TermsOfUse: { screen: TermsOfUse },
  Drawer: { screen: MyDrawerNavigator },
  Help: { screen: HelpStackNavigator }
};

if (ENV === "development") {
  delete stackNavigatorScreens.Intro;
  delete stackNavigatorScreens.TermsOfUse;
}

export default (Microsurance = StackNavigator(stackNavigatorScreens, {
  headerMode: "none"
}));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
