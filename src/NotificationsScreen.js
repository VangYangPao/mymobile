import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "./defaultComponents";
import colors from "./colors";

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

  renderNotification(notification, idx) {
    return (
      <TouchableOpacity key={idx}>
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.softBorderLine,
            backgroundColor: notification.new ? colors.softBorderLine : "white"
          }}
        >
          <Text>{notification.message}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {this.state.notifications.map(this.renderNotification)}
      </View>
    );
  }
}
