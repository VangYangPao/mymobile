// @flow
import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} from "react-native";

import { Text } from "./defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

const buttonBorderRadius = 5;

export default class Button extends Component {
  render() {
    let innerNode;
    if (typeof this.props.children === "string") {
      innerNode = (
        <Text style={[styles.buttonText, this.props.textStyle]}>
          {this.props.children}
        </Text>
      );
    } else {
      innerNode = this.props.children;
    }
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        activeOpacity={0.7}
        style={[styles.container, this.props.containerStyle]}
        underlayColor={colors.borderLine}
      >
        <View style={[styles.button, this.props.style]}>{innerNode}</View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: buttonBorderRadius,
    backgroundColor: colors.primaryAccent
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  },
  container: {
    borderRadius: buttonBorderRadius
  }
});
