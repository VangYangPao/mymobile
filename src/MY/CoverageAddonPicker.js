// @flow
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../microumbrella-core/src/components/Button";
import CheckBox from "react-native-check-box";
import colors from "./colors";
import type {
  PlanNameType,
  PlanDurationNameType,
  AdditionalCoverageType
} from "../../data/MY/pa-prices";
import {
  MEDICAL_REIMBURSEMENT_KEY,
  WEEKLY_BENEFIT_KEY,
  SNATCH_THEFT_KEY,
  coverageDescriptions
} from "../../data/MY/pa-prices";
import PA_PRICES from "../../data/MY/pa-prices";

type AdditionalCoveragesType = {
  [AdditionalCoverageType]: boolean
};

type CoverageAddonPickerProps = {
  chatScreen: Object,
  answers: {
    planIndex: PlanNameType,
    coverageDuration: PlanDurationNameType
  }
};

export default class CoverageAddonPicker extends Component {
  state: {
    coverages: AdditionalCoveragesType
  };
  handleSubmitCoverageAddon: AdditionalCoveragesType => void;
  renderCoverage: () => View;

  constructor(props: CoverageAddonPickerProps) {
    super(props);
    const coverages = {};
    coverages[MEDICAL_REIMBURSEMENT_KEY] = false;
    coverages[WEEKLY_BENEFIT_KEY] = false;
    coverages[SNATCH_THEFT_KEY] = false;
    this.state = {
      coverages
    };
    this.handleSubmitCoverageAddon = this.handleSubmitCoverageAddon.bind(this);
    this.renderCoverage = this.renderCoverage.bind(this);
  }

  handleSubmitCoverageAddon() {
    const { chatScreen } = this.props;
    let { messages } = chatScreen.state;
    messages = messages.slice(0, messages.length - 1);
    const message = chatScreen.createMessageObject({
      text: "These are the additional coverages I want.",
      value: this.state.coverages
      // multi: true
    });
    messages = messages.concat(message);
    chatScreen.setState({ messages }, () =>
      chatScreen.setState({ answering: false, renderInput: true })
    );
  }

  renderCoverage(coverageKey: AdditionalCoverageType) {
    const handlePress = () => {
      const coverages = Object.assign({}, this.state.coverages);
      coverages[coverageKey] = !coverages[coverageKey];
      this.setState({ coverages });
    };
    return (
      <View style={styles.coverageContainer}>
        <CheckBox
          style={styles.coverageCheckbox}
          onClick={handlePress}
          isChecked={this.state.coverages[coverageKey]}
          leftText={coverageDescriptions[coverageKey].name}
          leftTextStyle={styles.leftTextStyle}
          checkBoxColor={colors.primaryAccent}
        />
      </View>
    );
  }

  render() {
    const coverageRenderOrder = [
      MEDICAL_REIMBURSEMENT_KEY,
      WEEKLY_BENEFIT_KEY,
      SNATCH_THEFT_KEY
    ];
    return (
      <View style={styles.coverageAddonContainer}>
        <View style={styles.coveragesContainer}>
          {coverageRenderOrder.map(this.renderCoverage)}
        </View>
        <Button
          accessibilityLabel={"chat__select-plan_"}
          onPress={this.handleSubmitCoverageAddon}
          style={styles.selectCoverage}
        >
          SELECT PLAN
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  leftTextStyle: {
    color: colors.primaryText
  },
  coveragesContainer: {
    marginVertical: 5,
    paddingHorizontal: 7
  },
  coverageCheckbox: {
    flex: 1,
    padding: 10
  },
  coverageContainer: {
    paddingVertical: 5
  },
  coverageAddonContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 7,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#424242",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  selectCoverage: {
    borderRadius: 0
  }
});
