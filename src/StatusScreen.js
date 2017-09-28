// @flow
import moment from "moment";
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
import Parse from "parse/react-native";
import { NavigationActions } from "react-navigation";

import POLICIES from "../data/policies";
import database from "./HackStorage";
import { getDateStr, generateID } from "./utils";
import { Text } from "./defaultComponents";
import colors from "./colors";
import Button from "./Button";

type Section = { title: string, key: string };

export default class StatusScreen extends Component {
  static navigationOptions = {
    title: "My Policies"
  };

  state: {
    policiesLoaded: boolean,
    claimsLoaded: boolean,
    currentUser: any,
    policies: Array<any>,
    claims: Array<any>
  };
  renderSectionHeader: Function;

  constructor(props: any) {
    super(props);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.state = {
      policiesLoaded: false,
      claimsLoaded: false,
      currentUser: null,
      policies: [],
      claims: []
    };
  }

  componentDidMount() {
    const Purchase = Parse.Object.extend("Purchase");
    const Claim = Parse.Object.extend("Claim");
    let currentUser;
    Parse.User
      .currentAsync()
      .then(_currentUser => {
        currentUser = _currentUser;
        this.setState({ currentUser });
        const query = new Parse.Query(Purchase);
        query.equalTo("user", _currentUser);
        query.descending("createdAt");
        return query.find();
      })
      .then(policies => {
        policies.forEach((policy, idx) => {
          policies[idx].key = policies[idx].get("objectId");
        });
        console.log(policies);
        this.setState({ policies, policiesLoaded: true });
        const purchaseQuery = new Parse.Query(Purchase);
        purchaseQuery.equalTo("user", currentUser);
        const claimQuery = new Parse.Query(Claim);
        claimQuery.matchesQuery("purchase", purchaseQuery);
        claimQuery.descending("createdAt");
        return claimQuery.find();
      })
      .then(claims => {
        claims.forEach((policy, idx) => {
          claims[idx].key = claims[idx].get("objectId");
        });
        this.setState({ claims, claimsLoaded: true });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleSharePolicies() {
    const title = "Share my policies - microUmbrella";
    const code = generateID(6);
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

  renderItem(
    section: string,
    length: number,
    {
      item,
      index
    }: {
      section: Section,
      item: any,
      index: number
    }
  ) {
    const styleMap = {
      active: styles.policyStatusTextActive,
      expiring: styles.policyStatusTextExpiring,
      expired: styles.policyStatusTextRejected,
      approved: styles.policyStatusTextActive,
      pending: styles.policyStatusTextExpiring,
      rejected: styles.policyStatusTextRejected
    };

    const renderSharePolicy = section === "policies" && index === 0;

    const purchasedAt = item.get("createdAt");
    const dateStr = getDateStr(purchasedAt);

    let policyId;
    const policyTypeId = item.get("policyTypeId");
    let policyStatus = item.get("status");

    const policyMetadata = POLICIES.find(p => p.id === policyTypeId);
    const policyTypeTitle = policyMetadata.title;

    let amount;
    if (section === "policies") {
      const _amount = item.get("premium");
      policyId = item.get("policyId");
      amount = `Premium: ${_amount.toFixed(2)}`;
    } else if (section === "claims") {
      const _amount = item.get("claimAmount");
      policyId = item.get("purchase").get("policyId");
      if (!_amount) {
        policyStatus = "pending";
        amount = "";
      } else {
        amount = `Claim amount: ${_amount.toFixed(2)}`;
      }
    }
    return (
      <View key={index}>
        {renderSharePolicy ? (
          <TouchableOpacity
            onPress={this.handleSharePolicies.bind(this)}
            activeOpacity={0.7}
          >
            <View style={styles.shareContainer}>
              <Ionicon
                style={styles.shareIcon}
                name={Platform.select({ ios: "ios", android: "md" }) + "-share"}
                size={25}
              />
              <Text style={styles.shareText}>
                Share your policies with loved ones
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <View style={styles.policy}>
          <View style={styles.policyContent}>
            <Text style={styles.policyName}>{policyTypeTitle}</Text>
            <Text style={styles.date}>Policy No: {policyId}</Text>
            <Text style={styles.date}>Purchased on: {dateStr}</Text>
            <Text style={styles.date}>{amount}</Text>
          </View>
          <View style={styles.policyStatus}>
            <Text style={[styles.policyStatusText, styleMap[policyStatus]]}>
              {policyStatus && policyStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderSectionHeader({ section }: { section: Section }) {
    let emptySection;
    if (!section.data.length) {
      if (section.key === "policies") {
        if (!this.state.policiesLoaded) {
          emptySection = (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionTitle}>Loading policies...</Text>
            </View>
          );
        } else {
          const navigateToPurchaseAction = NavigationActions.navigate({
            routeName: "Chat",
            params: { questionSet: "buy" }
          });
          emptySection = (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionTitle}>
                You have not purchased any policies.
              </Text>
              <Button
                onPress={() =>
                  this.props.navigation.dispatch(navigateToPurchaseAction)}
              >
                PURCHASE NEW POLICY
              </Button>
            </View>
          );
        }
      } else if (section.key === "claims") {
        if (!this.state.policiesLoaded) {
          emptySection = (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionTitle}>Loading claims...</Text>
            </View>
          );
        } else {
          const { currentUser } = this.state;
          const navigateToClaimsAction = NavigationActions.navigate({
            routeName: "Chat",
            params: { startScreen: false, questionSet: "claim", currentUser }
          });
          emptySection = (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionTitle}>
                You have not purchased any policies.
              </Text>
              <Button
                onPress={() =>
                  this.props.navigation.dispatch(navigateToClaimsAction)}
              >
                MAKE A CLAIM
              </Button>
            </View>
          );
        }
      }
    }
    return (
      <View style={{ backgroundColor: "white" }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
        {!section.data.length ? emptySection : null}
      </View>
    );
  }

  render() {
    const itemSeparatorComponent = () => <View style={styles.separator} />;
    const { policies, claims } = this.state;
    return (
      <View style={styles.container}>
        <SectionList
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              data: policies,
              title: "POLICIES",
              key: "policies",
              renderItem: (...params) =>
                this.renderItem("policies", policies.length, ...params)
            },
            {
              data: claims,
              title: "CLAIMS",
              key: "claims",
              renderItem: (...params) =>
                this.renderItem("claims", claims.length, ...params)
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptySectionTitle: {
    marginBottom: 20,
    fontSize: 17,
    textAlign: "center"
  },
  emptySection: {
    padding: 17
  },
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
