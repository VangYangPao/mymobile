import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Button,
  Picker,
  ScrollView,
  InteractionManager
} from "react-native";
import { NavigationActions } from "react-navigation";
import VectorDrawableView from "./VectorDrawableView";

import { Text } from "./defaultComponents";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { renderMenu: false };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ renderMenu: true })
    );
  }

  renderMenuItem(item) {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={item.onPress}
        activeOpacity={0.5}
        style={styles.menuIconContainer}
      >
        <VectorDrawableView resourceName={item.icon} style={styles.menuIcon} />
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { rootNavigation } = this.props.screenProps;
    const resetTo = routeName =>
      rootNavigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName })]
        })
      );
    const menuItems = [
      {
        title: "buy",
        icon: "ic_cart",
        onPress: () => rootNavigation.navigate("BuyStack")
      },
      {
        title: "claim",
        icon: "ic_claim",
        onPress: () => rootNavigation.navigate("ClaimStack")
      },
      // {
      //   title: "calculate",
      //   icon: "ic_calculate",
      //   onPress: () => resetTo("Notification")
      // },
      {
        title: "notification",
        icon: "ic_notification",
        onPress: () => rootNavigation.navigate("StatusStack")
      }
    ];

    return (
      <View style={styles.container}>
        <VectorDrawableView
          resourceName="ic_microassure_white"
          style={styles.appName}
        />
        {this.state.renderMenu
          ? <View style={styles.menu}>
              <View style={styles.menuRow}>
                {menuItems.slice(0, 2).map(this.renderMenuItem)}
              </View>
              <View style={styles.menuRow}>
                {menuItems.slice(2, 4).map(this.renderMenuItem)}
              </View>
            </View>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Comfortaa-Bold"
  },
  menuIconContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  menuIcon: {
    width: 80,
    height: 80
  },
  menuRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  menu: {
    flex: 0.5,
    marginTop: 50,
    marginBottom: 50,
    borderRadius: 5,
    backgroundColor: "white"
  },
  appName: {
    height: 40
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  }
});
