// @flow
import uuid from "uuid";
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid,
  Alert,
  Platform,
  ActivityIndicator
} from "react-native";
import moment from "moment";
import { NavigationActions } from "react-navigation";

import type { PolicyHolder, PaymentDetails } from "./types/hlas";
import { purchaseTravelPolicy } from "./hlas";
import database from "./HackStorage";
import { Text } from "./defaultComponents";
import { showAlert, prettifyCamelCase } from "./utils";
import Page from "./Page";
import Footer from "./Footer";
import PolicyPrice from "./PolicyPrice";
import CheckoutModal from "./CheckoutModal";
import { getTravelQuote } from "./hlas";
import { CONFIRMATION_PAGE_LOAD_TIME } from "react-native-dotenv";
const PAGE_LOAD_TIME = parseInt(CONFIRMATION_PAGE_LOAD_TIME, 10);

type PaymentForm = {
  type: "visa" | "master-card",
  number: string,
  name: string,
  expiry: string,
  cvc: string
};

type State = {
  renderCheckoutModal: boolean,
  loading: boolean,
  purchasing: boolean,
  totalPremium: ?number
};

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  state: State;
  policy: any;
  handleCheckout: Function;
  handlePurchaseTravelPolicy: Function;

  constructor(props: { navigation: any, totalPremium: ?number }) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handlePurchaseTravelPolicy = this.handlePurchaseTravelPolicy.bind(
      this
    );
    const { form } = this.props.navigation.state.params;
    this.policy = form.policy;
    delete form.policy;
    this.state = {
      renderCheckoutModal: false,
      loading: true,
      purchasing: false,
      totalPremium: null
    };
  }

  componentWillMount() {
    // load at least 2 seconds
    setTimeout(() => this.setState({ loading: false }), PAGE_LOAD_TIME);
  }

  componentDidMount() {
    const { form } = this.props.navigation.state.params;
    if (this.policy && this.policy.id === "travel") {
      const countryid = form.travelDestination;
      const tripDurationInDays = moment(form.returnDate).diff(
        form.departureDate,
        "days"
      );
      const planid = form.planIndex;
      const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
        form.recipient
      );
      console.log(
        countryid,
        tripDurationInDays,
        planid,
        hasSpouse,
        hasChildren
      );
      getTravelQuote(
        countryid,
        tripDurationInDays,
        planid,
        hasSpouse,
        hasChildren
      ).then(res => {
        this.setState({ totalPremium: parseFloat(res.data) });
      });
    }
  }

  getHasSpouseAndChildren(recipient: string): [boolean, boolean] {
    let hasSpouse = false;
    let hasChildren = false;
    if (recipient === "spouse") {
      hasSpouse = true;
    } else if (recipient === "children") {
      hasChildren = true;
    } else if (recipient === "family") {
      hasSpouse = true;
      hasChildren = true;
    }
    return [hasSpouse, hasChildren];
  }

  handleFinishPurchase(telemoneyResponse: {
    TM_Status: string,
    TM_ApprovalCode: string
  }) {}

  handlePurchaseTravelPolicy(
    premium: number,
    policyHolder: PolicyHolder,
    paymentDetails: PaymentDetails
  ): Promise<any> {
    const { form } = this.props.navigation.state.params;
    const countryid = form.travelDestination;
    const startDate = form.departureDate;
    const endDate = form.returnDate;
    const planid = form.planIndex;
    const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
      form.recipient
    );
    console.log("started purchase", premium, paymentDetails);
    return purchaseTravelPolicy(
      premium,
      countryid,
      startDate,
      endDate,
      planid,
      hasSpouse,
      hasChildren,
      policyHolder,
      paymentDetails
    )
      .then(res => {
        console.log("purchase complete", JSON.stringify(res));
        const newId = database.policies[database.policies.length - 1].id + 1;
        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: "Chat" }),
            NavigationActions.navigate({ routeName: "Status" })
          ]
        });
        const resetToStatusScreen = () =>
          this.props.navigation.dispatch(resetAction);
        database.policies.push({
          id: newId,
          policyType: this.policy.id,
          premium: this.state.totalPremium,
          purchaseDate: new Date(),
          status: "active"
        });
        if (Platform.OS === "ios") {
          Alert.alert("Thank you!", "Your order is complete.", [
            {
              text: "OK",
              onPress: resetToStatusScreen
            }
          ]);
        } else {
          ToastAndroid.show(
            "Thank you! Your order is complete.",
            ToastAndroid.LONG
          );
          resetToStatusScreen();
        }
      })
      .catch(err => {
        if (err.message.indexOf("NRIC/FIN") !== -1) {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Chat" })]
          });
          const afterAlert = () => {
            this.props.navigation.dispatch(resetAction);
          };
          showAlert(
            "Sorry, the current NRIC/FIN has already purchased a policy for this travel duration",
            afterAlert
          );
        }
      });
  }

  handleCheckout(paymentForm: PaymentForm) {
    this.setState({ purchasing: true });
    const { form } = this.props.navigation.state.params;
    const policyHolder = {
      Surname: form.lastName,
      GivenName: form.firstName,
      IDNumber: form.NRIC,
      DateOfBirth: "1988-07-22",
      GenderID: 1,
      MobileTelephone: "91234567",
      Email: form.email,
      UnitNumber: "11",
      BlockHouseNumber: "11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "089057"
    };
    const cardTypes = { "master-card": 2, visa: 3 };
    const NameOnCard = paymentForm.name;
    const CardNumber = paymentForm.number.replace(/ /g, "");
    const CardType = cardTypes[paymentForm.type];
    const CardSecurityCode = paymentForm.cvc;
    let [CardExpiryMonth, CardExpiryYear] = paymentForm.expiry.split("/");
    CardExpiryMonth = parseInt(CardExpiryMonth, 10);
    CardExpiryYear = 2000 + parseInt(CardExpiryYear, 10);
    const paymentDetails: PaymentDetails = {
      NameOnCard,
      CardNumber,
      CardType,
      CardSecurityCode,
      CardExpiryYear,
      CardExpiryMonth
    };
    let promise;
    if (this.policy && this.policy.id === "travel" && this.state.totalPremium) {
      promise = this.handlePurchaseTravelPolicy(
        this.state.totalPremium,
        policyHolder,
        paymentDetails
      );
    }
    console.log(promise);
    if (promise) {
      promise.then(res => {
        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: "Chat" }),
            NavigationActions.navigate({ routeName: "Status" })
          ]
        });
        const resetToStatusScreen = () =>
          this.props.navigation.dispatch(resetAction);
      });
    }
  }

  renderField(key, value) {
    const isDate = moment.isDate(value);
    value = isDate ? moment(value).format("DD MMMM YYYY") : value;
    return (
      <View style={styles.field} key={key}>
        <Text style={styles.fieldKey}>{prettifyCamelCase(key)}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    );
  }

  render() {
    const { form } = this.props.navigation.state.params;
    let formArr = [];
    for (var key in form) {
      formArr.push({ key, value: form[key] });
    }
    const modal = (
      <CheckoutModal
        price={this.state.totalPremium}
        purchasing={this.state.purchasing}
        onCheckout={this.handleCheckout}
        onClose={() => this.setState({ renderCheckoutModal: false })}
      />
    );
    let pageContent;
    if (!this.state.loading && typeof this.state.totalPremium === "number") {
      pageContent = (
        <Page>
          <Text style={styles.pageTitle}>Confirm your details</Text>
          <PolicyPrice pricePerMonth={this.state.totalPremium} />
          {formArr.map(f => this.renderField(f.key, f.value))}
        </Page>
      );
    } else {
      pageContent = <ActivityIndicator color="black" size="large" />;
    }
    return (
      <View style={styles.container}>
        {this.state.renderCheckoutModal ? modal : null}
        <View
          style={[
            styles.pageContainer,
            this.state.loading || !this.state.totalPremium
              ? styles.pageContainerLoading
              : null
          ]}
        >
          {pageContent}
        </View>
        <Footer
          onPress={() => this.setState({ renderCheckoutModal: true })}
          text="ENTER BILLING DETAILS"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fieldKey: {
    flex: 1,
    alignSelf: "flex-start",
    fontWeight: "500",
    fontSize: 16
  },
  fieldValue: {
    flex: 1,
    alignSelf: "flex-end",
    textAlign: "right",
    fontSize: 16
  },
  field: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10
  },
  pageTitle: {
    marginBottom: 20,
    fontSize: 23,
    textAlign: "center"
  },
  pageContainerLoading: {
    alignItems: "center",
    justifyContent: "center"
  },
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1
  }
});
