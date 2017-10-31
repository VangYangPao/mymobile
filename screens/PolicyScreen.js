// @flow
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import { TabNavigator, TabBarTop } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Parse from "parse/react-native";

import { Text } from "../components/defaultComponents";
import Footer from "../components/Footer";
import ChatScreenWrapper from "./Chat";
import PolicyOverview from "./PolicyOverview";
import POLICIES from "../../data/policies";
import CoveragePage from "../components/Coverage";
import colors from "../styles/colors";
import { ENV } from "react-native-dotenv";
import tabStyles from "../styles/TabBar.styles";

const PlanTabNavigator = TabNavigator(
  {
    Overview: {
      screen: PolicyOverview
    },
    Coverage: {
      screen: CoveragePage
    }
  },
  {
    tabBarComponent: TabBarTop,
    tabBarPosition: "top",
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
    const options = ChatScreenWrapper("buy").navigationOptions;
    options.title = "Plan Summary";
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
    const { currentUser } = this.props.navigation.state.params;
    if (this.page === "info" && !currentUser) {
      // if (ENV === "development") {
      //   this.props.navigation.navigate("Chat", {
      //     policy: this.policy,
      //     currentUser,
      //     questionSet: "buy"
      //   });
      // } else {
      this.props.navigation.navigate("Auth", {
        policy: this.policy
      });
      // }
    } else {
      this.props.navigation.navigate("Chat", {
        questionSet: "buy",
        policy: this.policy,
        currentUser
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
    const footerText = `BUY`;
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
