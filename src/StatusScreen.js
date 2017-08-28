import uuid from "uuid";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ListItem,
  TouchableOpacity
} from "react-native";

import POLICIES from "../data/policies";
import database from "./HackStorage";
import { getDateStr } from "./utils";
import { Text } from "./defaultComponents";
import colors from "./colors";

export default class StatusScreen extends Component {
  static navigationOptions = {
    title: "My Policies"
  };

  renderItem(section, { item, index }) {
    const dateStr = getDateStr(item.purchaseDate);

    const styleMap = {
      active: styles.policyStatusTextActive,
      expiring: styles.policyStatusTextExpiring,
      expired: styles.policyStatusTextRejected,
      approved: styles.policyStatusTextActive,
      pending: styles.policyStatusTextExpiring,
      rejected: styles.policyStatusTextRejected
    };

    const policy = POLICIES.find(p => p.id === item.policyType);

    return (
      <View style={styles.policy}>
        <View style={styles.policyContent}>
          <Text style={styles.policyName}>{policy.title}</Text>
          <Text style={styles.date}>Policy No: {item.key}</Text>
          <Text style={styles.date}>
            Purchased on: {dateStr}
          </Text>
          <Text style={styles.date}>
            {section === "policies" ? "Premium: " : "Claim amount: "}
            $
            {(section === "policies"
              ? item.premium.toFixed(2)
              : item.claimAmount) + ""}
          </Text>
        </View>
        <View style={styles.policyStatus}>
          <Text style={[styles.policyStatusText, styleMap[item.status]]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }

  renderSectionHeader({ section }) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  }

  render() {
    function padItemsWith(arr, prefix) {
      return arr.map(a => {
        return { key: prefix + a.id, ...a };
      });
    }
    return (
      <View style={styles.container}>
        <SectionList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            // homogenous rendering between sections
            {
              data: padItemsWith(database.policies, "PL"),
              title: "POLICIES",
              key: "policies",
              renderItem: (...params) => this.renderItem("policies", ...params)
            },
            {
              data: padItemsWith(database.claims, "PL"),
              title: "CLAIMS",
              key: "claims",
              renderItem: (...params) => this.renderItem("claims", ...params)
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  policyStatusText: { fontSize: 18, fontWeight: "400" },
  policyStatusTextActive: { color: "green" },
  policyStatusTextExpiring: { color: "#FFC107" },
  policyStatusTextRejected: { color: "red" },
  policyContent: {
    flex: 1
  },
  policyStatus: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  date: {
    marginTop: 5,
    fontSize: 15
  },
  policyName: {
    marginBottom: 15,
    fontSize: 18
  },
  separator: {
    borderBottomColor: colors.borderLine,
    borderBottomWidth: 1
  },
  policy: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 20
  },
  rejectedSectionHeader: {
    backgroundColor: "#D32F2F"
  },
  sectionHeader: {
    flex: 1,
    backgroundColor: colors.primaryOrange,
    padding: 15
  },
  sectionHeaderText: {
    color: "white",
    fontSize: 18
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
