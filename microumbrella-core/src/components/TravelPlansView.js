// @flow
import React, { Component } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  SectionList,
  StyleSheet,
  Platform
} from "react-native";
import { PlansTabNavigator } from "../components/chatWidgets";

import { Text } from "./defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
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
type TravelBenefits = { expanded: Array<Benefit>, unexpanded: Benefit };
const TRAVEL_BENEFITS: TravelBenefits = AppStore.data.travelBenefits;
const itemSeparatorComponent = () => <View style={styles.separator} />;
const patchCoverageWithKey = coverage => ({
  key: coverage.title,
  ...coverage
});

class TravelPlanTab extends Component {
  renderBenefit: Function;
  renderCoverage: Function;
  renderSection: Function;
  renderUnexpanded: Function;

  constructor(props) {
    super(props);
    this.renderCoverage = this.renderCoverage.bind(this);
    this.renderSection = this.renderSection.bind(this);
    this.renderUnexpanded = this.renderUnexpanded.bind(this);
    this.state = {
      expanded: false,
      fadeAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.timing(
      // Animate value over time
      this.state.fadeAnim, // The value to drive
      {
        duration: 1000,
        toValue: 1 // Animate to final value of 1
      }
    ).start();
  }

  renderCoverage({ item }) {
    const coverage: Coverage = item;
    const { plan } = this.props;
    let sections = null;
    let benefitPayable = null;
    // if (coverage.sections) {
    //   sections = (
    //     <View style={styles.sections}>
    //       {coverage.sections.map(this.renderSection)}
    //     </View>
    //   );
    // } else if (coverage.benefitPayable) {
    //   benefitPayable = this.renderBenefitPayable(coverage.benefitPayable, plan);
    // }
    // const coverageStyle = {
    //   padding: 15
    // };
    // const additionalStyle = coverage.sections ? {} : styles.section;
    // return (
    //   <View
    //     key={coverage.title}
    //     style={[coverageStyle, { justifyContent: "center" }]}
    //   >
    //     <Text style={styles.coverageTitle}>{coverage.title}</Text>
    //     {sections}
    //     {benefitPayable}
    //   </View>
    // );
    if (coverage.sections) {
      return (
        <View style={styles.sections}>
          <Text style={styles.coverageTitle}>{coverage.title}</Text>
          {coverage.sections.map(this.renderSection)}
        </View>
      );
    } else if (coverage.benefitPayable) {
      return (
        <View key={coverage.title} style={styles.coverage}>
          <Text style={{ color: colors.primaryText }}>{coverage.title}</Text>
          {this.renderBenefitPayable(coverage.benefitPayable, plan)}
        </View>
      );
    }
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
    const coverageAmt = benefitPayable[plan.legacyId];
    return (
      <Text style={styles.benefitPayable}>
        {AppStore.currency}
        {coverageAmt}
      </Text>
    );
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

  renderUnexpanded() {
    if (!AppStore.data.travelBenefits) {
      throw new Error("AppStore.data.travelBenefits is undefined");
    }
    const listSections = [
      AppStore.data.travelBenefits.unexpanded
    ].map(benefit => ({
      data: benefit.coverage.map(patchCoverageWithKey),
      title: benefit.title.toUpperCase(),
      key: benefit.title,
      renderItem: this.renderCoverage
    }));
    return (
      <Animated.View style={{ opacity: this.state.fadeAnim }}>
        <SectionList
          scrollEnabled={false}
          removeClippedSubviews={Platform.select({ ios: true, android: false })}
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={this.renderSectionHeader}
          sections={listSections}
        />
        {itemSeparatorComponent()}
        <TouchableOpacity onPress={this.props.onExpand}>
          <View>
            <Text style={styles.readMoreText}>Read more...</Text>
          </View>
        </TouchableOpacity>
        <Button
          accessibilityLabel={"chat__select-plan_" + this.props.plan.legacyId}
          onPress={() => this.props.onSelectPlan(this.props.planIndex)}
          style={styles.selectPlanButton}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500"
            }}
          >
            SELECT {this.props.plan.title.toUpperCase()}
          </Text>
        </Button>
      </Animated.View>
    );
  }

  render() {
    if (!this.props.expanded) {
      return this.renderUnexpanded();
    }
    const planId = this.props.plan.legacyId;
    if (AppStore.data.travelBenefits) {
      const listSections = AppStore.data.travelBenefits.expanded.map(
        benefit => ({
          data: benefit.coverage.map(patchCoverageWithKey),
          title: benefit.title.toUpperCase(),
          key: benefit.title,
          renderItem: this.renderCoverage
        })
      );
      return (
        <View>
          <SectionList
            scrollEnabled={false}
            removeClippedSubviews={false}
            ItemSeparatorComponent={itemSeparatorComponent}
            renderSectionHeader={this.renderSectionHeader}
            sections={listSections}
          />
          <Button
            accessibilityLabel={"chat__select-plan_" + planId}
            onPress={() => this.props.onSelectPlan(this.props.planIndex)}
            style={styles.selectPlanButton}
          >
            SELECT PLAN
          </Button>
        </View>
      );
    }
    return null;
  }
}

export default class TravelPlansView extends Component {
  state: { expanded: boolean };
  handleExpand: Function;

  constructor(props) {
    super(props);
    this.handleExpand = this.handleExpand.bind(this);
    this.state = { expanded: false };
  }

  handleExpand() {
    this.setState({ expanded: true });
  }

  render() {
    let tabRoutes = {};
    const travelPolicy = AppStore.policies.find(p => p.id === "travel");
    travelPolicy.plans.forEach((plan, idx) => {
      tabRoutes[plan.title] = {
        screen: () => (
          <TravelPlanTab
            plan={plan}
            onSelectPlan={this.props.onSelectPlan}
            onExpand={this.handleExpand}
            expanded={this.state.expanded}
            planIndex={idx}
          />
        )
      };
    });
    return <PlansTabNavigator tabRoutes={tabRoutes} />;
  }
}

const styles = StyleSheet.create({
  readMoreText: {
    margin: 15,
    color: colors.primaryAccent,
    fontSize: 17
  },
  selectPlanButton: {
    borderRadius: 0
  },
  sections: {
    marginVertical: 15
  },
  benefitPayable: {
    flex: 0.4,
    textAlign: "right",
    justifyContent: "center",
    alignItems: "center",
    color: colors.primaryText
  },
  coverage: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  section: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  coverageTitle: {
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 15,
    color: colors.primaryText,
    fontWeight: "bold"
  },
  separator: {
    borderBottomColor: colors.borderLine,
    borderBottomWidth: 1
  }
});
