import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Dimensions
} from "react-native";
import { TabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  CreditCardInput,
  LiteCreditCardInput
} from "react-native-credit-card-input";

import { Text } from "./defaultComponents";
import ChatScreenWrapper from "./Chat";
import PolicyOverview from "./PolicyOverview";
import POLICIES from "../data/policies";
import CoverageWrapper from "./Coverage";
import colors from "./colors";

const windowWidth = Dimensions.get("window").width;

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

class Footer extends Component {
  render() {
    return (
      <View style={styles.footer}>
        <View style={styles.footerBtnContainer}>
          <TouchableOpacity
            style={[styles.footerBtn, styles.footerPurchase]}
            activeOpacity={0.6}
            onPress={this.props.onPurchase}
          >
            <View style={styles.footerBtn}>
              <Text style={[styles.footerBtnText, styles.footerPurchaseText]}>
                PURCHASE (${this.props.pricePerMonth + ""}/month)
              </Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

class CheckoutModal extends Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={true}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentContainer}>
            <View style={styles.checkoutHeader}>
              <Text style={styles.checkoutTitle}>
                Enter credit card details
              </Text>
            </View>
            <View style={styles.checkoutContent}>
              <CreditCardInput
                onChange={this._onChange}
                inputStyle={styles.creditCardInputStyle}
              />
            </View>
            <Button
              onPress={() => {
                if (!this.props.onSelectDuration) return;
                this.props.onSelectDuration(this.state.months);
              }}
              title="CONFIRM PURCHASE"
              color={colors.primaryOrange}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

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
    this.state = { pricePerMonth, renderCheckoutModal: false };
  }

  handlePurchase() {
    if (this.page === "info") {
      this.props.navigation.navigate("Chat", {
        policy: this.policy,
        questionSet: "buy"
      });
    } else if (this.page === "checkout") {
      this.setState({ renderCheckoutModal: true });
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
    const modal = (
      <CheckoutModal
        onClose={() => this.setState({ renderCheckoutModal: false })}
      />
    );
    return (
      <View style={styles.container}>
        {this.state.renderCheckoutModal ? modal : null}
        <PlanTabNavigator screenProps={screenProps} />
        <Footer
          onPurchase={this.handlePurchase}
          pricePerMonth={this.state.pricePerMonth}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkoutContent: {
    paddingVertical: 20
  },
  checkoutHeader: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: colors.softBorderLine
  },
  checkoutTitle: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "500"
  },
  modalContentContainer: {
    alignItems: "stretch",
    justifyContent: "center",
    width: windowWidth,
    backgroundColor: "white"
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
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
    height: 45,
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
