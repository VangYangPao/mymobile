// @flow
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "../components/defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

const SCREEN_TITLE = "Notifications";

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
        {
          message: "Adeline Tan has shared with you their policy information!",
          new: false
        },
        {
          message:
            "Share your Micro Protect360 policy with your loved ones. This allows your beneficiary to claim on your behalf.",
          new: false
        }
      ]
    };
  }

  componentDidMount() {
    const newNotification = {
      message: "Your claim for AM959 is lacking medical receipt",
      new: true
    };
    setTimeout(() => {
      this.setState({
        notifications: [newNotification].concat(this.state.notifications)
      });
    }, 2000);
  }

  renderNotification({ item, index }) {
    const notification = item;
    return (
      <TouchableOpacity key={index}>
        <View
          style={[
            styles.notificationContainer,
            notification.new ? styles.notificationNew : styles.notificationRead
          ]}
        >
          <Text>{notification.message}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const ItemSeparatorComponent = () => <View style={styles.separator} />;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.notifications}
          keyExtractor={(item, idx) => idx}
          renderItem={this.renderNotification}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationRead: {
    backgroundColor: "white"
  },
  notificationNew: {
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
