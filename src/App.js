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
import { TermsOfUseStack, PrivacyPolicyStack } from "./TermsAndPrivacyPolicy";
import HelpScreen from "./HelpScreen";
import colors from "./colors";
import DrawerContent from "./DrawerContent";
import {
  styles,
  backButtonNavOptions,
  renderBackButton,
  renderMenuButton,
  createDrawerNavOptions
} from "./navigations";

// global.___DEV___ = false

const WINDOW_WIDTH = Dimensions.get("window").width;

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
    navigationOptions: backButtonNavOptions
  },
  Confirmation: {
    screen: ConfirmationScreen,
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
    },
    Help: {
      screen: HelpScreen
    }
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

export default (Microsurance = StackNavigator(
  {
    Intro: { screen: IntroScreen },
    Auth: { screen: AuthScreen },
    TermsOfUse: { screen: TermsOfUse },
    // PrivacyPolicy: { screen: PrivacyPolicyStack },
    Drawer: { screen: MyDrawerNavigator }
  },
  { headerMode: "none" }
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
