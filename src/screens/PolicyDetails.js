// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  InteractionManager
} from "react-native";
import Parse from "parse/react-native";

import { Text } from "../components/defaultComponents";
import Page from "../components/Page";
import PolicyPrice from "../components/PolicyPrice";
import { getDateStr } from "../utils";
import Button from "../components/Button";
import colors from "../styles/colors";
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
    this.renderDetailRow = this.renderDetailRow.bind(this);
    this.state = {
      loadingSubPurchase: true,
      subPurchase: null,
      loadingCancel: false,
      loadingUpdate: false
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
      this.setState({ loadingUpdate: true });
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
          this.setState({ loadingUpdate: false });
          // navigation.goBack();
        })
        .catch(err => {
          this.setState({ loadingUpdate: false });
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
    this.setState({ loadingCancel: true });
    const { policy: purchase } = this.props.navigation.state.params;
    purchase.set("cancelled", true);
    purchase.save().then(() => {
      this.setState({ loadingCancel: false });
      this.props.navigation.goBack();
    });
  }

  renderDetailRow(row: { label: string, value: any }) {
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
        {this.state.loadingCancel ? (
          <OverlayModal loadingText="Cancelling policy..." />
        ) : null}
        {this.state.loadingUpdate ? (
          <OverlayModal loadingText="Updating policy..." />
        ) : null}
        <Text style={styles.policyTitle}>{policyMetadata.title}</Text>
        <PolicyPrice
          pricePerMonth={5.0}
          showDuration={true}
          minimumCoverage={"per\nmonth"}
        />
        <View>{rows.map(this.renderDetailRow)}</View>
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
