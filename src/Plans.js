import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "./colors";

class Plan extends Component {
  render() {
    return (
      <View style={styles.planContainer}>
        <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
        <Text style={styles.subtitle}>{this.props.subtitle}</Text>
      </View>
    );
  }
}

export default class Plans extends Component {
  render() {
    const plans = [
      {
        title: "Personal accident",
        subtitle: "Up to $10,000"
      },
      {
        title: "Personal accident /w Weekly Indemnities",
        subtitle: "Up to $10,000"
      },
      {
        title: "Snatch theft",
        subtitle: "Up to $10,000"
      }
    ];

    return (
      <View style={styles.container}>
        {plans.map(plan => <Plan key={plan.title} {...plan} />)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  planContainer: {
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    borderRadius: 3
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
