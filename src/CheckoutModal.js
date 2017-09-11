import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  ToastAndroid,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CreditCardInput } from "react-native-credit-card-input";

import { Text } from "./defaultComponents";
import colors from "./colors";
import Button from "./Button";

const windowWidth = Dimensions.get("window").width;

export default class CheckoutModal extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.entries = ["number", "expiry", "cvc"];
    this.state = { form: null, firstSubmit: false, afterSubmit: false };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.afterSubmit !== prevState.afterSubmit &&
      this.state.afterSubmit &&
      this.creditCardInput
    ) {
      if (this.state.form && !this.state.form.valid) {
        const invalidEntry = this.entries.find(
          entry => this.state.form.status[entry] !== "valid"
        );
        this.creditCardInput.focus(invalidEntry);
      }
      if (!this.state.form) {
        // not filled yet, just focus first one
        this.creditCardInput.focus("number");
      }
    }
  }

  handleInputChange(form) {
    this.setState({ form });
  }

  handleCheckout() {
    if (!this.state.form || !this.state.form.valid) {
      const msg = "Your credit card details are incomplete";
      if (Platform.OS === "ios") {
        Alert.alert(msg);
      } else {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      }
      let newState = { afterSubmit: true };
      if (!this.state.firstSubmit) {
        newState.firstSubmit = true;
      }
      this.setState(newState);
      setTimeout(() => {
        this.setState({ afterSubmit: false });
      }, 300);
      return;
    }
    if (typeof this.props.onCheckout === "function") {
      this.props.onCheckout();
    }
  }

  render() {
    let additionalInputStyles = {};
    if (this.state.firstSubmit) {
      this.entries.forEach(entry => {
        if (!this.state.form) {
          additionalInputStyles[entry] = {
            borderBottomColor: colors.errorRed
          };
          return;
        }
        const isValid = this.state.form.status[entry] === "valid";
        const borderBottomColor = isValid ? colors.borderLine : colors.errorRed;
        additionalInputStyles[entry] = { borderBottomColor };
      });
    }

    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={true}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentContainer}>
            <View style={styles.checkoutHeader}>
              <Text style={styles.checkoutTitle}>
                Enter your credit card details
              </Text>
            </View>
            <View style={styles.checkoutContent}>
              <CreditCardInput
                ref={c => (this.creditCardInput = c)}
                inputContainerStyle={styles.inputContainerStyle}
                invalidColor={colors.errorRed}
                additionalInputStyles={additionalInputStyles}
                onChange={this.handleInputChange}
              />
            </View>
            <Button
              containerStyle={styles.noBorderRadius}
              style={styles.noBorderRadius}
              onPress={this.handleCheckout}
            >
              CONFIRM PURCHASE (${this.props.price.toFixed(2)})
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLine
  },
  noBorderRadius: {
    borderRadius: 0
  },
  closeIcon: {},
  checkoutContent: {
    paddingVertical: 20
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    backgroundColor: colors.softBorderLine
  },
  checkoutTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center"
  },
  modalContentContainer: {
    alignItems: "stretch",
    justifyContent: "center",
    width: windowWidth,
    backgroundColor: "white"
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});
