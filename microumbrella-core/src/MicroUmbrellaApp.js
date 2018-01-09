// @flow
import React, { Component } from "react";
import type { Node as ReactNode } from "react";
import { observer } from "mobx-react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  InteractionManager,
  Dimensions,
  Platform,
  StatusBar,
  AsyncStorage
} from "react-native";
import {
  NavigationActions,
  DrawerNavigator,
  StackNavigator,
  SafeAreaView
} from "react-navigation";
import OneSignal from "react-native-onesignal";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Appsee from "react-native-appsee";
import DeviceInfo from "react-native-device-info";

import AppStore from "../stores/AppStore";
import { saveNewNotificationDevice } from "./parse/notificationDevice";
import DefaultSplashScreen from "./screens/SplashScreen";
import DefaultIntroScreen from "./screens/IntroScreen";
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
import ACSScreen from "./screens/ACSScreen";
import {
  navigationStyles,
  backButtonNavOptions,
  renderBackButton,
  renderMenuButton,
  createDrawerNavOptions,
  MENU_ICON_SIZE,
  MENU_ICON_PADDING_LEFT,
  MENU_ICON_PADDING_RIGHT,
  navigateOnce,
  headerContainer
} from "./navigations";
import {
  ENV,
  SERVER_URL,
  SPLASH_LOAD_TIME as _SPLASH_LOAD_TIME
} from "react-native-dotenv";
import type { AppOptionsType } from "../../types";

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
          StyleSheet.flatten(navigationStyles.headerTitle)
        );

        if (params.isStartScreen) {
          headerTitleStyle.fontFamily = "Comfortaa-Bold";
        }

        // if (Platform.OS === "android") {
        //   if (params.isStartScreen) {
        //     // weird limitation
        //     headerTitleStyle.paddingRight = 0;
        //   }
        //   if (params.currentUser) {
        //     headerTitleStyle.paddingRight =
        //       MENU_ICON_SIZE + MENU_ICON_PADDING_RIGHT;
        //   }
        // }

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
          button = headerContainer;
        }
        return {
          headerTitleStyle,
          headerStyle: navigationStyles.header,
          headerRight: headerContainer,
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
    ACS: {
      screen: ACSScreen,
      navigationOptions: backButtonNavOptions
    }
    // MyPolicies: {
    //   screen: StatusScreen,
    //   navigationOptions: backButtonNavOptions
    // }
  },
  {
    // initialRouteName: "ACS",
    // initialRouteParams: {}
    initialRouteName: "Chat",
    initialRouteParams: {
      questionSet: "buy",
      isStartScreen: true
    }
  }
);
BuyStackNavigator.router.getStateForAction = navigateOnce(
  BuyStackNavigator.router.getStateForAction
);

const ClaimStackNavigator = StackNavigator(
  {
    Claim: {
      screen: new ChatScreenWrapper(),
      navigationOptions: ({ navigation }) => ({
        headerStyle: navigationStyles.header,
        headerTitleStyle: navigationStyles.headerTitle,
        headerLeft: renderMenuButton(navigation),
        headerRight: headerContainer
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
ClaimStackNavigator.router.getStateForAction = navigateOnce(
  ClaimStackNavigator.router.getStateForAction
);

const StatusStackNavigator = StackNavigator(
  {
    Status: {
      screen: StatusScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: navigationStyles.header,
        headerTitleStyle: navigationStyles.headerTitle,
        headerLeft: renderMenuButton(navigation),
        headerRight: headerContainer,
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

StatusStackNavigator.router.getStateForAction = navigateOnce(
  StatusStackNavigator.router.getStateForAction
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
HelpStackNavigator.router.getStateForAction = navigateOnce(
  HelpStackNavigator.router.getStateForAction
);

const NotificationsStackNavigator = StackNavigator({
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: backButtonNavOptions
  }
});
NotificationsStackNavigator.router.getStateForAction = navigateOnce(
  NotificationsStackNavigator.router.getStateForAction
);

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
    },
    Notification: {
      screen: NotificationsStackNavigator
    },
    Help: {
      screen: HelpStackNavigator
    }
    // Profile: {
    //   screen: StatusStackNavigator,
    //   navigationOptions: createDrawerNavOptions("My Profile", "account-circle")
    // },
  },
  {
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
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

const NotificationDevice = Parse.Object.extend("NotificationDevice");

const ModelIphoneX = "iPhone X";
const isiPhoneX = DeviceInfo.getModel() === ModelIphoneX;
const STATUSBAR_HEIGHT_IOS = DeviceInfo.getModel() === ModelIphoneX ? 30 : 20;
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? STATUSBAR_HEIGHT_IOS : StatusBar.currentHeight;

const barStyles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  }
});

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[barStyles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

type NavScreen = {
  screen: ReactNode
};

@observer
export default class MicroUmbrellaApp extends Component {
  props: any;
  state: { loading: boolean, currentUser: any };
  onIds: Object => void;

  constructor(props: { appOptions: AppOptionsType }) {
    super(props);
    this.state = {
      loading: true,
      currentUser: null,
      notifDevice: null
    };
    this.onIds = this.onIds.bind(this);

    this.stackNavigatorScreens = {
      Splash: {
        screen: DefaultSplashScreen
      },
      Intro: {
        screen: ({ navigation }) => (
          <DefaultIntroScreen
            navigation={navigation}
            screenProps={{ rootNavigation: navigation }}
          />
        )
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
  }

  runAfterInteractions(fn) {
    return (...args) => {
      InteractionManager.runAfterInteractions(() => {
        fn(...args);
      });
    };
  }

  onIds(notifDevice) {
    console.log("Device info: ", notifDevice);
    this.setState({ notifDevice });
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  componentWillMount() {
    OneSignal.addEventListener(
      "received",
      this.runAfterInteractions(this.onReceived)
    );
    OneSignal.addEventListener(
      "opened",
      this.runAfterInteractions(this.onOpened)
    );
    OneSignal.addEventListener("ids", this.runAfterInteractions(this.onIds));
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser, notifDevice } = this.state;

    if (
      currentUser &&
      notifDevice &&
      (prevState.currentUser === null || prevState.notifDevice === null)
    ) {
      InteractionManager.runAfterInteractions(() => {
        const { userId: notifUserId, pushToken: notifPushToken } = notifDevice;
        const query = new Parse.Query(NotificationDevice);
        query.equalTo("notifUserId", notifUserId);
        query.first().then(notifDevice => {
          if (!notifDevice) {
            saveNewNotificationDevice(currentUser, notifUserId, notifPushToken);
          }
        });
      });
    }
  }

  componentDidMount() {
    const { appOptions } = this.props;

    if (appOptions.validations !== undefined) {
      for (let responseType in appOptions.validations) {
        AppStore.validations[responseType] =
          appOptions.validations[responseType];
      }
    }
    delete appOptions.validations;

    if (appOptions.screens !== undefined) {
      for (let screenName in appOptions.screens) {
        let screen = appOptions.screens[screenName];
        AppStore.stackNavigatorScreens[screenName] = { screen };
      }
      delete appOptions.screens;
    }

    for (let i in appOptions) {
      if (typeof appOptions[i] !== "undefined") {
        AppStore[i] = appOptions[i];
      }
    }
    Parse.initialize(AppStore.parseAppId);
    Parse.serverURL = AppStore.parseServerURL;
    Parse.setAsyncStorage(AsyncStorage);
    AppStore.Parse = Parse;

    Appsee.start(AppStore.appseeId);
    OneSignal.configure({});
    Parse.User.currentAsync().then(currentUser => {
      this.setState({ loading: false, currentUser });
    });
  }

  render() {
    let config = Object.assign({}, stackNavConfig);
    let statusBar;
    if (this.state.loading) {
      config.initialRouteName = "Splash";
      statusBar = (
        <StatusBar
          backgroundColor={colors.primaryAccent}
          barStyle="light-content"
        />
      );
    } else {
      if (this.state.currentUser) {
        config.initialRouteName = "Drawer";
      } else {
        config.initialRouteName = "Intro";
      }
      statusBar = Platform.select({
        ios: <StatusBar backgroundColor="white" barStyle="dark-content" />,
        android: null
      });
    }
    const MyStackNavigator = StackNavigator(this.stackNavigatorScreens, config);

    let ViewComponent = props => (
      <View style={navigationStyles.emptyView}>{props.children}</View>
    );

    if (Platform.OS === "ios") {
      if (isiPhoneX) {
        ViewComponent = props => (
          <SafeAreaView
            forceInset={{ vertical: "never" }}
            style={navigationStyles.safeAreaView}
          >
            {props.children}
          </SafeAreaView>
        );
      }
    }

    return (
      <ViewComponent>
        {statusBar}
        <MyStackNavigator />
      </ViewComponent>
    );
  }
}
