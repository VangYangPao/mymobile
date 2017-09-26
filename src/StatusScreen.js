// @flow
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

  state: { currentUser: any, policies: Array<any>, claims: Array<any> };
  renderSectionHeader: Function;

  constructor(props: any) {
    super(props);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.state = {
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
        return query.find();
      })
      .then(policies => {
        console.log(policies);
        this.setState({ policies });
        const query = new Parse.Query(Claim);
        query.equalTo("user", currentUser);
        return query.find();
      })
      .then(claims => {
        console.log(claims);
        this.setState({ claims });
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

  renderItem({
    section,
    item,
    index
  }: {
    section: Section,
    item: any,
    index: number
  }) {
    const dateStr = getDateStr(item.purchaseDate);

    const styleMap = {
      active: styles.policyStatusTextActive,
      expiring: styles.policyStatusTextExpiring,
      expired: styles.policyStatusTextRejected,
      approved: styles.policyStatusTextActive,
      pending: styles.policyStatusTextExpiring,
      rejected: styles.policyStatusTextRejected
    };
    const length = section.data.length;

    const renderSharePolicy = section === "policies" && index === length - 1;

    const policyId = item.get("policyId");
    const policyTypeId = item.get("policyTypeId");
    const purchasedAt = item.get("createdAt");
    const amount = item.get("premium");
    const policyStatus = item.get("status");

    const policyMetadata = POLICIES.find(p => p.id === policyTypeId);
    const policyTypeTitle = policyMetadata.title;

    return (
      <View>
        <View style={styles.policy}>
          <View style={styles.policyContent}>
            <Text style={styles.policyName}>{policyTypeTitle}</Text>
            <Text style={styles.date}>Policy No: {policyId}</Text>
            <Text style={styles.date}>Purchased on: {purchasedAt}</Text>
            <Text style={styles.date}>
              {section === "policies" ? "Premium: " : "Claim amount: "}
              $
              {(section === "policies" ? amount.toFixed(2) : amount) + ""}
            </Text>
          </View>
          <View style={styles.policyStatus}>
            <Text style={[styles.policyStatusText, styleMap[item.status]]}>
              {policyStatus.toUpperCase()}
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
                name={Platform.select({ ios: "ios", android: "md" }) + "-share"}
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

  renderSectionHeader({ section }: { section: Section }) {
    let emptySection;
    if (!section.data.length) {
      if (section.key === "policies") {
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
      } else if (section.key === "claims") {
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
    return (
      <View style={styles.container}>
        <SectionList
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              data: this.state.policies,
              title: "POLICIES",
              key: "policies",
              renderItem: this.renderItem
            },
            {
              data: this.state.claims,
              title: "CLAIMS",
              key: "claims",
              renderItem: this.renderItem
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
