import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { TabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreenWrapper from "./Chat";
import PlanOverview from "./PlanOverview";
import PLANS from "../data/plans";
import CoverageWrapper from "./Coverage";
import colors from "./colors";

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
      screen: CoverageWrapper(true)
    },
    NotCovered: {
      screen: CoverageWrapper(false)
    }
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      upperCaseLabel: true,
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
                PURCHASE (${this.props.pricePerMonth}/month)
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
    const options = ChatScreenWrapper(true).navigationOptions;
    options.title = "microAssure";
    options.headerStyle = styles.header;
    return options;
  };

  constructor(props) {
    super(props);
    const { pricePerMonth } = props.navigation.state.params;
    this.handlePricePerMonthChange = this.handlePricePerMonthChange.bind(this);
    this.state = { pricePerMonth };
  }

  handlePricePerMonthChange(pricePerMonth) {
    this.setState({ pricePerMonth });
  }

  render() {
    const screenProps = {
      plan: this.props.navigation.state.params,
      onPricePerMonthChange: this.handlePricePerMonthChange
    };
    return (
      <View style={styles.container}>
        <PlanTabNavigator screenProps={screenProps} />
        <Footer pricePerMonth={this.state.pricePerMonth} />
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
