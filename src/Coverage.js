import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

import colors from "./colors";

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
    const { plan, covered } = this.props.screenProps;
    const items = covered ? plan.covered : plan.notCovered;
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
                    <Text>{item.title}</Text>
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

const styles = StyleSheet.create({
  item: {
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
