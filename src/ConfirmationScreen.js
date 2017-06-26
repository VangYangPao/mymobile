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
  Platform
} from "react-native";

import { Text } from "./defaultComponents";
import { prettifyCamelCase } from "./utils";
import Page from "./Page";
import Footer from "./Footer";
import PolicyPrice from "./PolicyPrice";
import CheckoutModal from "./CheckoutModal";

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  constructor(props) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.state = { renderCheckoutModal: false };
    const { form } = this.props.navigation.state.params;
    this.totalPremium = new Number(form.totalPremium);
    delete form.totalPremium;
  }

  handleCheckout() {
    if (Platform.OS === "ios") {
      Alert.alert("Thank you!", "Your order is complete.", [
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("MyPolicies")
        }
      ]);
    } else {
      ToastAndroid.show(
        "Thank you! Your order is complete.",
        ToastAndroid.LONG
      );
      this.props.navigation.navigate("MyPolicies");
    }
  }

  renderField(key, value) {
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
        onCheckout={this.handleCheckout}
        onClose={() => this.setState({ renderCheckoutModal: false })}
      />
    );
    return (
      <View style={styles.container}>
        {this.state.renderCheckoutModal ? modal : null}
        <View style={styles.pageContainer}>
          <Page>
            <Text style={styles.pageTitle}>Confirm your details</Text>
            <PolicyPrice pricePerMonth={this.totalPremium} />
            {formArr.map(f => this.renderField(f.key, f.value))}
          </Page>
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
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1
  }
});
