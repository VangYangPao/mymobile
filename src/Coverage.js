import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import VectorDrawableView from "react-native-vectordrawable-android";

import { Text } from "./defaultComponents";
import colors from "./colors";
import coverages from "../data/coverage";

export default function coverageWrapper(covered) {
  const wrapper = props => {
    props.screenProps.covered = covered;
    return <Coverage {...props} />;
  };
  wrapper.navigationOptions = ({ screenProps }) => {
    return { title: covered ? "Covered" : "Not Covered" };
  };
  return wrapper;
}

class Coverage extends Component {
  render() {
    const { policy, covered } = this.props.screenProps;
    const itemTitles = covered ? policy.covered : policy.notCovered;
    const items = itemTitles.map(i => coverages[i]);
    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.container}>
            <View style={styles.coverageItem}>
              {items.map((item, idx) => {
                const lastIndex = idx === items.length - 1;
                return (
                  <View
                    key={item.title}
                    style={[
                      styles.item,
                      lastIndex ? { borderBottomWidth: 0 } : null
                    ]}
                  >
                    <View style={styles.iconContainer}>
                      <VectorDrawableView
                        resourceName={item.icon}
                        style={styles.icon}
                      />
                    </View>
                    <Text style={styles.title}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const containerSize = 75;

const styles = StyleSheet.create({
  description: {
    fontSize: 16
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    color: colors.primaryText,
    textAlign: "center"
  },
  icon: {
    height: containerSize,
    width: containerSize
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: containerSize,
    width: containerSize,
    borderRadius: containerSize / 2,
    backgroundColor: colors.softBorderLine
  },
  item: {
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.softBorderLine,
    paddingVertical: 15
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 17,
    elevation: 4,
    borderRadius: 3,
    backgroundColor: "white"
  },
  scrollView: {
    flex: 1
  },
  scrollViewContentContainer: {
    paddingVertical: 17,
    paddingHorizontal: 13
  },
  page: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
