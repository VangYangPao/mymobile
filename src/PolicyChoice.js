import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    const highestCoverageAmount = plans[plans.length - 1].coverageAmount;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={this.handleSelectPlan}>
        <View style={styles.policyContainer}>
          <View style={styles.iconContainer}>
            <Icon name={this.props.iconName} style={styles.icon} />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {this.props.title}
            </Text>
            <Text style={styles.subtitle}>
              {this.props.subtitle}
              {" "}
              {"\u2022"}
              {" "}
              Up to $
              {addCommas(highestCoverageAmount)}
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
      fadeAnim: new Animated.Value(0) // Initial value for opacity: 0
    };
  }

  handleSelectPlan(policyTitle) {
    this.props.onSelectPlan(policyTitle);
  }

  componentDidMount() {
    Animated.timing(
      // Animate over time
      this.state.fadeAnim, // The animated value to drive
      {
        toValue: 1 // Animate to opacity: 1, or fully opaque
      }
    ).start();
  }

  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: this.state.fadeAnim }]}
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    marginBottom: 7,
    padding: 12,
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
    fontSize: 30
  },
  title: {
    fontSize: 16,
    color: colors.primaryText
  },
  container: {
    flex: 1,
    marginTop: 10
  }
});
