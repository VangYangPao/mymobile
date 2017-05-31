import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import VectorDrawableView from "react-native-vectordrawable-android";

import Page from "./Page";
import PolicyPrice from "./PolicyPrice";
import RangeSlider from "./RangeSlider";
import { Text } from "./defaultComponents";
import colors from "./colors";
import coveragesData from "../data/coverage";

class CoverageItem extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const screenName = this.props.covered ? "Covered" : "NotCovered";
    this.props.navigation.navigate(screenName, {
      coverageTitle: this.props.title
    });
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.coverageBtn}
        activeOpacity={0.5}
        onPress={this.handlePress}
      >
        <View style={styles.coverageItem}>
          <View
            style={[
              styles.coverageIconContainer,
              !this.props.covered ? styles.notCovered : null
            ]}
          >
            <VectorDrawableView
              resourceName={this.props.icon}
              style={styles.coverageIcon}
            />
          </View>
          <Text style={styles.coverageTitle}>
            {this.props.shortTitle || this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class PolicyCoverages extends Component {
  render() {
    return (
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>COVERAGE HIGHLIGHTS</Text>
        <Text style={styles.configSubtitle}>
          CLICK ICONS FOR MORE DETAILS
        </Text>
        <View style={styles.coverage}>
          {this.props.covered
            .slice(0, 3)
            .map(item => (
              <CoverageItem
                key={item}
                navigation={this.props.navigation}
                covered={true}
                {...coveragesData[item]}
              />
            ))}
          {this.props.notCovered
            .slice(0, 2)
            .map(item => (
              <CoverageItem
                key={item}
                navigation={this.props.navigation}
                covered={false}
                {...coveragesData[item]}
              />
            ))}
        </View>
      </View>
    );
  }
}

export default class PolicyOverview extends Component {
  render() {
    const { policy } = this.props.screenProps;
    const showPerMonth = policy.title !== "Travel Protection";
    const pricePerMonth = policy.plans[0].premium;
    return (
      <Page>
        <Text style={styles.policyTitle}>
          {policy.title}
        </Text>
        <PolicyPrice
          pricePerMonth={pricePerMonth}
          showFrom={true}
          showPerMonth={showPerMonth}
        />
        <PolicyCoverages navigation={this.props.navigation} {...policy} />
      </Page>
    );
  }
}

const PRICE_CONTAINER_SIZE = 125;
const COVERAGE_CONTAINER_SIZE = 50;
const PRICE_DECIMAL_CONTAINER_SIZE = 20;

const styles = StyleSheet.create({
  coverageBtn: {
    flex: 0.25
  },
  notCovered: {
    opacity: 0.3
  },
  coverageTitle: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12
  },
  coverageIcon: {
    height: COVERAGE_CONTAINER_SIZE,
    width: COVERAGE_CONTAINER_SIZE
  },
  coverageIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: COVERAGE_CONTAINER_SIZE,
    width: COVERAGE_CONTAINER_SIZE,
    borderRadius: COVERAGE_CONTAINER_SIZE / 2,
    backgroundColor: "#F5F5F5"
  },
  coverageItem: {
    alignItems: "center"
  },
  coverage: {
    flexDirection: "row"
  },
  configTitle: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: "500"
  },
  configSubtitle: {
    fontSize: 13,
    marginBottom: 10
  },
  configContainer: {
    flex: 1,
    alignItems: "center"
  },
  dropdownDefault: {
    justifyContent: "center",
    fontSize: 16,
    color: colors.primaryText
  },
  startDateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
    paddingBottom: 15,
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1.5
  },
  policyTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontFamily: "Bitter",
    fontSize: 20,
    textAlign: "center"
  }
});
