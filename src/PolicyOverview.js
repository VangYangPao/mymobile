import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  DatePickerAndroid,
  InteractionManager,
  Animated,
  Easing,
  ToastAndroid,
  Slider
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import VectorDrawableView from "react-native-vectordrawable-android";

import RangeSlider from "./RangeSlider";
import colors from "./colors";
import coveragesData from "../data/coverage";

class PolicyPrice extends Component {
  render() {
    const { pricePerMonth } = this.props;
    const intPricePart = Math.floor(pricePerMonth);
    const decimalPricePart = (pricePerMonth + "").split(".")[1];
    var additionalStyle = null;

    if (intPricePart >= 10) {
      const { fontSize } = StyleSheet.flatten(styles.priceAmount);
      additionalStyle = {
        fontSize: fontSize - 5
      };
    }
    return (
      <View style={styles.priceContainer}>
        <View style={styles.price}>
          <Text style={styles.priceCurrency}>$</Text>
          <Text style={[styles.priceAmount, additionalStyle]}>
            {intPricePart}
          </Text>
          <Text style={[styles.priceAmount, styles.priceAmountDecimal]}>
            .{decimalPricePart}
          </Text>
        </View>
        <Text style={styles.pricePerMonth}>PER MONTH</Text>
      </View>
    );
  }
}

class PolicyStartDate extends Component {
  render() {
    const today = new Date();
    const { startDate } = this.props;
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const startDateIsToday =
      today.getDate() === startDay &&
      today.getMonth() === startMonth &&
      today.getFullYear() === startYear;
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

    return (
      <View style={styles.startDateContainer}>
        <Text style={styles.startDate}>Start date</Text>
        <TouchableOpacity onPress={this.props.onSelectStartDate}>
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
    );
  }
}

class CoverageItem extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {}

  render() {
    return (
      <TouchableOpacity
        style={styles.coverageBtn}
        activeOpacity={0.5}
        onPress={this.handlePress}
      >
        <View style={styles.coverageItem}>
          <View
            style={[
              styles.coverageIconContainer,
              !this.props.covered ? styles.notCovered : null
            ]}
          >
            <VectorDrawableView
              resourceName={this.props.icon}
              style={styles.coverageIcon}
            />
          </View>
          <Text style={styles.coverageTitle}>
            {this.props.shortTitle || this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class PolicyCoverages extends Component {
  render() {
    return (
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>COVERAGE HIGHLIGHTS</Text>
        <Text style={styles.configSubtitle}>
          CLICK ICONS FOR MORE DETAILS
        </Text>
        <View style={styles.coverage}>
          {this.props.covered.map(item => (
            <CoverageItem key={item} covered={true} {...coveragesData[item]} />
          ))}
          {this.props.notCovered.map(item => (
            <CoverageItem key={item} covered={false} {...coveragesData[item]} />
          ))}
        </View>
      </View>
    );
  }
}

export default class PolicyOverview extends Component {
  constructor(props) {
    super(props);
    this.handleSelectStartDate = this.handleSelectStartDate.bind(this);
    this.getPricePerMonth = this.getPricePerMonth.bind(this);
    this.updateCoverageAmount = this.updateCoverageAmount.bind(this);

    const { plans } = props.screenProps.policy;
    this.coverageAmounts = plans.map(p => p.coverageAmount);
    this.coverageDurations = ["1m", "2m", "3m", "6m", "12m"];

    this.state = {
      renderContent: false,
      scrollEnabled: true,
      fadeAnim: new Animated.Value(0),
      topAnim: new Animated.Value(50),
      startDate: new Date(),
      coverageAmount: this.coverageAmounts[0],
      coverageDuration: this.coverageDurations[0]
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

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ renderContent: true }, () => {
        Animated.parallel(
          [
            Animated.timing(this.state.fadeAnim, {
              toValue: 1 // Animate to opacity: 1, or fully opaque
            }),
            Animated.timing(this.state.topAnim, {
              toValue: 0
            })
          ],
          {
            duration: 500
          }
        ).start();
      })
    );
  }

  updateCoverageAmount(coverageAmount) {
    this.setState({ coverageAmount }, () =>
      this.props.screenProps.onPricePerMonthChange(this.getPricePerMonth())
    );
  }

  getPricePerMonth() {
    const { plans } = this.props.screenProps.policy;
    const { coverageAmount } = this.state;
    const planIndex = this.coverageAmounts.indexOf(coverageAmount);
    const { premium } = plans[planIndex];
    return premium;
  }

  render() {
    if (!this.state.renderContent) {
      return <View style={styles.page} />;
    }
    const { policy, onPricePerMonthChange } = this.props.screenProps;

    const coverageAmounts = this.coverageAmounts.map(c => ({
      label: Math.floor(c / 1000) + "k",
      value: c
    }));
    const coverageDurations = this.coverageDurations.map(d => ({
      label: d,
      value: d
    }));
    const pricePerMonth = this.getPricePerMonth();

    return (
      <View style={styles.page}>
        <ScrollView
          scrollEnabled={this.state.scrollEnabled}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <Animated.View
            style={[
              styles.container,
              { opacity: this.state.fadeAnim, top: this.state.topAnim }
            ]}
          >
            <Text style={styles.policyTitle}>
              {policy.title}
            </Text>

            <PolicyPrice pricePerMonth={pricePerMonth} />

            <PolicyStartDate
              startDate={this.state.startDate}
              onSelectStartDate={this.handleSelectStartDate}
            />

            <PolicyCoverages {...policy} />

            <View style={styles.configContainer}>
              <Text style={styles.configTitle}>COVERAGE AMOUNTS</Text>
              <Text style={styles.configSubtitle}>
                SLIDE TO ADJUST THE AMOUNT
              </Text>
              <RangeSlider
                elements={coverageAmounts}
                onValueChange={this.updateCoverageAmount}
              />
            </View>
            <View style={[styles.configContainer, styles.lastView]}>
              <Text style={styles.configTitle}>COVERAGE DURATION</Text>
              <Text style={styles.configSubtitle}>
                SLIDE TO ADJUST THE DURATION
              </Text>
              <RangeSlider
                elements={coverageDurations}
                onValueChange={coverageDuration =>
                  this.setState({ coverageDuration })}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}

const PRICE_CONTAINER_SIZE = 150;
const COVERAGE_CONTAINER_SIZE = 50;
const PRICE_DECIMAL_CONTAINER_SIZE = 50;

const styles = StyleSheet.create({
  lastView: {
    borderBottomWidth: 0
  },
  coverageBtn: {
    flex: 0.25
  },
  notCovered: {
    opacity: 0.3
  },
  coverageTitle: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12
  },
  coverageIcon: {
    height: COVERAGE_CONTAINER_SIZE,
    width: COVERAGE_CONTAINER_SIZE
  },
  coverageIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: COVERAGE_CONTAINER_SIZE,
    width: COVERAGE_CONTAINER_SIZE,
    borderRadius: COVERAGE_CONTAINER_SIZE / 2,
    backgroundColor: "#F5F5F5"
  },
  coverageItem: {
    alignItems: "center"
  },
  coverage: {
    flexDirection: "row"
  },
  configTitle: {
    color: colors.primaryText,
    fontSize: 19,
    fontWeight: "500"
  },
  configSubtitle: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 20
  },
  configContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
    paddingBottom: 15,
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1.5
  },
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
  startDateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
    paddingBottom: 15,
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1.5
  },
  priceContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: PRICE_CONTAINER_SIZE,
    width: PRICE_CONTAINER_SIZE,
    marginVertical: 20,
    borderRadius: PRICE_CONTAINER_SIZE / 2,
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
  priceAmountDecimal: {
    alignSelf: "flex-start",
    fontSize: 18
  },
  priceAmountDecimalContainer: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    height: PRICE_DECIMAL_CONTAINER_SIZE,
    width: PRICE_DECIMAL_CONTAINER_SIZE,
    borderRadius: PRICE_DECIMAL_CONTAINER_SIZE / 2,
    backgroundColor: colors.primaryOrange
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
  policyTitle: {
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
