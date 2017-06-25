import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import VectorDrawableView from "react-native-vectordrawable-android";

import { Text } from "./defaultComponents";
import colors from "./colors";
import coverages from "../data/coverage";

export default class Coverage extends Component {
  static navigationOptions = { title: "Coverage" };

  renderItem(item, idx, items) {
    const lastIndex = idx === items.length - 1;
    return (
      <View
        key={item.title}
        style={[styles.item, lastIndex ? { borderBottomWidth: 0 } : null]}
      >
        <View style={styles.iconContainer}>
          <VectorDrawableView resourceName={item.icon} style={styles.icon} />
        </View>
        <Text style={styles.title}>{item.title.toUpperCase()}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  }

  renderRow(item) {
    return (
      <View key={item.title} style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.iconContainer}>
          <VectorDrawableView resourceName={item.icon} style={styles.icon} />
        </View>
        <Text style={styles.rowTitle}>{item.title.toUpperCase()}</Text>
      </View>
    );
  }

  render() {
    const { policy } = this.props.screenProps;
    const coveredItems = policy.covered.map(i => coverages[i]);
    const notCoveredItems = policy.notCovered.map(i => coverages[i]);
    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.container}>
            <View style={styles.coverages}>
              <Text style={[styles.title, styles.pageTitle]}>COVERED</Text>
              {coveredItems.map(this.renderItem)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const containerSize = 75;

const styles = StyleSheet.create({
  rowTitle: {
    textAlign: "center",
    marginTop: 7
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  pageTitle: {
    fontWeight: "500",
    fontSize: 22
  },
  coverages: {
    marginBottom: 30,
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1
  },
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
