// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  InteractionManager,
  Switch
} from "react-native";
import Parse from "parse/react-native";

import { Text } from "../components/defaultComponents";
import Page from "../components/Page";
import PolicyPrice from "../components/PolicyPrice";
import { getDateStr } from "../utils";
import Button from "../components/Button";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import OverlayModal from "../components/OverlayModal";

export default class PolicyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { policy } = navigation.state.params;
    const policyId = policy.get("policyId");
    return {
      title: `Policy ${policyId}`
    };
  };

  props: {
    navigation: any
  };
  state: {
    loadingSubPurchase: boolean,
    subPurchase: any,
    loadingCancel: boolean,
    loadingUpdate: boolean
  };
  handleUpdatePolicy: Function;
  handleCancelPolicy: Function;
  handleSaveUpdates: Function;
  renderDetailRow: Function;

  constructor(props: { navigation: any, policy: any, policyMetadata: any }) {
    super(props);
    this.handleUpdatePolicy = this.handleUpdatePolicy.bind(this);
    this.handleCancelPolicy = this.handleCancelPolicy.bind(this);
    this.handleSaveUpdates = this.handleSaveUpdates.bind(this);
    this.handleRenewChange = this.handleRenewChange.bind(this);
    this.renderDetailRow = this.renderDetailRow.bind(this);
    this.state = {
      loadingText: null,
      subPurchase: null,
      renewValue: false
    };
  }

  componentDidMount() {
    const {
      policy: purchase,
      policyMetadata
    } = this.props.navigation.state.params;
    InteractionManager.runAfterInteractions(() => {
      const Class = Parse.Object.extend(policyMetadata.subclassName);
      const query = new Parse.Query(Class);
      query.equalTo("purchaseId", purchase);
      query.first().then(subPurchase => {
        this.setState({ loadingSubPurchase: false, subPurchase });
      });
    });
  }

  handleSaveUpdates(navigation: any, values: Array<any>) {
    navigation.goBack();
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loadingText: "Updating policy details..." });
      const { policyMetadata } = this.props.navigation.state.params;
      const { subPurchase } = this.state;
      let { endorsementFields } = policyMetadata;
      endorsementFields.forEach((field, idx) => {
        const key = endorsementFields[idx].id;
        const value = values[idx];
        if (subPurchase.get(key) === value) {
          return;
        }
        subPurchase.set(key, value);
      });
      subPurchase
        .save()
        .then(() => {
          this.setState({ loadingText: null });
          // navigation.goBack();
        })
        .catch(err => {
          this.setState({ loadingText: null });
          console.error(err);
        });
    });
  }

  handleUpdatePolicy() {
    const {
      policy: purchase,
      policyMetadata
    } = this.props.navigation.state.params;
    let { endorsementFields } = policyMetadata;
    endorsementFields.forEach((field, idx) => {
      const { id } = endorsementFields[idx];
      const value = this.state.subPurchase.get(id);
      if (value) {
        endorsementFields[idx].value = value;
      }
    });
    this.props.navigation.navigate("Table", {
      title: "Update Policy",
      columns: endorsementFields,
      onSaveTable: this.handleSaveUpdates
    });
  }

  handleCancelPolicy() {
    this.setState({ loadingText: "Cancelling policy..." });
    const { policy: purchase } = this.props.navigation.state.params;
    purchase.set("cancelled", true);
    purchase.save().then(() => {
      this.setState({ loadingText: null });
      this.props.navigation.goBack();
    });
  }

  handleRenewChange(renewValue) {
    this.setState({ renewValue, loadingText: "Updating policy detail..." });
    const { policy: purchase } = this.props.navigation.state.params;
    purchase.set("autoRenew", renewValue);
    purchase
      .save()
      .then(() => {
        this.setState({ loadingText: null });
      })
      .catch(err => {
        this.setState({ renewValue: !renewValue, loadingText: null });
      });
  }

  renderDetailRow(row: { label: string, value: any }) {
    return (
      <View key={row.value} style={styles.detailRow}>
        <Text style={styles.detailLabel}>{row.label}</Text>
        <Text style={styles.detailValue}>{row.value}</Text>
      </View>
    );
  }

  render() {
    const { policy, policyMetadata } = this.props.navigation.state.params;
    const policyName = policyMetadata.title;
    const { endorsementFields } = policyMetadata;

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
            text: "No",
            style: "cancel",
            onPress: () => {}
          }
        ],
        { cancelable: false }
      );

    const user = policy.get("user");
    const autoRenew = policy.get("autoRenew");
    const policyPrice = policy.get("premium");
    const firstName = user.get("firstName");
    const lastName = user.get("lastName");
    const fullName = `${firstName} ${lastName}`;
    const rows = [
      { label: "Policy no.", value: policy.get("policyId") },
      { label: "Policyholder name", value: fullName },
      { label: "Purchase date", value: getDateStr(policy.get("createdAt")) }
    ];
    let bottomContent;
    if (this.state.loadingSubPurchase) {
      bottomContent = (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="black"
        />
      );
    } else {
      bottomContent = (
        <View>
          {endorsementFields.length ? (
            <TouchableOpacity
              onPress={this.handleUpdatePolicy}
              style={[styles.button, styles.updateButton]}
            >
              <Text style={styles.updateButtonText}>UPDATE POLICY DETAILS</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={handlePressCancel}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>CANCEL POLICY</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <Page>
        {this.state.loadingText ? (
          <OverlayModal loadingText={this.state.loadingText} />
        ) : null}
        <Text style={styles.policyTitle}>{policyMetadata.title}</Text>
        <PolicyPrice
          pricePerMonth={policyPrice}
          minimumCoverage={"per\nmonth"}
        />
        <View>{rows.map(this.renderDetailRow)}</View>
        {policyMetadata.renewable ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Auto renew policy</Text>
            <Switch
              onValueChange={this.handleRenewChange}
              value={this.state.renewValue}
            />
          </View>
        ) : null}
        {bottomContent}
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  loadingIndicator: {
    marginTop: 20
  },
  policyTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  },
  cancelButtonText: {
    fontSize: 17,
    color: colors.errorRed
  },
  updateButtonText: {
    fontSize: 17,
    color: colors.secondaryAccent
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
    borderColor: colors.secondaryAccent
  },
  cancelButton: {
    borderColor: colors.errorRed
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold"
  },
  detailValue: {
    fontSize: 16,
    textAlign: "right"
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10
  }
});
