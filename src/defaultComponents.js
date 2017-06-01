import React, { Component } from "react";
import { StyleSheet, Text as DefaultText } from "react-native";

export class Text extends Component {
  render() {
    return (
      <DefaultText {...this.props} style={[styles.text, this.props.style]}>
        {this.props.children}
      </DefaultText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Lato"
  }
});
