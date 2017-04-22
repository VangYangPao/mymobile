import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { TabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreen from "./Chat";
import PlanOverview from "./PlanOverview";
import PLANS from "../data/plans";
import colors from "./colors";


class OverviewScreen extends Component {
  render() {
    return <View><Text>test</Text></View>;
  }
}

class CoveredScreen extends Component {
  render() {
    return <View><Text>test</Text></View>;
  }
}

class NotCoveredScreen extends Component {
  static navigationOptions = {
    title: "Not Covered"
  };

  render() {
    return <View><Text>test</Text></View>;
  }
}

const tabStyles = {
  tabIndicator: {
    backgroundColor: colors.primaryOrange,
    height: 3
  },
  tabLabel: {
    fontWeight: "600"
  },
  tabContainer: {
    backgroundColor: "white",
    elevation: 5
  }
};

const PlanTabNavigator = TabNavigator(
  {
    Overview: {
      screen: PlanOverview
    },
    Covered: {
      screen: CoveredScreen
    },
    NotCovered: {
      screen: NotCoveredScreen
    }
  },
  {
    tabBarOptions: {
      activeTintColor: colors.primaryOrange,
      inactiveTintColor: colors.primaryText,
      style: tabStyles.tabContainer,
      labelStyle: tabStyles.tabLabel,
      indicatorStyle: tabStyles.tabIndicator
    }
  }
);

class Footer extends Component {
  render() {
    return (
      <View style={styles.footer}>
        <View style={styles.footerBtnContainer}>
          {/*<TouchableOpacity
            style={[styles.footerBtn, styles.footerGoBack]}
            onPress={() => {}}
          >
            <View style={styles.footerBtn}>
              <Text style={[styles.footerBtnText, styles.footerGoBackText]}>
                GO BACK
              </Text>
            </View>
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={[styles.footerBtn, styles.footerPurchase]}
            activeOpacity={0.6}
            onPress={() => {}}
          >
            <View style={styles.footerBtn}>
              <Text style={[styles.footerBtnText, styles.footerPurchaseText]}>
                PURCHASE
              </Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

export default class PlanScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const options = ChatScreen.navigationOptions;
    options.headerStyle = styles.header;
    return options;
  };

  render() {
    return (
      <View style={styles.container}>
        <PlanTabNavigator
          screenProps={this.props.navigation.state.params}
        />
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabIndicator: {
    backgroundColor: colors.primaryOrange,
    height: 3
  },
  tabLabel: {
    fontWeight: "600"
  },
  tabContainer: {
    backgroundColor: "white",
    elevation: 5
  },
  header: {
    elevation: 0
  },
  footerGoBack: {
    backgroundColor: "white"
  },
  footerPurchase: {
    backgroundColor: colors.primaryOrange
  },
  footerGoBackText: {
    color: colors.primaryText
  },
  footerBtnContainer: {
    justifyContent: "center",
    height: 50,
    flexDirection: "row"
  },
  footerBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  footerBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15
  },
  container: {
    flex: 1
  },
  footer: {
    justifyContent: "flex-end"
  }
});
