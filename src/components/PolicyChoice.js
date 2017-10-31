// @flow
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VectorDrawableView from "./VectorDrawableView";

import { Text } from "./defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { addCommas } from "../utils";

class Policy extends Component {
  constructor(props) {
    super(props);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan() {
    this.props.onSelectPlan(this.props.title);
  }

  render() {
    const titleSplit = this.props.title.split(" with ");
    return (
      <TouchableOpacity
        accessibilityLabel={"purchase__policy-choice-" + this.props.id}
        activeOpacity={0.6}
        onPress={this.handleSelectPlan}
      >
        <View style={styles.policyContainer}>
          <View style={styles.iconContainer}>
            <VectorDrawableView
              resourceName={this.props.imageSource}
              style={styles.icon}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>
              {titleSplit[0]}
              {titleSplit[1] ? (
                <Text style={styles.boldedText}> with {titleSplit[1]}</Text>
              ) : null}
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
      topAnim: new Animated.Value(40),
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
        {AppStore.policies.map(policy => {
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
  boldedText: {
    fontWeight: "bold"
  },
  policyContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 6,
    borderRadius: 3,
    elevation: 3,
    shadowColor: colors.borderLine,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  iconContainer: {
    justifyContent: "center",
    paddingRight: 18
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center"
  },
  icon: {
    height: 65,
    width: 65
  },
  title: {
    fontSize: 18,
    color: colors.primaryText
  },
  subtitle: {
    marginTop: 4
  },
  container: {
    flex: 1,
    marginTop: 10
  }
});
