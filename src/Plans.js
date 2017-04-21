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
import plans from "../data/plans";

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
          <View style={styles.detailContainer}>
            <Text style={styles.title} numberOfLines={1}>
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
    this.state = {
      fadeAnim: new Animated.Value(0) // Initial value for opacity: 0
    };
  }

  handleSelectPlan(planTitle) {
    this.props.onSelectPlan(planTitle);
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
        {plans.map(plan => {
          return (
            <Plan
              key={plan.title}
              onSelectPlan={this.handleSelectPlan}
              {...plan}
            />
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  planContainer: {
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
