import uuid from "uuid";
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button
} from "react-native";

import { Text } from "./defaultComponents";
import { prettifyCamelCase } from "./utils";
import Page from "./Page";
import Footer from "./Footer";
import PolicyPrice from "./PolicyPrice";

export default class ConfirmationScreen extends Component {
  static navigationOptions = {
    title: "Confirmation"
  };

  constructor(props) {
    super(props);
    this.state = { renderCheckoutModal: false };
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
    const { totalPremium } = form;
    delete form.totalPremium;
    let formArr = [];
    for (var key in form) {
      formArr.push({ key, value: form[key] });
    }
    return (
      <View style={styles.container}>
        <View style={styles.pageContainer}>
          <Page>
            <Text style={styles.pageTitle}>Confirm your details</Text>
            <PolicyPrice pricePerMonth={totalPremium} />
            {formArr.map(f => this.renderField(f.key, f.value))}
          </Page>
        </View>
        <Footer text="ENTER BILLING DETAILS" />
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
    fontSize: 23
  },
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1
  }
});
