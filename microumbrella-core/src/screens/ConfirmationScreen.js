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
import promiseRetry from "promise-retry";
import { Crashlytics } from "react-native-fabric";

import AppStore from "../../stores/AppStore";
import type { PolicyHolder, PaymentDetails, MUTraveller } from "../types/hlas";
import { Text } from "../components/defaultComponents";
import { showAlert, prettifyCamelCase } from "../utils";
import Page from "../components/Page";
import Footer from "../components/Footer";
import PolicyPrice from "../components/PolicyPrice";
import { extractPaRes } from "../utils";
import MAPPING from "../../data/mappings";
import {
  purchaseTravelPolicy,
  purchaseAccidentPolicy,
  purchasePhonePolicy
} from "../models/hlas";
import { saveNewPurchase } from "../parse/purchase";
import { CONFIRMATION_PAGE_LOAD_TIME } from "react-native-dotenv";
const PAGE_LOAD_TIME = parseInt(CONFIRMATION_PAGE_LOAD_TIME, 10);
import type { PolicyType } from "../../../types";

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
  totalPremium: ?number,
  acsRedirectionHTML: ?string
};

const redirectToStatus = currentUser =>
  NavigationActions.reset({
    key: null,
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "Drawer",
        action: NavigationActions.navigate({
          routeName: "MyPolicies",
          params: {
            currentUser
          }
        })
      })
    ]
  });

const redirectToPolicyPurchase = (props, policy, currentUser) => {
  const { chatScreenState } = props.navigation.state.params;
  return NavigationActions.reset({
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
          chatScreenState,
          questionSet: "buy",
          isStartScreen: false
        }
      })
    ]
  });
};

const RETRY_OPTIONS = {
  retries: 5,
  factor: 2,
  minTimeout: 1000
};

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  state: State;
  paOptions: { pa: number, pa_mr: number, pa_wi: number };
  paTerms: { "1": 1, "3": 2, "6": 3, "12": 4 };
  policy: any;
  handleCheckout: Function;
  handlePurchaseResult: Function;
  handleACSRedirection: Function;
  fieldMapping: { [string]: string };

  constructor(props: {
    navigation: any,
    totalPremium: ?number,
    screenProps: any
  }) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handlePurchaseResult = this.handlePurchaseResult.bind(this);
    this.handleACSRedirection = this.handleACSRedirection.bind(this);
    // this.handleACSResult = this.handleACSResult.bind(this);
    this.renderField = this.renderField.bind(this);
    const { form } = this.props.navigation.state.params;
    this.policy = form.policy;
    delete form.policy;
    this.state = {
      renderCheckoutModal: false,
      loading: true,
      purchasing: false,
      totalPremium: null,
      acsRedirectionHTML: null
    };
  }

  componentWillMount() {
    // load at least 2 seconds
    setTimeout(() => this.setState({ loading: false }), PAGE_LOAD_TIME);
  }

  componentDidMount() {
    const { form } = this.props.navigation.state.params;

    const promise = AppStore.controllers.getProductQuote(this.policy, form);

    // promiseRetry((retry: Function, number: number) => {
    //   if (promise) {
    //     return promise.catch(retry);
    //   }
    // }, RETRY_OPTIONS)
    promise
      .then(totalPremium => {
        this.setState({ totalPremium });
      })
      .catch(err => {
        console.error(err);
        Crashlytics.logException(err.message + ": " + err.stack);
        Crashlytics.recordError(err.message + ": " + err.stack);

        const { currentUser } = this.props.navigation.state.params;

        this.props.screenProps.rootNavigation.dispatch(
          redirectToPolicyPurchase(this.props, this.policy, currentUser)
        );
      });
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

  handleACSRedirection(acsRedirectionHTML: string) {
    return extractPaRes(acsRedirectionHTML);
    // this.setState({ renderCheckoutModal: false, purchasing: false });
    // this.props.navigation.navigate("ACS", {
    //   acsRedirectionHTML,
    //   handleACSResult: this.handleACSResult
    // });
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
        Crashlytics.logException(err.message + ": " + err.stack);
        Crashlytics.recordError(err.message + ": " + err.stack);

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
            redirectToPolicyPurchase(this.props, this.policy, currentUser)
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
          showAlert("Sorry, something went wrong ", afterAlert);
        }
      });
  }

  handleCheckout(policy: PolicyType, premium: number, form: Object) {
    return (paymentForm: Object) => {
      // this.setState({ purchasing: true });
      AppStore.controllers.purchaseProduct(
        this.policy,
        this.state.totalPremium,
        form,
        paymentForm
      );
    };
  }

  // handleCheckout(paymentForm: PaymentForm) {
  //   this.setState({ purchasing: true });
  //   const idNumberTypeMap = { nric: 0, passport: 1 };
  //   const policyHolder = {
  //     Surname: form.lastName,
  //     GivenName: form.firstName,
  //     IDNumber: form.idNumber,
  //     IDNumberType: idNumberTypeMap[form.idNumberType],
  //     DateOfBirth: "1988-07-22",
  //     GenderID: 1,
  //     MobileTelephone: "91234567",
  //     Email: form.email,
  //     UnitNumber: "11",
  //     BlockHouseNumber: "11",
  //     BuildingName: "sample string 12",
  //     StreetName: "sample string 13",
  //     PostalCode: "089057"
  //   };
  //   const cardTypes = { "master-card": 2, visa: 3 };
  //   const NameOnCard = paymentForm.name;
  //   const CardNumber = paymentForm.number.replace(/ /g, "");
  //   const CardType = cardTypes[paymentForm.type];
  //   const CardSecurityCode = paymentForm.cvc;
  //   let [CardExpiryMonth, CardExpiryYear] = paymentForm.expiry.split("/");
  //   CardExpiryMonth = parseInt(CardExpiryMonth, 10);
  //   CardExpiryYear = 2000 + parseInt(CardExpiryYear, 10);
  //   const paymentDetails: PaymentDetails = {
  //     NameOnCard,
  //     CardNumber,
  //     CardType,
  //     CardSecurityCode,
  //     CardExpiryYear,
  //     CardExpiryMonth
  //   };
  //   let promise;
  //   if (this.policy && this.policy.id === "travel") {
  //     const countryid = form.travelDestination;
  //     const startDate = form.departureDate;
  //     const endDate = form.returnDate;
  //     const planid = form.planIndex;
  //     const travellers = form.travellers;
  //     const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
  //       form.travellers
  //     );
  //     if (this.state.totalPremium) {
  //       promise = purchaseTravelPolicy(
  //         this.state.totalPremium,
  //         countryid,
  //         startDate,
  //         endDate,
  //         planid,
  //         travellers,
  //         policyHolder,
  //         paymentDetails,
  //         extractPaRes
  //         // this.handleACSRedirection
  //       );
  //     }
  //   } else if (
  //     this.policy &&
  //     (this.policy.id === "pa" ||
  //       this.policy.id === "pa_mr" ||
  //       this.policy.id === "pa_wi")
  //   ) {
  //     if (this.state.totalPremium) {
  //       const planid = form.planIndex;
  //       const policytermid = MAPPING.paTerms[form.coverageDuration];
  //       const occupationid = form.occupation;
  //       const optionid = MAPPING.paOptions[this.policy.id];
  //       promise = purchaseAccidentPolicy(
  //         this.state.totalPremium,
  //         planid,
  //         policytermid,
  //         optionid,
  //         occupationid,
  //         policyHolder,
  //         paymentDetails,
  //         extractPaRes
  //         // this.handleACSRedirection
  //       );
  //     }
  //   } else if (this.policy && this.policy.id === "mobile") {
  //     if (this.state.totalPremium) {
  //       const policyCommencementDate = new Date();
  //       const mobileDetails = {
  //         brandID: form.brandID,
  //         modelID: form.modelID,
  //         purchaseDate: form.purchaseDate,
  //         serialNo: form.serialNo,
  //         purchasePlaceID: 4
  //       };
  //       promise = purchasePhonePolicy(
  //         this.state.totalPremium,
  //         policyCommencementDate,
  //         mobileDetails,
  //         policyHolder,
  //         paymentDetails,
  //         extractPaRes
  //         // this.handleACSRedirection
  //       );
  //     }
  //   }
  //   if (promise) {
  //     this.handlePurchaseResult(promise);
  //   }
  // }

  renderField(key: string, value: any) {
    const label = MAPPING.fieldMapping[key]
      ? MAPPING.fieldMapping[key]
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
      <AppStore.screens.CheckoutModal
        price={this.state.totalPremium}
        purchasing={this.state.purchasing}
        onCheckout={this.handleCheckout(
          this.policy,
          this.state.totalPremium,
          form
        )}
        onClose={() => this.setState({ renderCheckoutModal: false })}
      />
    );
    let pageContent;
    if (!this.state.loading && typeof this.state.totalPremium === "number") {
      pageContent = (
        <Page>
          <Text style={styles.pageTitle}>Confirm your details</Text>
          {this.state.totalPremium ? (
            <PolicyPrice pricePerMonth={this.state.totalPremium} />
          ) : null}
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
          onPress={() => {
            if (
              !this.state.loading &&
              typeof this.state.totalPremium === "number"
            ) {
              this.setState({ renderCheckoutModal: true });
            }
          }}
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
