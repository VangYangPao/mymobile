import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { Text } from "./defaultComponents";
import colors from "./colors";

export default class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.container}
        activeOpacity={0.6}
      >
        <View style={[styles.button, this.props.style]}>
          <Text style={styles.buttonText}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryOrange
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  },
  container: {
    elevation: 3
  }
});
