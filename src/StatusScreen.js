import uuid from "uuid";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ListItem,
  TouchableOpacity
} from "react-native";

import { Text } from "./defaultComponents";
import colors from "./colors";

export default class StatusScreen extends Component {
  static navigationOptions = {
    title: "My Policy & Status"
  };

  renderItem({ item, index }) {
    const verbMap = {
      active: "Purchased",
      pending: "Claimed",
      rejected: "Rejected"
    };
    const day = item.date.getDate();
    const month = item.date.getMonth();
    const year = item.date.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    return (
      <View style={styles.policy}>
        <Text style={styles.policyName}>{item.name}</Text>
        <Text style={styles.date}>
          {verbMap[item.status]} on: {dateStr}
        </Text>
        {item.status !== "active"
          ? <Text style={styles.date}>
              Amount: ${item.claimAmount + ""}
            </Text>
          : null}
      </View>
    );
  }

  renderSectionHeader({ section }) {
    const headerMap = {
      active: "ACTIVE POLICIES",
      pending: "PENDING CLAIMS",
      rejected: "REJECTED/EXPIRED POLICIES"
    };
    const header = headerMap[section.key];
    const rejectedStyle = section.key === "rejected"
      ? styles.rejectedSectionHeader
      : null;
    return (
      <View style={[styles.sectionHeader, rejectedStyle]}>
        <Text style={styles.sectionHeaderText}>{header}</Text>
      </View>
    );
  }

  render() {
    const activePolicies = [
      {
        key: 1,
        status: "active",
        name: "Accidental Death / Permanent Disability",
        date: new Date(2017, 5, 26, 16, 43)
      },
      {
        key: 2,
        status: "active",
        name: "Accidental Death / Permanent Disability",
        date: new Date(2017, 5, 26, 16, 43)
      },
      {
        key: 3,
        status: "active",
        name:
          "Accidental Death / Permanent Disability with Medical Reimbursement",
        date: new Date(2017, 5, 26, 16, 43)
      }
    ];
    const pendingPolicies = [
      {
        key: 1,
        status: "pending",
        name: "Accidental Death / Permanent Disability",
        date: new Date(2017, 5, 26, 16, 43),
        claimAmount: 500
      }
    ];
    const rejectedPolicies = [
      {
        key: 1,
        status: "rejected",
        name: "Accidental Death / Permanent Disability",
        date: new Date(2017, 5, 26, 16, 43),
        claimAmount: 500
      }
    ];

    return (
      <View style={styles.container}>
        <SectionList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            // homogenous rendering between sections
            { data: activePolicies, key: "active" },
            { data: pendingPolicies, key: "pending" },
            { data: rejectedPolicies, key: "rejected" }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    marginTop: 5,
    fontSize: 15
  },
  policyName: {
    fontSize: 17
  },
  separator: {
    borderBottomColor: colors.borderLine,
    borderBottomWidth: 1
  },
  policy: {
    paddingHorizontal: 15,
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
