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
import {
  DrawerNavigator,
  StackNavigator,
  NavigationActions
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import ChatScreenWrapper from "./Chat";
import IntroScreen from "./IntroScreen";
import PolicyScreen from "./PolicyScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import StatusScreen from "./StatusScreen";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import colors from "./colors";
import DrawerContent from "./DrawerContent";

// global.___DEV___ = false

const MENU_ICON_SIZE = 35;
const MENU_ICON_PADDING_LEFT = 15;
const MENU_ICON_PADDING_RIGHT = 10;
const WINDOW_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1,
    backgroundColor: colors.primaryOrange
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  homeHeader: {
    backgroundColor: "transparent"
  },
  header: {
    height: 58,
    backgroundColor: "white"
  },
  headerTitle: {
    alignSelf: "center",
    paddingRight: 0,
    ...Platform.select({
      ios: {
        paddingRight: 0
      },
      android: {
        paddingRight:
          MENU_ICON_PADDING_LEFT + MENU_ICON_SIZE + MENU_ICON_PADDING_RIGHT
      }
    }),
    color: colors.primaryText,
    fontWeight: "400",
    fontFamily: "Comfortaa-Bold"
  },
  homeHeaderMenuIcon: {
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: "white"
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
  const iconName = (Platform.OS === "ios" ? "ios" : "md") + "-arrow-back";
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(NavigationActions.back());
      }}
    >
      <Ionicon
        name={iconName}
        size={MENU_ICON_SIZE}
        style={styles.headerMenuIcon}
      />
    </TouchableOpacity>
  );
}

function renderMenuButton(navigation, iconStyle = styles.headerMenuIcon) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DrawerOpen");
      }}
    >
      <Icon name="menu" size={MENU_ICON_SIZE} style={iconStyle} />
    </TouchableOpacity>
  );
}

const backButtonNavOptions = ({ navigation }) => {
  let options = {
    headerTitleStyle: [styles.headerTitle, styles.planHeaderTitle],
    headerLeft: renderBackButton(navigation)
  };
  if (Platform.OS === "ios") {
    options.headerStyle = styles.header;
  }
  return options;
};

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

const HomeStackNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ screenProps }) => {
        return {
          headerStyle: styles.homeHeader,
          headerLeft: renderMenuButton(
            screenProps.rootNavigation,
            styles.homeHeaderMenuIcon
          )
        };
      }
    }
  },
  {
    cardStyle: { backgroundColor: "transparent" }
  }
);

class HomeStackNavigatorWrapper extends Component {
  static navigationOptions = createDrawerNavOptions("Home", "home");

  constructor(props) {
    super(props);
    this.state = { renderBackgroundImage: false };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ renderBackgroundImage: true })
    );
  }

  render() {
    let backgroundImage;
    if (this.state.renderBackgroundImage) {
      backgroundImage = (
        <Image
          source={require("../images/background.png")}
          style={styles.backgroundImage}
        />
      );
    } else {
      backgroundImage = null;
    }

    return (
      <View style={styles.navigatorContainer}>
        {backgroundImage}
        <HomeStackNavigator
          screenProps={{ rootNavigation: this.props.navigation }}
        />
      </View>
    );
  }
}

function createDrawerNavOptions(drawerLabel, iconName) {
  return {
    drawerLabel,
    drawerIcon: ({ tintColor }) =>
      <Icon name={iconName} size={22} color={tintColor} />
  };
}

class SettingsScreen extends Component {
  static navigationOptions = createDrawerNavOptions("Settings", "settings");

  render() {}
}

class HelpScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };
  render() {
    return null;
  }
}

class LegalScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };
  render() {
    return null;
  }
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
    Profile: {
      screen: StatusStackNavigator,
      navigationOptions: createDrawerNavOptions("My Profile", "account-circle")
    },
    Help: {
      screen: HelpScreen
    },
    Legal: {
      screen: LegalScreen
    }
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
    Drawer: { screen: MyDrawerNavigator }
  },
  { headerMode: "none" }
));

AppRegistry.registerComponent("Microsurance", () => Microsurance);
