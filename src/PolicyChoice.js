import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VectorDrawableView from "react-native-vectordrawable-android";

import { Text } from "./defaultComponents";
import colors from "./colors";
import policies from "../data/policies";

function addCommas(nStr) {
  nStr += "";
  x = nStr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

class Policy extends Component {
  constructor(props) {
    super(props);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan() {
    this.props.onSelectPlan(this.props.title);
  }

  render() {
    const { plans } = this.props;
    const lastPlan = plans[plans.length - 1];
    const highestCoverageAmount = lastPlan[Object.keys(lastPlan)[0]];
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={this.handleSelectPlan}>
        <View style={styles.policyContainer}>
          <View style={styles.iconContainer}>
            <VectorDrawableView
              resourceName={this.props.imageSource}
              style={styles.icon}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>
              {this.props.title}
            </Text>
            <Text style={styles.subtitle}>
              Up to ${addCommas(highestCoverageAmount)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class PolicyChoice extends Component {
  constructor(props) {
    super(props);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.state = {
      topAnim: new Animated.Value(20),
      fadeAnim: new Animated.Value(0) // Initial value for opacity: 0
    };
  }

  handleSelectPlan(policyTitle) {
    this.props.onSelectPolicy(policyTitle);
  }

  componentDidMount() {
    Animated.parallel(
      [
        Animated.timing(this.state.fadeAnim, {
          toValue: 1 // Animate to opacity: 1, or fully opaque
        }),
        Animated.timing(this.state.topAnim, {
          toValue: 0
        })
      ],
      {
        duration: 500
      }
    ).start();
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: this.state.fadeAnim, top: this.state.topAnim }
        ]}
      >
        {policies.map(policy => {
          return (
            <Policy
              key={policy.title}
              onSelectPlan={this.handleSelectPlan}
              {...policy}
            />
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  policyContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 6,
    borderRadius: 3
  },
  iconContainer: {
    justifyContent: "center",
    paddingRight: 12
  },
  detailContainer: {
    flex: 1
  },
  icon: {
    height: 75,
    width: 75
  },
  title: {
    fontSize: 16,
    color: colors.primaryText
  },
  subtitle: {
    marginTop: 4
  },
  container: {
    flex: 1
  }
});
