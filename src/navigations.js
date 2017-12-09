// @flow
import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import AppStore from "../stores/AppStore";
const colors = AppStore.colors;

const menuIconSizes = {
  2: 30,
  3: 35
};

export const MENU_ICON_SIZE = menuIconSizes[PixelRatio.get()];
export const MENU_ICON_PADDING_LEFT = 15;
export const MENU_ICON_PADDING_RIGHT = 10;
const WINDOW_WIDTH = Dimensions.get("window").width;

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
    <TouchableOpacity accessibilityLabel="nav__back-btn" onPress={handleGoBack}>
      <Ionicon
        name={iconName}
        size={MENU_ICON_SIZE}
        style={styles.headerMenuIcon}
      />
    </TouchableOpacity>
  );
}

export function renderMenuButton(
  navigation,
  iconStyle = styles.headerMenuIcon
) {
  return (
    <TouchableOpacity
      accessibilityLabel="nav__menu-btn"
      onPress={() => {
        navigation.navigate("DrawerOpen");
      }}
    >
      <Icon name="menu" size={MENU_ICON_SIZE} style={iconStyle} />
    </TouchableOpacity>
  );
}

export const backButtonNavOptions = ({ navigation }) => {
  let options = {
    headerTitleStyle: [styles.headerTitle, styles.planHeaderTitle],
    headerLeft: renderBackButton(navigation)
  };
  if (Platform.OS === "ios") {
    options.headerStyle = styles.header;
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

export const styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1,
    backgroundColor: colors.primaryAccent
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
    ...Platform.select({
      ios: {
        paddingRight: 0
      },
      android: {
        paddingRight:
          MENU_ICON_SIZE + MENU_ICON_PADDING_LEFT + MENU_ICON_PADDING_RIGHT
      }
    }),
    fontFamily: "Lato",
    color: colors.primaryText
  },
  homeHeaderMenuIcon: {
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: "white"
  },
  headerMenuIcon: {
    alignSelf: "flex-start",
    paddingLeft: MENU_ICON_PADDING_LEFT,
    paddingRight: MENU_ICON_PADDING_RIGHT,
    color: colors.primaryText
  },
  planHeaderTitle: {}
});
