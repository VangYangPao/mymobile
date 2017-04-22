import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  DatePickerAndroid
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import colors from "./colors";

export default class PlanOverview extends Component {
  constructor(props) {
    super(props);
    this.handleSelectStartDate = this.handleSelectStartDate.bind(this);

    this.state = {
      startDate: new Date()
    };
  }

  async handleSelectStartDate() {
    try {
      const today = new Date();
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.startDate,
        minDate: new Date(),
        mode: "spinner"
      });
      if (action === DatePickerAndroid.dateSetAction) {
        this.setState({ startDate: new Date(year, month, day) });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", code, message);
    }
  }

  render() {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const today = new Date();
    const startDate = this.state.startDate;
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const startDateIsToday =
      today.getDate() === startDay &&
      today.getMonth() === startMonth &&
      today.getFullYear() === startYear;
    const plan = this.props.screenProps;

    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.container}>
            <Text style={styles.planTitle}>
              {plan.title}
            </Text>
            <View style={styles.priceContainer}>
              <View style={styles.price}>
                <Text style={styles.priceCurrency}>$</Text>
                <Text style={styles.priceAmount}>5</Text>
              </View>
              <Text style={styles.pricePerMonth}>PER MONTH</Text>
            </View>
            <View style={styles.configContainer}>
              <Text style={styles.startDate}>Start date</Text>
              <TouchableOpacity onPress={this.handleSelectStartDate}>
                <View style={styles.dropdown}>
                  <Text style={styles.dropdownDefault}>
                    {startDateIsToday
                      ? "TODAY"
                      : `${startDay} ${monthNames[startMonth]}, ${startYear}`}
                  </Text>
                  <Icon
                    size={25}
                    name="arrow-drop-down"
                    style={styles.dropdownIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const priceContainerSize = 150;

const styles = StyleSheet.create({
  startDate: {
    fontSize: 16,
    color: colors.primaryText
  },
  dropdownDefault: {
    justifyContent: "center",
    fontSize: 16,
    color: colors.primaryText
  },
  dropdownIcon: {
    color: colors.primaryText
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.borderLine
  },
  configContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  priceContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: priceContainerSize,
    width: priceContainerSize,
    marginVertical: 20,
    borderRadius: priceContainerSize / 2,
    backgroundColor: colors.primaryOrange
  },
  price: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -20
  },
  priceCurrency: {
    paddingBottom: 10,
    fontSize: 40,
    color: "white"
  },
  priceAmount: {
    fontSize: 60,
    color: "white"
  },
  pricePerMonth: {
    fontWeight: "500",
    fontSize: 16,
    color: "white"
  },
  planTitle: {
    alignSelf: "center",
    color: colors.primaryText,
    fontFamily: "Bitter",
    fontSize: 30
  },
  page: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  scrollView: {
    flex: 1
  },
  scrollViewContentContainer: {
    paddingVertical: 17,
    paddingHorizontal: 13
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 17,
    elevation: 4,
    borderRadius: 3,
    backgroundColor: "white"
  }
});
