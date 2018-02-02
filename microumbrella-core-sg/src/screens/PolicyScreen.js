// @flow
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Dimensions,
  Modal,
  Platform,
  InteractionManager
} from "react-native";
import { TabNavigator, TabBarTop } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Parse from "parse/react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

import { Text } from "../components/defaultComponents";
import Footer from "../components/Footer";
import ChatScreenWrapper from "./Chat";
import PolicyOverview from "./PolicyOverview";
import CoveragePage from "../components/Coverage";
import InsideOutButton from "../components/InsideOutButton";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { ENV } from "react-native-dotenv";
import tabStyles from "../styles/TabBar.styles";
import Button from "../components/Button";

import { MENU_ICON_SIZE, navigationStyles } from "../navigations";
const windowWidth = Dimensions.get("window").width;
import { showAlert, normalizeFont } from "../utils";

class DeclarationModal extends Component {
  declineDeclaration() {
    showAlert(
      "Must accept Customer Consent and Declaration before purchasing insurance plans"
    );
  }

  render() {
    const declarationText = `• I declare that the above statement and answer are true and complete to the best of my knowledge and belief
• I hereby authorize any hospital, clinic, person or organization to disclose when requested to do so by HL Assurance Singapore, all information with respect to any illness, injury, medical history, consultations, prescription or treatments and copies of all hospital or medical records. 
• I authorize to disclose information about the insured person if this claim is made on behalf of them
• A photocopy of this authorization shall be effective and valid as the original
• I agree with WECARE TECH LLP and HL Assurance Singapore Policies on Personal Data
• I agree that the list of supporting documents required is not exhaustive and HL Assurance Singapore reserves the rights to request from me any additional information or documentation
• I agree that I have to bear the costs of providing medical reports or supporting documents to HL Assurance Singapore
`;
    const iconName = (Platform.OS === "ios" ? "ios" : "md") + "-arrow-back";
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={true}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContentContainer}>
            <View style={styles.checkoutHeader}>
              <TouchableOpacity onPress={this.props.onClose}>
                <Ionicon
                  name={iconName}
                  size={MENU_ICON_SIZE}
                  style={navigationStyles.headerLeftIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.checkoutContent}>
              <Text style={styles.checkoutTitle}>
                Customer Consent and Declaration
              </Text>
              <Text style={styles.declarationText}>{declarationText}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.props.onAcceptDeclaration}
                  containerStyle={styles.yesButton}
                >
                  YES
                </Button>
                <InsideOutButton onPress={this.declineDeclaration}>
                  <Text style={styles.insideOutButtonText}>NO</Text>
                </InsideOutButton>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

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
      activeTintColor: colors.primaryAccent,
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
    this.state = { pricePerMonth, renderDeclarationModal: false };
  }

  handlePurchase() {
    this.setState({ renderDeclarationModal: false });

    setTimeout(() => {
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
    }, 500);
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
        {this.state.renderDeclarationModal ? (
          <DeclarationModal
            onAcceptDeclaration={this.handlePurchase}
            onClose={() => this.setState({ renderDeclarationModal: false })}
          />
        ) : null}
        <PlanTabNavigator screenProps={screenProps} />
        <Footer
          onPress={() => this.setState({ renderDeclarationModal: true })}
          text={footerText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  declarationText: {
    fontSize: normalizeFont(1.7)
  },
  yesButton: {
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 10
  },
  insideOutButtonText: {
    color: colors.primaryAccent,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  },
  checkoutContent: {
    paddingTop: 5,
    paddingBottom: 30,
    paddingHorizontal: 25
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 25,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: colors.softBorderLine
  },
  checkoutTitle: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 15,
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center"
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
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  tabIndicator: {
    backgroundColor: colors.primaryAccent,
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
