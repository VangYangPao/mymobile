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
import { objectToUrlParams } from "../utils";

const windowWidth = Dimensions.get("window").width;

const CHECKOUT_URL = "https://api-dev-my.microumbrella.com/checkout.php";
const RETURN_URL = "https://api-dev-my.microumbrella.com/return.php";
const WEBCASH_STAGING_ENQUIRY = "https://staging.webcash.com.my/enquiry.php";
const LIVE_MERCHANT_SECRET = "btIgLUk2rtiAnqa5";
const LIVE_MERCHANT_ID = "80002922";
const UAT_MERCHANT_SECRET = "123456";
const UAT_MERCHANT_ID = "80000155";

type WebcashViewProps = {
  orderAmount: number,
  orderPerson: string,
  orderLocation: string
};

type NavigationStateChangeType = {
  canGoBack: boolean,
  canGoForward: boolean,
  loading: boolean,
  title: string,
  url: string,
  target: number
};

class WebcashView extends Component {
  props: WebcashViewProps;
  state: {
    webcashHTML: ?string,
    errMessage: ?string
  };
  handleLoadError: Error => void;
  handleLoadHTML: string => void;
  webcashPayload: Object;

  constructor(props: WebcashViewProps) {
    super(props);
    this.state = { webcashHTML: null, errMessage: null };
    this.handleLoadError = this.handleLoadError.bind(this);
    this.handleLoadHTML = this.handleLoadHTML.bind(this);

    const random = Math.floor(Math.random() * 999999);
    const orderRef = "Test" + random;

    const orderAmountStr = this.props.orderAmount.toFixed(2).replace(".", "");
    const merchantHashValue = sha1(
      UAT_MERCHANT_SECRET + UAT_MERCHANT_ID + orderRef + orderAmountStr
    );

    this.webcashPayload = {
      ord_date: new Date(),
      ord_totalamt: props.orderAmount.toFixed(2),
      ord_shipname: props.orderPerson,
      ord_shipcountry: props.orderLocation,
      ord_mercref: orderRef,
      ord_mercID: UAT_MERCHANT_ID,
      merchant_hashvalue: merchantHashValue,
      ord_returnURL: RETURN_URL
    };
  }

  handleLoadError() {
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

  handleLoadHTML(webcashHTML: string) {
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ webcashHTML });
      });
    }, 500);
  }

  handleNavigationStateChange(stateChange: NavigationStateChangeType) {
    if (stateChange.url === WEBCASH_STAGING_ENQUIRY) {
    }
  }

  handleWebViewMessage(event: { nativeEvent: { data: string } }) {
    const responseCode = event.nativeEvent.data;
    if (responseCode === "S") {
      console.log("Success!");
    }
  }

  render() {
    if (this.state.errMessage) {
      return (
        <View style={styles.webcashLoading}>
          <Text style={[styles.purchaseLoadingText, styles.webcashLoadingText]}>
            {this.state.errMessage}
          </Text>
        </View>
      );
    }

    const loadingView = (
      <View style={styles.webcashLoading}>
        <ActivityIndicator color="black" size="large" />
        <Text style={[styles.purchaseLoadingText, styles.webcashLoadingText]}>
          Loading payment gateway...
        </Text>
      </View>
    );

    const urlParams = objectToUrlParams(this.webcashPayload);
    const checkoutURL = `${CHECKOUT_URL}?${urlParams}`;

    // const injectedJavaScript = `if (window.location.href === ${WEBCASH_STAGING_ENQUIRY}) { window.postMessage(document.childNodes[0].innerText) } `;
    const injectedJavaScript = `setInterval(function() {
      if (window.location.href === '${WEBCASH_STAGING_ENQUIRY}') {
        window.postMessage(document.childNodes[0].innerText);
      }
    }, 1000)`;

    return (
      <WebView
        style={styles.flex1}
        source={{
          uri: checkoutURL
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={this.handleLoadError}
        onNavigationStateChange={this.handleNavigationStateChange}
        renderLoading={() => loadingView}
        onMessage={this.handleWebViewMessage}
        injectedJavaScript={injectedJavaScript}
      />
    );
  }
}

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
              <WebcashView
                orderAmount={orderAmount}
                orderPerson={orderPerson}
                orderLocation={orderLocation}
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
