import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  Alert,
  Platform,
  ActivityIndicator
} from "react-native";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { normalize } from "../utils";

export default class insideOutButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.insideOutButton, this.props.style || {}]}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  insideOutButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 25,
    borderRadius: 5,
    borderWidth: normalize(1.5),
    borderColor: colors.primaryAccent,
    backgroundColor: "white"
  },
  insideOutButtonText: {
    color: colors.primaryAccent,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  }
});
