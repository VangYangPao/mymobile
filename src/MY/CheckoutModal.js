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

import { Text } from "../defaultComponents";
import AppStore from "../../microumbrella-core/stores/AppStore";
const colors = AppStore.colors;
import Button from "../../microumbrella-core/src/components/Button";
import {
  MENU_ICON_SIZE,
  navigationStyles
} from "../../microumbrella-core/src/navigations";

const windowWidth = Dimensions.get("window").width;

type WebcashViewProps = {
  orderAmount: number,
  orderPerson: string,
  orderLocation: string
};

class WebcashView extends Component {
  props: WebcashViewProps;
  state: {
    webcashHTML: ?string,
    errMessage: ?string
  };
  handleLoadError: Error => void;
  handleLoadHTML: string => void;

  constructor(props: WebcashViewProps) {
    super(props);
    this.state = { webcashHTML: null, errMessage: null };
    this.handleLoadError = this.handleLoadError.bind(this);
    this.handleLoadHTML = this.handleLoadHTML.bind(this);
  }

  handleLoadError(err) {
    console.warn(err);
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

  componentDidMount() {
    const url = "https://webcash.com.my/wcgatewayinit.php";
    const random = Math.floor(Math.random() * 999999);
    const ord_mercref = "Test" + random;
    const ord_mercID = "80000321";
    const merchant_hashvalue = "ASNXIF(@JDS(80000321Test40190294950";
    const ord_returnURL = "http://www.scan2fit.com/sftailor/return.php";

    const payload = {
      ord_date: new Date(),
      ord_totalamt: this.props.orderAmount,
      ord_shipname: this.props.orderPerson,
      ord_shipcountry: this.props.orderLocation,
      ord_mercref: ord_mercref,
      ord_mercID: ord_mercID,
      merchant_hashvalue: merchant_hashvalue,
      ord_returnURL: ord_returnURL
    };

    const onLoadHTML = webcashHTML => {};

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/html,application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.text())
      .then(this.handleLoadHTML)
      .catch(this.handleLoadError)
      .done();
  }

  render() {
    if (!this.state.webcashHTML) {
      if (this.state.errMessage) {
        return (
          <View style={styles.webcashLoading}>
            <Text
              style={[styles.purchaseLoadingText, styles.webcashLoadingText]}
            >
              {this.state.errMessage}
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.webcashLoading}>
          <ActivityIndicator color="black" size="large" />
          <Text style={[styles.purchaseLoadingText, styles.webcashLoadingText]}>
            Loading payment gateway...
          </Text>
        </View>
      );
    }
    return (
      <WebView
        style={styles.flex1}
        source={{
          html: this.state.webcashHTML,
          baseUrl: "https://webcash.com.my"
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
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
