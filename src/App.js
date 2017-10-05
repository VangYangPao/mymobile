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
  createDrawerNavOptions,
  MENU_ICON_SIZE,
  MENU_ICON_PADDING_LEFT,
  MENU_ICON_PADDING_RIGHT
} from "./navigations";
import { ENV, SERVER_URL } from "react-native-dotenv";

import Parse from "parse/react-native";
Parse.initialize("microumbrella");
// Parse.serverURL = SERVER_URL;
Parse.serverURL = "https://api-dev.microumbrella.com/parse";

console.disableYellowBox = true;

const WINDOW_WIDTH = Dimensions.get("window").width;

const BuyStackNavigator = StackNavigator(
  {
    Chat: {
      screen: new ChatScreenWrapper(),
      navigationOptions: ({ navigation, screenProps }) => {
        const params = navigation.state.params;
        let button;

        const headerTitleStyle = Object.assign(
          {},
          StyleSheet.flatten(styles.headerTitle)
        );
        if (params.isStartScreen) {
          // weird limitation
          headerTitleStyle.paddingRight = 0;
        }
        if (params.currentUser) {
          headerTitleStyle.paddingRight =
            MENU_ICON_SIZE + MENU_ICON_PADDING_RIGHT;
        }

        if (
          params &&
          params.currentUser &&
          params.questionSet === "buy" &&
          params.isStartScreen
        ) {
          button = renderMenuButton(navigation);
        } else if (params && params.currentUser) {
          button = renderBackButton(navigation);
        } else {
          button = null;
        }
        return {
          headerTitleStyle,
          headerStyle: styles.header,
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
  },
  {
    initialRouteParams: {
      questionSet: "buy",
      isStartScreen: true
    }
  }
);

const ClaimStackNavigator = StackNavigator(
  {
    Claim: {
      screen: new ChatScreenWrapper(),
      navigationOptions: ({ navigation }) => ({
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerLeft: renderMenuButton(navigation)
      })
    }
  },
  {
    initialRouteParams: {
      questionSet: "claim",
      isStartScreen: false
    }
  }
);

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
  Drawer: {
    screen: ({ navigation }) => (
      <MyDrawerNavigator screenProps={{ rootNavigation: navigation }} />
    )
  },
  Help: { screen: HelpStackNavigator }
};

let stackNavConfig = {
  headerMode: "none"
};
if (ENV === "development") {
  stackNavConfig["initialRouteName"] = "Drawer";
} else {
  stackNavConfig["initialRouteName"] = "Intro";
}

export default (Microsurance = StackNavigator(
  stackNavigatorScreens,
  stackNavConfig
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
