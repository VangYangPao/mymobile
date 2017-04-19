import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import colors from "./colors";

class Plan extends Component {
  constructor(props) {
    super(props);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan() {
    this.props.onSelectPlan(this.props.title);
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={this.handleSelectPlan}>
        <View style={styles.planContainer}>
          <View style={styles.iconContainer}>
            <Icon name={this.props.iconName} style={styles.icon} />
          </View>
          <View>
            <Text style={styles.title} numberOfLines={2}>
              {this.props.title}
            </Text>
            <Text style={styles.subtitle}>{this.props.subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class Plans extends Component {
  constructor(props) {
    super(props);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan(planTitle) {
    this.props.onSelectPlan(planTitle);
  }

  render() {
    const plans = [
      {
        title: "Personal accident",
        subtitle: "Up to $10,000",
        iconName: "directions-car"
      },
      {
        title: "Personal accident /w Weekly Indemnities",
        subtitle: "Up to $10,000",
        iconName: "directions-car"
      },
      {
        title: "Snatch theft",
        subtitle: "Up to $10,000",
        iconName: "directions-car"
      }
    ];

    return (
      <View style={styles.container}>
        {plans.map(plan => {
          return (
            <Plan
              key={plan.title}
              onSelectPlan={this.handleSelectPlan}
              {...plan}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  planContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    borderRadius: 3
  },
  iconContainer: {
    justifyContent: "center",
    paddingRight: 10
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
