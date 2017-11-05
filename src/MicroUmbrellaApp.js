// @flow
import React, { Component } from "react";
import type { Node as ReactNode } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  InteractionManager,
  Dimensions,
  Platform
} from "react-native";
import {
  NavigationActions,
  DrawerNavigator,
  StackNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import AppStore from "../stores/AppStore";
import SplashScreen from "./screens/SplashScreen";
import IntroScreen from "./screens/IntroScreen";
import ChatScreenWrapper from "./screens/Chat";
import PolicyScreen from "./screens/PolicyScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import StatusScreen from "./screens/StatusScreen";
import AuthScreen from "./screens/AuthScreen";
import TermsOfUse from "./screens/TermsOfUse";
import NotificationsScreen from "./screens/NotificationsScreen";
import HelpScreen from "./screens/HelpScreen";
import TableScreen from "./screens/TableScreen";
import DrawerContent from "./components/DrawerContent";
import PolicyDetailsScreen from "./screens/PolicyDetails";
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
import {
  ENV,
  SERVER_URL,
  SPLASH_LOAD_TIME as _SPLASH_LOAD_TIME
} from "react-native-dotenv";

const SPLASH_LOAD_TIME = parseInt(_SPLASH_LOAD_TIME, 10);

const colors = AppStore.colors;

import Parse from "parse/react-native";

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
          headerTitleStyle.fontFamily = "Comfortaa-Bold";
        }

        if (Platform.OS === "android") {
          if (params.isStartScreen) {
            // weird limitation
            headerTitleStyle.paddingRight = 0;
          }
          if (params.currentUser) {
            headerTitleStyle.paddingRight =
              MENU_ICON_SIZE + MENU_ICON_PADDING_RIGHT;
          }
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
    }
    // MyPolicies: {
    //   screen: StatusScreen,
    //   navigationOptions: backButtonNavOptions
    // }
  },
  {
    initialRouteName: "Chat",
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

const StatusStackNavigator = StackNavigator(
  {
    Status: {
      screen: StatusScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerLeft: renderMenuButton(navigation),
        drawerLabel: "My Policies & Status",
        drawerIcon: ({ tintColor }) => (
          <Icon name={"book"} size={22} color={tintColor} />
        )
      })
    },
    PolicyDetails: {
      screen: PolicyDetailsScreen,
      navigationOptions: backButtonNavOptions
    },
    Table: {
      screen: TableScreen
    }
  },
  {
    initialRouteName: "Status"
  }
);

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
      screen: StatusStackNavigator
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
    contentComponent: props => <DrawerContent {...props} />,
    contentOptions: {
      activeTintColor: colors.primaryAccent,
      inactiveTintColor: colors.primaryText
    }
  }
);

const wrapScreen = ScreenComponent => {
  let wrapper = ({ navigation }) => {
    return (
      <ScreenComponent
        navigation={navigation}
        screenProps={{ rootNavigation: navigation }}
      />
    );
  };
  wrapper.router = {
    getScreenOptions: MyDrawerNavigator.router.getScreenOptions,
    ...MyDrawerNavigator.router
  };
  return wrapper;
};

let stackNavConfig = {
  headerMode: "none"
};
// if (ENV === "development") {
//   stackNavConfig["initialRouteName"] = "Drawer";
// } else {
//   stackNavConfig["initialRouteName"] = "Intro";
// }

export default class MicroUmbrellaApp extends Component {
  props: any;
  state: { loading: boolean, currentUser: any };

  constructor(props: createAppOptionsType) {
    super(props);
    this.state = { loading: true, currentUser: null };
  }

  componentDidMount() {
    Parse.User.currentAsync().then(currentUser => {
      setTimeout(() => {
        this.setState({ loading: false, currentUser });
      }, SPLASH_LOAD_TIME);
    });
  }

  render() {
    const stackNavigatorScreens = {
      Splash: {
        screen: SplashScreen
      },
      Intro: {
        screen: AppStore.introScreen
      },
      TermsOfUse: {
        screen: TermsOfUse
      },
      Profile: {
        screen: StackNavigator({
          Profile: {
            screen: TableScreen
          }
        })
      },
      Drawer: {
        screen: wrapScreen(MyDrawerNavigator)
      },
      Help: { screen: HelpStackNavigator }
    };
    let config = Object.assign({}, stackNavConfig);
    if (this.state.loading) {
      config.initialRouteName = "Splash";
    } else if (this.state.currentUser) {
      config.initialRouteName = "Drawer";
    } else {
      config.initialRouteName = "Intro";
    }
    const MyStackNavigator = StackNavigator(stackNavigatorScreens, config);
    return <MyStackNavigator />;
  }
}
