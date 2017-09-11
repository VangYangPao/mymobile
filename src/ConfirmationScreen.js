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

import database from "./HackStorage";
import { Text } from "./defaultComponents";
import { prettifyCamelCase } from "./utils";
import Page from "./Page";
import Footer from "./Footer";
import PolicyPrice from "./PolicyPrice";
import CheckoutModal from "./CheckoutModal";
import { getTravelQuote } from "./hlas";
import { CONFIRMATION_PAGE_LOAD_TIME } from "react-native-dotenv";
const PAGE_LOAD_TIME = parseInt(CONFIRMATION_PAGE_LOAD_TIME, 10);

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  constructor(props) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.state = { renderCheckoutModal: false };
    const { form } = this.props.navigation.state.params;
    this.policy = form.policy;
    delete form.policy;
    this.state = {
      loading: true,
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
      let hasSpouse = false;
      let hasChildren = false;
      if (form.recipient === "spouse") {
        hasSpouse = true;
      } else if (form.recipient === "children") {
        hasChildren = true;
      } else if (form.recipient === "family") {
        hasSpouse = true;
        hasChildren = true;
      }
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

  handleCheckout() {
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
            this.state.loading ? styles.pageContainerLoading : null
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
