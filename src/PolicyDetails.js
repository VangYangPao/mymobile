import React, { Component } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "./defaultComponents";
import Page from "./Page";
import PolicyPrice from "./PolicyPrice";
import { getDateStr } from "./utils";
import Button from "./Button";
import colors from "./colors";
import POLICIES from "../data/policies";

export default class PolicyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { policy } = navigation.state.params;
    const policyId = policy.get("policyId");
    return {
      title: `Policy ${policyId}`
    };
  };

  constructor(props) {
    super(props);
    this.handleUpdatePolicy = this.handleUpdatePolicy.bind(this);
    this.handleCancelPolicy = this.handleCancelPolicy.bind(this);
    this.renderDetailRow = this.renderDetailRow.bind(this);
  }

  handleUpdatePolicy() {
    this.props.navigation.navigate("Table", {
      title: "Update Policy",
      columns: [],
      onSaveTable: () => {}
    });
    console.log("pass");
  }

  handleCancelPolicy() {
    this.props.navigation.goBack();
  }

  renderDetailRow(row) {
    return (
      <View key={row.value} style={styles.detailRow}>
        <Text style={styles.detailText}>{row.label}</Text>
        <Text style={styles.detailText}>{row.value}</Text>
      </View>
    );
  }

  render() {
    const { policy, policyMetadata } = this.props.navigation.state.params;
    const policyName = policyMetadata.title;

    const handlePressCancel = () =>
      Alert.alert(
        "Are You Sure?",
        `This will cancel your ${policyName} policy.`,
        [
          {
            text: "Yes",
            style: "destructive",
            onPress: this.handleCancelPolicy
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {}
          }
        ],
        { cancelable: false }
      );

    const user = policy.get("user");
    const firstName = user.get("firstName");
    const lastName = user.get("lastName");
    const fullName = `${firstName} ${lastName}`;
    const rows = [
      { label: "Policy no.", value: policy.get("policyId") },
      { label: "Policyholder name", value: fullName },
      { label: "Purchase date", value: getDateStr(policy.get("createdAt")) }
    ];
    return (
      <Page>
        <Text style={styles.policyTitle}>{policyMetadata.title}</Text>
        <PolicyPrice
          pricePerMonth={5.0}
          showDuration={true}
          minimumCoverage={"per\nmonth"}
        />
        <View>{rows.map(this.renderDetailRow)}</View>
        <TouchableOpacity
          onPress={this.handleUpdatePolicy}
          style={[styles.button, styles.updateButton]}
        >
          <Text style={styles.updateButtonText}>UPDATE POLICY DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePressCancel}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.cancelButtonText}>CANCEL POLICY</Text>
        </TouchableOpacity>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  policyTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontFamily: "Bitter",
    fontSize: 20,
    textAlign: "center"
  },
  cancelButtonText: {
    fontSize: 17,
    color: colors.errorRed
  },
  updateButtonText: {
    fontSize: 17,
    color: colors.tertiaryGreen
  },
  button: {
    borderWidth: 1.5,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 7,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  updateButton: {
    marginTop: 40,
    borderColor: colors.tertiaryGreen
  },
  cancelButton: {
    borderColor: colors.errorRed
  },
  detailLabel: {
    color: "black",
    fontWeight: "600"
  },
  detailText: {
    flex: 1,
    fontSize: 16
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10
  }
});
