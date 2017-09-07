import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  WebView,
  Platform,
  Alert
} from "react-native";
import termsOfUseHTML from "../data/TermsOfUse";
import Button from "./Button";
import { Text } from "./defaultComponents";
import colors from "./colors";
import { NavigationActions } from "react-navigation";

const resetToDrawerAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Drawer" })]
});

export default class TermsOfUse extends Component {
  handleAccept() {
    this.props.navigation.dispatch(resetToDrawerAction);
  }

  handleDecline() {
    if (Platform.OS === "ios") {
      Alert.alert("Sorry", "Terms of use must be accepted", [
        {
          text: "OK"
        }
      ]);
    } else {
      ToastAndroid.show("Terms of use must be accepted", ToastAndroid.LONG);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView style={styles.webview} source={{ html: termsOfUseHTML }} />
        <View style={styles.acceptDeclineContainer}>
          <Button
            onPress={this.handleAccept.bind(this)}
            containerStyle={[styles.buttons, styles.acceptButton]}
            style={{ backgroundColor: colors.primaryOrange }}
          >
            <Text>
              I HAVE READ, UNDERSTOOD AND AGREED WITH THE TERMS OF USE AND
              PRIVACY POLICY.
            </Text>
          </Button>
          <Button
            onPress={this.handleDecline.bind(this)}
            containerStyle={[styles.buttons, styles.declineButton]}
            style={styles.declineButton}
          >
            DISAGREE
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 0
  },
  acceptButton: {
    flex: 0.6,
    backgroundColor: colors.primaryOrange,
    justifyContent: "center",
    paddingHorizontal: 50
  },
  declineButton: {
    flex: 0.4,
    backgroundColor: colors.borderLine,
    justifyContent: "center"
  },
  acceptDeclineContainer: {
    flex: 0.3
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "white"
  },
  webview: {
    flex: 1
  }
});
