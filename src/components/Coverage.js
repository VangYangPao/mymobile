// @flow
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import VectorDrawableView from "./VectorDrawableView";

import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { Text } from "./defaultComponents";

export default class Coverage extends Component {
  static navigationOptions = { title: "Coverage" };

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  renderItem(covered, item, idx, items) {
    const lastIndex = idx === items.length - 1;
    return (
      <View
        key={item.title}
        style={[styles.item, lastIndex ? { borderBottomWidth: 0 } : null]}
      >
        <View style={styles.iconContainer}>
          <VectorDrawableView resourceName={item.icon} style={styles.icon} />
        </View>
        <Text style={styles.title}>
          {covered ? item.title.toUpperCase() : item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  }

  renderNotCovered() {
    if (!this.state.expanded) return null;
    const { policy } = this.props.screenProps;
    const notCoveredItems = policy.notCovered.map(i => AppStore.coverages[i]);
    return (
      <View style={styles.coverages}>
        <Text style={[styles.title, styles.notCoveredTitle]}>Not Covered</Text>
        {notCoveredItems.map((...params) => this.renderItem(false, ...params))}
      </View>
    );
  }

  render() {
    const { policy } = this.props.screenProps;
    const coveredItems = policy.covered.map(i => AppStore.coverages[i]);
    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.container}>
            <View style={styles.coverages}>
              <Text style={[styles.title, styles.pageTitle]}>COVERED</Text>
              {coveredItems.map((...params) =>
                this.renderItem(true, ...params)
              )}
            </View>
            <TouchableOpacity onPress={() => this.setState({ expanded: true })}>
              <Text style={styles.notCoveredOpenerText}>
                Here is a summary of what is not covered.
              </Text>
            </TouchableOpacity>
            {this.renderNotCovered()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const containerSize = 75;

const styles = StyleSheet.create({
  notCoveredOpenerText: {
    alignSelf: "center",
    color: colors.borderLine,
    fontSize: 16,
    textAlign: "center"
  },
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
  notCoveredTitle: {
    fontSize: 22
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
    textAlign: "justify",
    fontSize: 16,
    color: colors.primaryText
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
    paddingHorizontal: 13,
    backgroundColor: colors.softBorderLine
  },
  page: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.softBorderLine
  }
});
