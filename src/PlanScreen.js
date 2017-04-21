import React, { Component } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreen from "./Chat";
import colors from "./colors";

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
    options.title = navigation.state.params;
    return options;
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>{this.props.navigation.state.params}</Text>
        </ScrollView>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
