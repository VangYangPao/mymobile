import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} from "react-native";

import { Text } from "./defaultComponents";
import colors from "./colors";

const buttonBorderRadius = 5;

export default class Button extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        activeOpacity={0.7}
        style={[styles.container, this.props.containerStyle]}
        underlayColor={colors.borderLine}
      >
        <View style={[styles.button, this.props.style]}>
          <Text style={styles.buttonText}>{this.props.children}</Text>
        </View>
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
    backgroundColor: colors.primaryOrange
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
