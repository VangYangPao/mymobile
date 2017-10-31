"use strict";

var React = require("react");
var ReactNative = require("react-native");
var { Dimensions, StyleSheet, TouchableOpacity, View, Animated } = ReactNative;
import { NavigationActions } from "react-navigation";

import { Text } from "./defaultComponents";
import colors from "../styles/colors";

var deviceWidth = Dimensions.get("window").width;
var DOT_SIZE = 6;
var DOT_SPACE = 4;

var styles = StyleSheet.create({
  button: {
    flex: 1
  },
  buttonsContainer: {
    flexDirection: "row"
  },
  buttonText: {
    color: colors.primaryOrange,
    fontSize: 18
  },
  indicators: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  tab: {
    alignItems: "center"
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#E0E1E2",
    marginLeft: DOT_SPACE,
    marginRight: DOT_SPACE
  },
  curDot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primaryOrange,
    margin: DOT_SPACE,
    bottom: 0
  },
  container: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    backgroundColor: "white"
  }
});

var DefaultViewPageIndicator = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activePage: React.PropTypes.number,
    pageCount: React.PropTypes.number
  },

  getInitialState() {
    return {
      viewWidth: 0
    };
  },

  resetToAuth() {
    const resetToAuthAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: "Intro"
        }),
        NavigationActions.navigate({
          routeName: "Drawer",
          action: NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Auth"
              })
            ]
          })
        })
      ]
    });
    this.props.screenProps.rootNavigation.dispatch(resetToAuthAction);
  },

  renderIndicator(page) {
    //var isTabActive = this.props.activePage === page;
    return (
      <TouchableOpacity
        style={styles.tab}
        key={"idc_" + page}
        onPress={() => this.props.goToPage(page)}
      >
        <View style={styles.dot} />
      </TouchableOpacity>
    );
  },

  render() {
    var pageCount = this.props.pageCount;
    var itemWidth = DOT_SIZE + DOT_SPACE * 2;
    var offset =
      (this.state.viewWidth - itemWidth * pageCount) / 2 +
      itemWidth * this.props.activePage;

    //var left = offset;
    var offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [offsetX, offsetX + itemWidth]
    });

    var indicators = [];
    for (var i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i));
    }

    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            accessibilityLabel="intro__sign-in"
            onPress={this.resetToAuth.bind(this)}
            style={[
              styles.button,
              { alignItems: "flex-start", paddingLeft: 20 }
            ]}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="intro__browse"
            onPress={() => this.props.navigation.navigate("TermsOfUse")}
            style={[
              styles.button,
              { alignItems: "flex-end", paddingRight: 20 }
            ]}
          >
            <Text style={styles.buttonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.indicators}>
          <View
            style={styles.tabs}
            onLayout={event => {
              var viewWidth = event.nativeEvent.layout.width;
              if (!viewWidth || this.state.viewWidth === viewWidth) {
                return;
              }
              this.setState({
                viewWidth: viewWidth
              });
            }}
          >
            {indicators}
            <Animated.View style={[styles.curDot, { left }]} />
          </View>
        </View>
      </View>
    );
  }
});

module.exports = DefaultViewPageIndicator;
