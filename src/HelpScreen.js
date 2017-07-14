import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { StackNavigator } from "react-navigation";
import { Text } from "./defaultComponents";
import Page from "./Page";
import { backButtonNavOptions } from "./navigations";
import colors from "./colors";

class HelpScreen extends Component {
  static navigationOptions = {
    title: "Help",
    drawerLabel: () => null
  };

  render() {
    return (
      <Page>
        <Text style={styles.title}>
          Please describe the problem or difficulty you are facing.
          {"\n\n"}
          If you have any feedback or comments, please kindly leave them below.
          {"\n\n"}
          We will contact you within 48 hours time.
        </Text>
        <TextInput multiline={true} style={styles.input} />
      </Page>
    );
  }
}

export default (HelpScreenStack = StackNavigator({
  Help: {
    screen: HelpScreen,
    navigationOptions: backButtonNavOptions
  }
}));

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 16
  },
  input: {
    height: 200,
    paddingHorizontal: 5,
    borderColor: colors.borderLine,
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 16
  }
});
