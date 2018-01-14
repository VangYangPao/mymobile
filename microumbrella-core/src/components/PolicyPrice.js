// @flow
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { Text } from "./defaultComponents";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

export default class PolicyPrice extends Component {
  props: {
    pricePerMonth: number,
    minimumCoverage: number,
    showFrom: boolean
  };

  render() {
    const { pricePerMonth, minimumCoverage } = this.props;
    const [intPricePart, decimalPricePart] = pricePerMonth
      .toFixed(2)
      .split(".");
    var additionalStyle = null;

    if (parseInt(intPricePart, 10) >= 10) {
      const { fontSize } = StyleSheet.flatten(styles.priceAmount);
      additionalStyle = {
        fontSize: fontSize - 5
      };
    }
    return (
      <View style={styles.circlesContainer}>
        <View style={styles.priceContainer}>
          {this.props.showFrom ? (
            <Text style={styles.pricePerMonth}>FROM</Text>
          ) : null}
          <View style={styles.price}>
            <Text style={styles.priceCurrency}>{AppStore.currency}</Text>
            <Text style={[styles.priceAmount, additionalStyle]}>
              {intPricePart + ""}
            </Text>
            <Text style={[styles.priceAmount, styles.priceAmountDecimal]}>
              .{decimalPricePart + ""}
            </Text>
          </View>
        </View>
        {this.props.showDuration ? (
          <View style={styles.priceContainer}>
            {this.props.showFrom ? (
              <Text style={styles.pricePerMonth}>FROM</Text>
            ) : null}
            <View style={styles.price}>
              <Text
                style={[
                  styles.priceAmount,
                  styles.priceDuration,
                  { textAlign: "center" }
                ]}
              >
                {minimumCoverage}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const PRICE_CONTAINER_SIZE = 125;
const PRICE_DECIMAL_CONTAINER_SIZE = 20;

const styles = StyleSheet.create({
  circlesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  priceContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: PRICE_CONTAINER_SIZE,
    width: PRICE_CONTAINER_SIZE,
    marginVertical: 13,
    borderRadius: PRICE_CONTAINER_SIZE / 2,
    backgroundColor: colors.primaryAccent
  },
  price: {
    flexDirection: "row",
    alignItems: "center"
  },
  priceCurrency: {
    paddingBottom: 10,
    fontSize: 20,
    color: "white"
  },
  priceAmountDecimal: {
    alignSelf: "flex-start",
    fontSize: 15
  },
  priceAmountDecimalContainer: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    height: PRICE_DECIMAL_CONTAINER_SIZE,
    width: PRICE_DECIMAL_CONTAINER_SIZE,
    borderRadius: PRICE_DECIMAL_CONTAINER_SIZE / 2,
    backgroundColor: colors.primaryAccent
  },
  priceDuration: {
    fontSize: 25
  },
  priceAmount: {
    fontSize: 40,
    color: "white"
  },
  pricePerMonth: {
    fontWeight: "500",
    fontSize: 14,
    color: "white"
  }
});
