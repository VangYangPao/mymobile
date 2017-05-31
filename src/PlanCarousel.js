import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import Carousel from "react-native-snap-carousel";

import PolicyPrice from "./PolicyPrice";
import { addCommas } from "./utils";
import POLICIES from "../data/policies";
import COVERAGES from "../data/coverage";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}

const slideWidth = wp(50);
const itemHorizontalMargin = wp(1);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class PlanCarousel extends Component {
  constructor(props) {
    super(props);
    this.renderPlan = this.renderPlan.bind(this);
    this.renderCoverages = this.renderCoverages.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan(planIndex) {
    return () => {
      if (typeof this.props.onSelectPlan === "function") {
        this.props.onSelectPlan(planIndex);
      }
    };
  }

  renderCoverages(plan) {
    var coverages = [];
    var coverage, coverageView;
    for (var coverageKey in plan) {
      if (coverageKey === "premium") continue;
      coverage = COVERAGES[coverageKey];
      const coverageAmount = addCommas(plan[coverageKey]);
      coverageView = (
        <View style={styles.coverage} key={coverageKey}>
          <Text style={styles.coverageAmount}>${coverageAmount}</Text>
          <Text style={styles.coverageTitle}>
            {coverage.shortTitle || coverage.title}
          </Text>
        </View>
      );
      coverages.push(coverageView);
    }
    return coverages;
  }

  getPlanTitle(index) {
    const planAlphabets = ["A", "B", "C", "D", "E"];
    return "Plan " + planAlphabets[index];
  }

  renderPlan(plan, index) {
    const renderCoverages = typeof this.props.renderCoverages === "function"
      ? this.props.renderCoverages
      : this.renderCoverages;
    const getPlanTitle = typeof this.props.getPlanTitle === "function"
      ? this.props.getPlanTitle
      : this.getPlanTitle;
    return (
      <TouchableOpacity
        onPress={this.handleSelectPlan(index)}
        activeOpacity={0.6}
        key={index}
      >
        <View style={styles.plan}>
          <Text style={styles.planTitle}>{getPlanTitle(index)}</Text>
          <PolicyPrice pricePerMonth={plan.premium} />
          {renderCoverages(plan)}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Carousel
        ref={carousel => {
          this._carousel = carousel;
        }}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        firstItem={0}
        enableMomentum={false}
        containerCustomStyle={styles.carousel}
        inactiveSlideOpacity={0.7}
      >
        {this.props.plans.map(this.renderPlan)}
      </Carousel>
    );
  }
}

const styles = StyleSheet.create({
  coverage: {
    marginBottom: 8
  },
  coverageAmount: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  coverageTitle: {
    textAlign: "center"
  },
  carousel: {
    marginVertical: 15
  },
  planTitle: {
    textAlign: "center",
    fontSize: 20
  },
  plan: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: "white",
    elevation: 4
  }
});
