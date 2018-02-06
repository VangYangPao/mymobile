// @flow
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
  Platform,
  ActivityIndicator,
  Keyboard,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { CreditCardInput } from "react-native-credit-card-input";

import { Text } from "../defaultComponents";
import AppStore from "../../microumbrella-core/stores/AppStore";
const colors = AppStore.colors;
import Button from "../../microumbrella-core/src/components/Button";
import {
  MENU_ICON_SIZE,
  navigationStyles
} from "../../microumbrella-core/src/navigations";

const windowWidth = Dimensions.get("window").width;

export default class CheckoutModal extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.entries = ["number", "expiry", "cvc", "name"];
    this.state = {
      form: null,
      firstSubmit: false,
      afterSubmit: false,
      loadingText: "GETTING YOU COVERED..."
    };
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
        if (invalidEntry) {
          this.creditCardInput.focus(invalidEntry);
        }
      }
      if (!this.state.form) {
        // not filled yet, just focus first one
        this.creditCardInput.focus("number");
      }
    }

    if (
      this.props.purchasing &&
      this.props.purchasing !== prevProps.purchasing
    ) {
      Keyboard.dismiss();
      const texts = [
        "ONE SECOND...",
        "PROCESSING YOUR CARD...",
        "VERIFYING YOUR IDENTITY...",
        "AUTHENTICATING PAYMENT...",
        "PERFORMING PAYMENT..."
      ];
      texts.forEach((text, idx) => {
        setTimeout(() => {
          this.setState({ loadingText: text });
        }, 3000 * (idx + 1));
      });
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
    if (this.state.form.valid && typeof this.props.onCheckout === "function") {
      const promise = new Promise((resolve, reject) => {
        if (this.state.form) {
          resolve(this.state.form.values);
        } else {
          reject("this.state.form is undefined");
        }
      });
      this.props.onCheckout(promise);
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

    const purchaseLoadingView = (
      <View style={styles.purchaseLoading}>
        <ActivityIndicator color="white" size="large" />
        <Text style={styles.purchaseLoadingText}>{this.state.loadingText}</Text>
      </View>
    );

    const btnText = `CONFIRM PURCHASE ($${this.props.price.toFixed(2)})`;
    const additionalInputsProps = {
      number: {
        accessibilityLabel: "purchase__card-number-input"
      },
      expiry: {
        accessibilityLabel: "purchase__expiry-input"
      },
      cvc: {
        accessibilityLabel: "purchase__cvc-input"
      },
      name: {
        accessibilityLabel: "purchase__card-name-input",
        autoCapitalize: "words"
      }
    };
    const iconName = (Platform.OS === "ios" ? "ios" : "md") + "-arrow-back";

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
              <TouchableOpacity onPress={this.props.onClose}>
                <Ionicon
                  name={iconName}
                  size={MENU_ICON_SIZE}
                  style={navigationStyles.headerLeftIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="purchase__confirm-purchase-btn"
                onPress={this.handleCheckout}
              >
                <Text style={styles.checkoutButton}>SAVE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkoutContent}>
              <Text style={styles.checkoutTitle}>
                Enter your credit card details
              </Text>
              <CreditCardInput
                ref={c => (this.creditCardInput = c)}
                cardScale={0.75}
                inputContainerStyle={styles.inputContainerStyle}
                invalidColor={colors.errorRed}
                additionalInputStyles={additionalInputStyles}
                additionalInputsProps={additionalInputsProps}
                onChange={this.handleInputChange}
                requiresName={true}
                requiresCVC={true}
                cardImageFront={require("../../images/card-front.png")}
                cardImageBack={require("../../images/card-back.png")}
              />
            </View>
            {/*<Button
              accessibilityLabel="purchase__confirm-purchase-btn"
              containerStyle={styles.noBorderRadius}
              style={styles.noBorderRadius}
              onPress={this.handleCheckout}
            >
              {btnText}
            </Button>*/}
            {this.props.purchasing ? purchaseLoadingView : null}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  checkoutButton: {
    color: colors.primaryAccent,
    fontWeight: "500",
    fontSize: 18
  },
  purchaseLoadingText: {
    marginTop: 20,
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },
  purchaseLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)"
  },
  inputContainerStyle: {
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLine
  },
  noBorderRadius: {
    borderRadius: 0
  },
  closeIcon: {},
  checkoutContent: {
    paddingTop: 5,
    paddingBottom: 30
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 25,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: colors.softBorderLine
  },
  checkoutTitle: {
    alignSelf: "center",
    marginVertical: 10,
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
