// @flow
import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  StatusBar
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import AppStore from "../stores/AppStore";
import { normalize, normalizeFont } from "./utils";
const colors = AppStore.colors;

const pixelRatio = PixelRatio.get();
const layoutPixelSize = PixelRatio.getPixelSizeForLayoutSize(pixelRatio);

// export const MENU_ICON_SIZE =
//   layoutPixelSize *
//   Platform.select({
//     android: 3.3,
//     ios: 7
//   });
export const MENU_ICON_SIZE = normalize(30);
// export const MENU_ICON_PADDING_LEFT =
//   layoutPixelSize *
//   Platform.select({
//     android: 2,
//     ios: 4
//   });
export const MENU_ICON_PADDING_LEFT = normalize(12);
const WINDOW_WIDTH = Dimensions.get("window").width;

export const navigationStyles = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: "white" },
  emptyView: { flex: 1 },
  navigatorContainer: {
    flex: 1,
    backgroundColor: colors.primaryAccent
  },
  header: {
    height: normalize(55),
    backgroundColor: "white",
    flexDirection: "row"
  },
  headerTitle: {
    textAlign: "center",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        paddingRight: 0
      }
    }),
    fontFamily: "Lato",
    color: colors.primaryText,
    fontSize: normalizeFont(2.5)
  },
  headerLeftIconContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: MENU_ICON_PADDING_LEFT
  },
  headerLeftIcon: {
    alignSelf: "flex-start",
    color: colors.primaryText
  },
  planHeaderTitle: {}
});

export const headerContainer = <View style={navigationStyles.emptyView} />;

export function navigateOnce(getStateForAction) {
  return (action, state) => {
    const { type, routeName } = action;
    return state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
      ? null
      : getStateForAction(action, state);
  };
}

export function showChatScreenExitWarning(cb) {
  Alert.alert(
    "You have unsaved changes",
    "Going back will delete messages in the chat",
    [
      {
        text: "Go back",
        style: "destructive",
        onPress: cb
      },
      {
        text: "Continue",
        style: "cancel",
        onPress: () => {}
      }
    ],
    { cancelable: false }
  );
}

export function renderBackButton(navigation: any) {
  const iconName = (Platform.OS === "ios" ? "ios" : "md") + "-arrow-back";
  const normalScreenGoBack = () => {
    navigation.dispatch(NavigationActions.back());
  };
  const chattingScreenGoBack = () =>
    showChatScreenExitWarning(normalScreenGoBack);
  if (
    navigation.state.routeName === "Chat" &&
    navigation.state.params &&
    !navigation.state.params.isStartScreen
  ) {
    handleGoBack = chattingScreenGoBack;
  } else {
    handleGoBack = normalScreenGoBack;
  }
  return (
    <View style={navigationStyles.headerLeftIconContainer}>
      <TouchableOpacity
        accessibilityLabel="nav__back-btn"
        onPress={handleGoBack}
      >
        <Ionicon
          name={iconName}
          size={MENU_ICON_SIZE}
          style={navigationStyles.headerLeftIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

export function renderMenuButton(
  navigation,
  iconStyle = navigationStyles.headerLeftIcon
) {
  return (
    <View style={navigationStyles.headerLeftIconContainer}>
      <TouchableOpacity
        accessibilityLabel="nav__menu-btn"
        onPress={() => {
          navigation.navigate("DrawerOpen");
        }}
      >
        <Icon name="menu" size={MENU_ICON_SIZE} style={iconStyle} />
      </TouchableOpacity>
    </View>
  );
}

export const backButtonNavOptions = ({ navigation }) => {
  let options = {
    headerTitleStyle: [
      navigationStyles.headerTitle,
      navigationStyles.planHeaderTitle
    ],
    headerLeft: renderBackButton(navigation),
    headerRight: headerContainer
  };
  if (Platform.OS === "ios") {
    options.headerStyle = navigationStyles.header;
  }
  return options;
};

export function createDrawerNavOptions(drawerLabel, iconName) {
  return {
    drawerLabel,
    drawerIcon: ({ tintColor }) => (
      <Icon name={iconName} size={22} color={tintColor} />
    )
  };
}
