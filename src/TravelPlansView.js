// @flow
import React, { Component } from "react";
import { View, SectionList, StyleSheet } from "react-native";
import { PlansTabNavigator } from "./widgets";

import _TRAVEL_BENEFITS from "../data/travelBenefits";
import { Text } from "./defaultComponents";
import colors from "./colors";
import Button from "./Button";

type TravelPlans = "basic" | "enhanced" | "superior";
type BenefitPayable = { basic: string, enhanced: string, superior: string };
type Section = { title: string, benefitPayable: BenefitPayable };
type Coverage = {
  title: string,
  sections?: Array<Section>,
  benefitPayable?: BenefitPayable
};
type Benefit = { title: string, coverage: Array<Coverage> };
type TravelBenefits = Array<Benefit>;
const TRAVEL_BENEFITS: TravelBenefits = _TRAVEL_BENEFITS;

class TravelPlanTab extends Component {
  renderBenefit: Function;
  renderCoverage: Function;
  renderSection: Function;

  constructor(props) {
    super(props);
    this.renderCoverage = this.renderCoverage.bind(this);
    this.renderSection = this.renderSection.bind(this);
    this.state = {
      expanded: false
    };
  }

  renderCoverage({ item }) {
    const coverage: Coverage = item;
    const { plan } = this.props;
    let sections = null;
    let benefitPayable = null;
    if (coverage.sections) {
      sections = (
        <View style={styles.sections}>
          {coverage.sections.map(this.renderSection)}
        </View>
      );
    } else if (coverage.benefitPayable) {
      benefitPayable = this.renderBenefitPayable(coverage.benefitPayable, plan);
    }
    const coverageStyle = {
      padding: 15
    };
    const additionalStyle = coverage.sections
      ? {}
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        };
    return (
      <View key={coverage.title} style={[coverageStyle, additionalStyle]}>
        <Text style={styles.coverageTitle}>{coverage.title}</Text>
        {sections}
        {benefitPayable}
      </View>
    );
  }

  renderSection(section: Section) {
    const { plan } = this.props;
    return (
      <View key={section.title} style={styles.section}>
        <Text style={{ color: colors.primaryText }}>{section.title}</Text>
        {this.renderBenefitPayable(section.benefitPayable, plan)}
      </View>
    );
  }

  renderBenefitPayable(benefitPayable: BenefitPayable, plan: TravelPlans) {
    const coverageAmt = benefitPayable[plan];
    return <Text style={styles.benefitPayable}>{coverageAmt}</Text>;
  }

  renderSectionHeader({ section }) {
    return (
      <View
        style={{
          flex: 1,
          padding: 13,
          backgroundColor: colors.softBorderLine
        }}
      >
        <Text style={{ color: colors.primaryText, fontSize: 15 }}>
          {section.title}
        </Text>
      </View>
    );
  }

  render() {
    // if (!this.state.expanded) {
    //   return (
    //     <View>
    //       <Text>Not expanded</Text>
    //     </View>
    //   );
    // }

    const itemSeparatorComponent = () => <View style={styles.separator} />;
    const patchCoverageWithKey = coverage => ({
      key: coverage.title,
      ...coverage
    });
    const listSections = TRAVEL_BENEFITS.map(benefit => ({
      data: benefit.coverage.map(patchCoverageWithKey),
      title: benefit.title.toUpperCase(),
      key: benefit.title,
      renderItem: this.renderCoverage
    }));
    return (
      <View>
        <SectionList
          removeClippedSubviews={false}
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={this.renderSectionHeader}
          sections={listSections}
        />
        <Button
          onPress={() => this.props.onSelectPlan(this.props.planIndex)}
          style={styles.selectPlanButton}
        >
          SELECT PLAN
        </Button>
      </View>
    );
  }
}

export default class TravelPlansView extends Component {
  render() {
    const tabRoutes = {
      "Basic\nPlan": {
        screen: () => (
          <TravelPlanTab
            plan="basic"
            onSelectPlan={this.props.onSelectPlan}
            planIndex={0}
          />
        )
      },
      "Enhanced\nPlan": {
        screen: () => (
          <TravelPlanTab
            plan="enhanced"
            onSelectPlan={this.props.onSelectPlan}
            planIndex={1}
          />
        )
      },
      "Superior\nPlan": {
        screen: () => (
          <TravelPlanTab
            plan="superior"
            onSelectPlan={this.props.onSelectPlan}
            planIndex={2}
          />
        )
      }
    };
    return <PlansTabNavigator tabRoutes={tabRoutes} />;
  }
}

const styles = StyleSheet.create({
  selectPlanButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  sections: {
    marginTop: 10
  },
  benefitPayable: {
    flex: 0.4,
    textAlign: "right",
    justifyContent: "center",
    alignItems: "center",
    color: colors.primaryText
  },
  section: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  coverageTitle: {
    color: colors.primaryText,
    fontSize: 15
  },
  separator: {
    borderBottomColor: colors.borderLine,
    borderBottomWidth: 1
  }
});
