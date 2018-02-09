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
  NetInfo,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { CreditCardInput } from "react-native-credit-card-input";
import sha1 from "sha1";

import { Text } from "../defaultComponents";
import AppStore from "../../microumbrella-core/stores/AppStore";
const colors = AppStore.colors;
import Button from "../../microumbrella-core/src/components/Button";
import {
  MENU_ICON_SIZE,
  navigationStyles
} from "../../microumbrella-core/src/navigations";
import { objectToUrlParams, generateID } from "../utils";

const windowWidth = Dimensions.get("window").width;

const CHECKOUT_URL = "https://api-dev-my.microumbrella.com/index2.php";

type PaypalViewProps = {
  orderAmount: number,
  orderPerson: string,
  orderLocation: string,
  onCheckout: (paymentForm?: Object) => void
};

type NavigationStateChangeType = {
  canGoBack: boolean,
  canGoForward: boolean,
  loading: boolean,
  title: string,
  url: string,
  target: number
};

class PaypalView extends Component {
  props: PaypalViewProps;
  state: {
    paypalHTML: ?string,
    errMessage: ?string,
    checkingOut: boolean
  };
  handleLoadError: Error => void;
  handleWebViewMessage: ({ nativeEvent: { data: string } }) => void;
  payaplPayload: Object;

  constructor(props: PaypalViewProps) {
    super(props);
    this.state = { paypalHTML: null, errMessage: null, checkingOut: false };
    this.handleLoadError = this.handleLoadError.bind(this);
    this.handleWebViewMessage = this.handleWebViewMessage.bind(this);

    const random = Math.floor(Math.random() * 999999);
    const orderRef = "Test" + random;

    // const orderAmountStr = this.props.orderAmount.toFixed(2).replace(".", "");
    // const merchantHashValue = sha1(
    //   UAT_MERCHANT_SECRET + UAT_MERCHANT_ID + orderRef + orderAmountStr
    // );

    this.payaplPayload = {
      currency_code: 'USD',
      city: props.orderLocation,
      first_name: props.orderPerson,
      item_number: orderRef,
      item_name: orderRef,
      amount: props.orderAmount.toFixed(2),
    };
  }

  handleLoadError(e) {
    console.error(e);
    NetInfo.fetch().done(connectionType => {
      if (connectionType === "none") {
        this.setState({
          errMessage: "Oops... Try checking your WiFi connection or data"
        });
      } else {
        this.setState({
          errMessage: "Oops... Something went wrong,\nTry refreshing the page"
        });
      }
    });
  }

  handleWebViewMessage(event: { nativeEvent: { data: string } }) {
    const merchantRef = "TR" + generateID();
    const responseCode = event.nativeEvent.data;

    const promise = new Promise((resolve, reject) => {
      if (responseCode === "S") {
        resolve({ responseCode, merchantRef });
      } else {
        reject({ responseCode, merchantRef });
      }
    });
    this.props.onCheckout(promise);
  }

  render() {

    const loadingView = (
      <View style={styles.webcashLoading}>
        <ActivityIndicator color="black" size="large" />
        <Text style={[styles.purchaseLoadingText, styles.webcashLoadingText]}>
          Loading payment gateway...
        </Text>
      </View>
    );

    const urlParams = objectToUrlParams(this.payaplPayload);
    const checkoutURL = `${CHECKOUT_URL}?${urlParams}`;

    const patchPostMessageJsCode = `(${String(function() {
      var originalPostMessage = window.postMessage
      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer)
      }
      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
      }
      window.postMessage = patchedPostMessage
    })})();`

    return (
      <WebView
        style={styles.flex1}
        source={{
          uri: checkoutURL,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={this.handleLoadError}
        renderLoading={() => loadingView}
        onMessage={this.handleWebViewMessage}
        injectedJavaScript={patchPostMessageJsCode}
      />
    );
  }
}

type PaypalCheckoutModalProps = {
  price: number,
  purchasing: boolean,
  onCheckout: (form: Object) => void,
  onClose: () => void
};

export default class PaypalCheckoutModal extends Component {
  props: PaypalCheckoutModalProps;

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
              <PaypalView
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
  webcashLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flex1: { flex: 1 },
  checkoutButton: {
    color: colors.primaryAccent,
    fontWeight: "500",
    fontSize: 18
  },
  webcashLoadingText: {
    color: colors.primaryText,
    textAlign: "center",
    paddingHorizontal: 20
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
