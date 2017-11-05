// @flow
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationActions } from "react-navigation";

import { Text } from "../components/defaultComponents";
import Button from "../components/Button";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

const SCREEN_TITLE = "Notifications";

const navigateToPurchaseAction = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({
      routeName: "Drawer",
      action: NavigationActions.navigate({
        routeName: "BuyStack"
      })
    })
  ]
});

export default class NotificationsScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLE,
    drawerLabel: SCREEN_TITLE,
    drawerIcon: ({ tintColor }) => (
      <Icon name="notifications" size={22} color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        // {
        //   message: "Adeline Tan has shared with you their policy information!",
        //   unread: true
        // },
        // {
        //   message:
        //     "Share your Micro Protect360 policy with your loved ones. This allows your beneficiary to claim on your behalf.",
        //   unread: false
        // }
      ]
    };
  }

  // componentDidMount() {
  //   const newNotification = {
  //     message: "Your claim for AM959 is lacking medical receipt",
  //     new: true
  //   };
  //   setTimeout(() => {
  //     this.setState({
  //       notifications: [newNotification].concat(this.state.notifications)
  //     });
  //   }, 2000);
  // }

  renderNotification({ item, index }) {
    const notification = item;
    return (
      <TouchableOpacity key={index}>
        <View
          style={[
            styles.notificationContainer,
            notification.unread
              ? styles.notificationUnread
              : styles.notificationRead
          ]}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const ItemSeparatorComponent = () => <View style={styles.separator} />;
    const emptyNotifications = (
      <View style={styles.emptyNotifications}>
        <Text style={styles.emptyNotificationsTitle}>
          You have no notifications.
        </Text>
        <Text
          style={[
            styles.emptyNotificationsTitle,
            styles.emptyNotificationsSubtitle
          ]}
        >
          Let's get you protected.
        </Text>
        <Button
          onPress={() =>
            this.props.navigation.dispatch(navigateToPurchaseAction)}
        >
          BROWSE PRODUCTS
        </Button>
      </View>
    );
    return (
      <View style={styles.container}>
        {this.state.notifications.length ? (
          <FlatList
            data={this.state.notifications}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderNotification}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        ) : (
          emptyNotifications
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyNotificationsSubtitle: {
    marginTop: 20,
    marginBottom: 15
  },
  emptyNotificationsTitle: {
    fontSize: 20,
    textAlign: "center"
  },
  emptyNotifications: {
    marginTop: 15,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  notificationText: {
    fontSize: 16
  },
  notificationRead: {
    backgroundColor: "white"
  },
  notificationUnread: {
    backgroundColor: colors.softBorderLine
  },
  notificationContainer: {
    padding: 15
  },
  separator: {
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
