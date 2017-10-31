import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "./defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

export default class Footer extends Component {
  render() {
    return (
      <View style={styles.footer}>
        <View style={styles.footerBtnContainer}>
          <TouchableOpacity
            accessibilityLabel="policy__purchase-btn"
            style={[styles.footerBtn, styles.footerPurchase]}
            activeOpacity={0.6}
            onPress={() => {
              if (typeof this.props.onPress === "function") {
                this.props.onPress();
              }
            }}
          >
            <View style={styles.footerBtn}>
              <Text style={[styles.footerBtnText, styles.footerPurchaseText]}>
                {this.props.text}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerPurchase: {
    backgroundColor: colors.primaryAccent
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
  footer: {}
});
