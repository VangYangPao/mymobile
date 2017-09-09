import uuid from "uuid";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ListItem,
  TouchableOpacity,
  Platform,
  Share
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

import POLICIES from "../data/policies";
import database from "./HackStorage";
import { getDateStr, generateID } from "./utils";
import { Text } from "./defaultComponents";
import colors from "./colors";

export default class StatusScreen extends Component {
  static navigationOptions = {
    title: "My Policies"
  };

  handleSharePolicies() {
    const title = "Share my policies - microUmbrella";
    const code = generateID();
    const url = `https://microumbrella.com/share/${code}`;
    Share.share(
      {
        message: `I have enjoyed microUmbrella's service and would like to share my Policy Information with you for safekeeping. To accept, use this code: ${code} or click ${url}.`,
        url,
        title
      },
      { tintColor: colors.primaryOrange, dialogTitle: title }
    );
  }

  renderItem(section, length, { item, index }) {
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
    const renderSharePolicy = section === "policies" && index === length - 1;

    return (
      <View>
        <View style={styles.policy}>
          <View style={styles.policyContent}>
            <Text style={styles.policyName}>{policy.title}</Text>
            <Text style={styles.date}>Policy No: {item.key}</Text>
            <Text style={styles.date}>Purchased on: {dateStr}</Text>
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
        {renderSharePolicy ? (
          <TouchableOpacity
            onPress={this.handleSharePolicies.bind(this)}
            activeOpacity={0.7}
          >
            <View style={styles.shareContainer}>
              <Ionicon
                style={styles.shareIcon}
                name={
                  Platform.select({ ios: "ios", android: "android" }) + "-share"
                }
                size={25}
              />
              <Text style={styles.shareText}>
                Share your policies with loved ones
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
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
    const itemSeparatorComponent = () => <View style={styles.separator} />;
    return (
      <View style={styles.container}>
        <SectionList
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              data: padItemsWith(database.policies, "PL"),
              title: "POLICIES",
              key: "policies",
              renderItem: (...params) =>
                this.renderItem("policies", database.policies.length, ...params)
            },
            {
              data: padItemsWith(database.claims, "PL"),
              title: "CLAIMS",
              key: "claims",
              renderItem: (...params) =>
                this.renderItem("claims", database.claims.length, ...params)
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shareIcon: {
    marginRight: 15,
    color: "white"
  },
  shareText: {
    color: "white",
    fontSize: 18
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryOrange
  },
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
    backgroundColor: colors.softBorderLine,
    padding: 15
  },
  sectionHeaderText: {
    color: colors.primaryText,
    fontSize: 18
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
