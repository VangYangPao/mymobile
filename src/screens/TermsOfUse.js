// @flow
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  WebView,
  Platform,
  Alert,
  ToastAndroid
} from "react-native";
import documentStyle from "../../documents/documentStyle";
import termsOfUseHTML from "../../documents/termsOfUse";
import Button from "../components/Button";
import { Text } from "../components/defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { NavigationActions } from "react-navigation";

export default class TermsOfUse extends Component {
  handleAccept() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: "Intro"
        }),
        NavigationActions.navigate({
          routeName: "Drawer",
          action: NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Chat",
                params: {
                  isStartScreen: true,
                  questionSet: "buy"
                }
              })
            ]
          })
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
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
    const html = documentStyle + termsOfUseHTML;
    return (
      <View style={styles.container}>
        <WebView style={styles.webview} source={{ html }} />
        <View style={styles.acceptDeclineContainer}>
          <Button
            onPress={this.handleAccept.bind(this)}
            containerStyle={styles.buttons}
            style={[styles.buttons, styles.acceptButton]}
          >
            {"I have read, understood and agreed upon the agreement and declaration".toUpperCase()}
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
    borderRadius: 0
  },
  acceptButton: {
    justifyContent: "center"
  },
  declineButton: {
    flex: 0.4,
    backgroundColor: colors.borderLine,
    justifyContent: "center"
  },
  acceptDeclineContainer: {
    flex: 0.3,
    backgroundColor: "white"
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
