import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Dimensions,
  Button
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CreditCardInput } from "react-native-credit-card-input";

import { Text } from "./defaultComponents";
import colors from "./colors";

const windowWidth = Dimensions.get("window").width;

export default class CheckoutModal extends Component {
  render() {
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
                Enter credit card details
              </Text>
            </View>
            <View style={styles.checkoutContent}>
              <CreditCardInput
                onChange={this._onChange}
                inputStyle={styles.creditCardInputStyle}
              />
            </View>
            <Button
              onPress={() => {
                if (typeof this.props.onCheckout === "function") {
                  this.props.onCheckout();
                }
              }}
              title="CONFIRM PURCHASE"
              color={colors.primaryOrange}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  closeIcon: {},
  checkoutContent: {
    paddingVertical: 20
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: colors.softBorderLine
  },
  checkoutTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "500"
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});
