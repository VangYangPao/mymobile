// @flow
import React, { Component } from "react";
import { StyleSheet, Text as DefaultText } from "react-native";
import AppStore from "../../stores/AppStore";
import { capitalizeString } from "../../../src/utils";
const colors = AppStore.colors;
const strings = AppStore.strings;

export class Text extends Component {
  render() {
    let string = this.props.children;

    // if (typeof this.props.children === "string") {
    //   for (var key in strings) {
    //     let replacement = strings[key];
    //     const capitalizedKey = capitalizeString(key);
    //     const capitalizedReplacement = capitalizeString(replacement);
    //     string = string.replace(new RegExp(key, "g"), replacement);
    //     string = string.replace(
    //       new RegExp(capitalizedKey, "g"),
    //       capitalizedReplacement
    //     );
    //   }
    // }

    return (
      <DefaultText {...this.props} style={[styles.text, this.props.style]}>
        {string}
      </DefaultText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: colors.primaryText,
    fontFamily: "Lato"
  }
});
