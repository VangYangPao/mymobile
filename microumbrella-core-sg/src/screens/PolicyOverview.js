// @flow
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import VectorDrawableView from "../components/VectorDrawableView";

import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import Page from "../components/Page";
import PolicyPrice from "../components/PolicyPrice";
import { Text } from "../components/defaultComponents";
import Constants from '../../constants';
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
    );
  }
}

class PolicyCoverages extends Component {
  render() {
    const coverageHighlights =
      this.props.coverageHighlights || this.props.covered.slice(0, 3);
    const coverageItems = coverageHighlights.map(item => (
      <CoverageItem
        key={item}
        navigation={this.props.navigation}
        covered={true}
        {...AppStore.coverages[item]}
      />
    ));

    return (
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>COVERAGE HIGHLIGHTS</Text>
        <View style={styles.coverage}>{coverageItems}</View>
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
        <Text style={styles.policyTitle}>{policy.title}</Text>
        <PolicyPrice
          pricePerMonth={pricePerMonth}
          showFrom={!policy.doNotRenderFromInSummary}
          showDuration={true}
          minimumCoverage={policy.from}
          coverUpto={policy.coverUpto}
        />
        <PolicyCoverages {...policy} />
      </Page>
    );
  }
}

const PRICE_CONTAINER_SIZE = 125;
const COVERAGE_CONTAINER_SIZE = 50;
const PRICE_DECIMAL_CONTAINER_SIZE = 20;

const styles = StyleSheet.create({
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
    width:Constants.BaseStyle.DEVICE_WIDTH/100*25,
    alignItems:'center',
    marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*.5
  },
  coverage: {
    flexDirection: "row",
    justifyContent:'center',
    flexWrap: 'wrap'
  },
  configTitle: {
    color: colors.primaryText,
    fontSize: 17,
    marginBottom: 20
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  }
});
