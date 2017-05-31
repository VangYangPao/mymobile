import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import { TabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "./defaultComponents";
import Footer from "./Footer";
import ChatScreenWrapper from "./Chat";
import PolicyOverview from "./PolicyOverview";
import POLICIES from "../data/policies";
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
      screen: PolicyOverview
    },
    Covered: {
      screen: CoverageWrapper(true)
    },
    NotCovered: {
      screen: CoverageWrapper(false)
    }
  },
  {
    // swipeEnabled: false,
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

export default class PolicyScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const options = ChatScreenWrapper(null).navigationOptions;
    options.title = "Product Summary";
    options.headerStyle = styles.header;
    return options;
  };

  constructor(props) {
    super(props);
    const { policy, page } = this.props.navigation.state.params;
    this.policy = policy;
    this.page = page;
    const pricePerMonth = this.policy.plans[0].premium;
    this.handlePricePerMonthChange = this.handlePricePerMonthChange.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.state = { pricePerMonth };
  }

  handlePurchase() {
    if (this.page === "info") {
      this.props.navigation.navigate("Chat", {
        policy: this.policy,
        questionSet: "buy"
      });
    }
  }

  handlePricePerMonthChange(pricePerMonth) {
    this.setState({ pricePerMonth });
  }

  render() {
    const screenProps = {
      policy: this.policy,
      onPricePerMonthChange: this.handlePricePerMonthChange
    };
    const footerText = `PURCHASE ($${this.state.pricePerMonth}/month)`;
    return (
      <View style={styles.container}>
        <PlanTabNavigator screenProps={screenProps} />
        <Footer onPress={this.handlePurchase} text={footerText} />
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
  container: {
    flex: 1
  }
});
