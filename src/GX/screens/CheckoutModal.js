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
  StatusBar,
  WebView,
  InteractionManager,
  NetInfo
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import sha1 from "sha1";

import { Text } from "../../defaultComponents";
import AppStore from "../../../microumbrella-core/stores/AppStore";
const colors = AppStore.colors;
import Button from "../../../microumbrella-core/src/components/Button";
import PayPalWebView from "../components/PayPalWebView";
import {
  MENU_ICON_SIZE,
  navigationStyles
} from "../../../microumbrella-core/src/navigations";
import { objectToUrlParams, generateID } from "../../utils";

type CheckoutModalProps = {
  price: number,
  purchasing: boolean,
  onCheckout: (form: Object) => void,
  onClose: () => void
};

export default class CheckoutModal extends Component {
  props: CheckoutModalProps;

  render() {
    const iconName = (Platform.OS === "ios" ? "ios" : "md") + "-arrow-back";
    const { price: orderAmount } = this.props;
    const orderPerson = "hello";
    const orderLocation = "kuala lumpur";

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
            </View>
            <View style={styles.checkoutContent}>
              {/*<Text style={styles.checkoutTitle}>
                Enter your credit card details
              </Text>*/}
              <PayPalWebView
                orderAmount={orderAmount}
                orderPerson={orderPerson}
                orderLocation={orderLocation}
                onCheckout={this.props.onCheckout}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  closeIcon: {},
  checkoutContent: {
    flex: 1,
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
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
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
