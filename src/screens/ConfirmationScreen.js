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

import type { PolicyHolder, PaymentDetails, MUTraveller } from "../types/hlas";
import { Text } from "../components/defaultComponents";
import { showAlert, prettifyCamelCase } from "../utils";
import Page from "../components/Page";
import Footer from "../components/Footer";
import PolicyPrice from "../components/PolicyPrice";
import CheckoutModal from "../components/CheckoutModal";
import {
  getTravelQuote,
  getAccidentQuote,
  getPhoneProtectQuote,
  purchaseTravelPolicy,
  purchaseAccidentPolicy,
  purchasePhonePolicy
} from "../models/hlas";
import { saveNewPurchase } from "../parse/purchase";
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

const redirectToStatus = currentUser =>
  NavigationActions.reset({
    key: null,
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "Drawer",
        action: NavigationActions.navigate({
          routeName: "MyPolicies"
        })
      })
    ]
  });

const redirectToPolicyPurchase = (policy, currentUser) =>
  NavigationActions.reset({
    index: 2,
    actions: [
      NavigationActions.navigate({
        routeName: "Chat",
        params: {
          currentUser,
          questionSet: "buy",
          isStartScreen: true
        }
      }),
      NavigationActions.navigate({
        routeName: "Policy",
        params: {
          policy
        }
      }),
      NavigationActions.navigate({
        routeName: "Chat",
        params: {
          policy,
          currentUser,
          questionSet: "buy",
          isStartScreen: false
        }
      })
    ]
  });

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  state: State;
  travelPlans: Array<number>;
  paPlans: Array<number>;
  paOptions: { pa: number, pa_mr: number, pa_wi: number };
  paTerms: { "1": 1, "3": 2, "6": 3, "12": 4 };
  policy: any;
  handleCheckout: Function;
  handlePurchaseResult: Function;
  fieldMapping: { [string]: string };

  constructor(props: {
    navigation: any,
    totalPremium: ?number,
    screenProps: any
  }) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handlePurchaseResult = this.handlePurchaseResult.bind(this);
    this.renderField = this.renderField.bind(this);
    const { form } = this.props.navigation.state.params;
    this.policy = form.policy;
    delete form.policy;
    this.state = {
      renderCheckoutModal: false,
      loading: true,
      purchasing: false,
      totalPremium: null
    };
    this.travelPlans = [1, 2, 84, 85];
    this.paPlans = [101, 102, 103, 104];
    this.paTerms = {
      "1": 1,
      "3": 2,
      "6": 3,
      "12": 4
    };
    this.paOptions = {
      pa: 0,
      pa_mr: 1,
      pa_wi: 2
    };
    this.fieldMapping = {
      idNumber: "ID Number",
      idNumberType: "ID Number Type"
    };
  }

  componentWillMount() {
    // load at least 2 seconds
    setTimeout(() => this.setState({ loading: false }), PAGE_LOAD_TIME);
  }

  componentDidMount() {
    const { form } = this.props.navigation.state.params;
    let promise;
    if (this.policy && this.policy.id === "travel") {
      const countryid = form.travelDestination;
      const tripDurationInDays =
        moment(form.returnDate).diff(form.departureDate, "days") + 1;
      const planid = this.travelPlans[form.planIndex];
      const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
        form.travellers
      );
      promise = getTravelQuote(
        countryid,
        tripDurationInDays,
        planid,
        hasSpouse,
        hasChildren
      );
    } else if (
      this.policy &&
      (this.policy.id === "pa" ||
        this.policy.id === "pa_mr" ||
        this.policy.id === "pa_wi")
    ) {
      const planid = this.paPlans[form.planIndex];
      const termid = this.paTerms[form.coverageDuration];
      const optionid = this.paOptions[this.policy.id];
      const commencementDate = new Date();
      promise = getAccidentQuote(planid, termid, optionid, commencementDate);
    } else if (this.policy && this.policy.id === "mobile") {
      promise = getPhoneProtectQuote();
    }
    if (promise) {
      promise
        .then(res => {
          this.setState({ totalPremium: parseFloat(res.data) });
        })
        .catch(err => {
          console.error(err);
          showAlert("Sorry, error getting policy quote");
          const { currentUser } = this.props.navigation.state.params;

          this.props.screenProps.rootNavigation.dispatch(
            redirectToPolicyPurchase(this.policy, currentUser)
          );
        });
    }
  }

  getHasSpouseAndChildren(travellers: Array<MUTraveller>): [boolean, boolean] {
    let hasSpouse = false;
    let hasChildren = false;
    const spouse = travellers.find(traveller => traveller.relationship === 1);
    const child = travellers.find(traveller => traveller.relationship === 2);
    if (spouse) {
      hasSpouse = true;
    }
    if (child) {
      hasChildren = true;
    }
    return [hasSpouse, hasChildren];
  }

  handlePurchaseResult(promise: Promise<any>) {
    const { currentUser } = this.props.navigation.state.params;
    promise
      .then(res => {
        console.log("purchase complete", JSON.stringify(res));
        const {
          policyTypeId,
          pasAppId,
          policyId,
          webAppId,
          premium,
          planId,
          optionId,
          autoRenew,
          policyholderIdType,
          policyholderIdNo,
          tmTxnRef,
          tmVerifyEnrolment,
          tmPaymentSuccessRes,
          additionalAttributes
        } = res.data;
        return saveNewPurchase(
          policyTypeId,
          pasAppId,
          policyId,
          webAppId,
          premium,
          planId,
          optionId,
          autoRenew,
          policyholderIdType,
          policyholderIdNo,
          currentUser,
          tmTxnRef,
          tmVerifyEnrolment,
          tmPaymentSuccessRes,
          additionalAttributes
        );
      })
      .then(purchase => {
        console.log(purchase);
        const resetToStatusScreen = () =>
          this.props.screenProps.rootNavigation.dispatch(
            redirectToStatus(currentUser)
          );
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
        console.log(err);
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "Chat",
              params: {
                policy: this.policy,
                questionSet: "buy",
                startScreen: false
              }
            })
          ]
        });
        const afterAlert = () => {
          this.props.screenProps.rootNavigation.dispatch(
            redirectToPolicyPurchase(this.policy, currentUser)
          );
        };
        if (
          err.message.indexOf("NRIC/FIN") !== -1 ||
          err.message.indexOf("exists") !== -1
        ) {
          showAlert(
            "Sorry, the current NRIC/FIN or Passport has already purchased a policy for this travel duration",
            afterAlert
          );
        } else {
          showAlert("Sorry, something went wrong", afterAlert);
        }
      });
  }

  handleCheckout(paymentForm: PaymentForm) {
    this.setState({ purchasing: true });
    const { form } = this.props.navigation.state.params;
    const idNumberTypeMap = { nric: 0, passport: 1 };
    const policyHolder = {
      Surname: form.lastName,
      GivenName: form.firstName,
      IDNumber: form.idNumber,
      IDNumberType: idNumberTypeMap[form.idNumberType],
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
    if (this.policy && this.policy.id === "travel") {
      const countryid = form.travelDestination;
      const startDate = form.departureDate;
      const endDate = form.returnDate;
      const planid = this.travelPlans[form.planIndex];
      const travellers = form.travellers;
      const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
        form.travellers
      );
      if (this.state.totalPremium) {
        promise = purchaseTravelPolicy(
          this.state.totalPremium,
          countryid,
          startDate,
          endDate,
          planid,
          travellers,
          policyHolder,
          paymentDetails
        );
      }
    } else if (
      this.policy &&
      (this.policy.id === "pa" ||
        this.policy.id === "pa_mr" ||
        this.policy.id === "pa_wi")
    ) {
      if (this.state.totalPremium) {
        const planid = this.paPlans[form.planIndex];
        const policytermid = this.paTerms[form.coverageDuration];
        const occupationid = form.occupation;
        const optionid = this.paOptions[this.policy.id];
        promise = purchaseAccidentPolicy(
          this.state.totalPremium,
          planid,
          policytermid,
          optionid,
          occupationid,
          policyHolder,
          paymentDetails
        );
      }
    } else if (this.policy && this.policy.id === "mobile") {
      if (this.state.totalPremium) {
        const policyCommencementDate = new Date();
        const mobileDetails = {
          brandID: form.brandID,
          modelID: form.modelID,
          purchaseDate: form.purchaseDate,
          serialNo: form.serialNo,
          purchasePlaceID: 4
        };
        promise = purchasePhonePolicy(
          this.state.totalPremium,
          policyCommencementDate,
          mobileDetails,
          policyHolder,
          paymentDetails
        );
      }
    }
    if (promise) {
      this.handlePurchaseResult(promise);
    }
  }

  renderField(key: string, value: any) {
    const label = this.fieldMapping[key]
      ? this.fieldMapping[key]
      : prettifyCamelCase(key);
    const isDate = moment.isDate(value);
    value = isDate ? moment(value).format("DD MMMM YYYY") : value;
    if (typeof value !== "string") return null;
    return (
      <View style={styles.field} key={key}>
        <Text style={styles.fieldKey}>{label}</Text>
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
