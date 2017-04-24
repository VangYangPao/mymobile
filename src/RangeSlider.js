import React, { PropTypes, Component } from "react";
import {
  requireNativeComponent,
  View,
  StyleSheet,
  Text,
  PanResponder
} from "react-native";

import colors from "./colors";

const BAR_WIDTH = 300;
const BAR_HEIGHT_PERCENT = 0.045;
const SLOT_RADIUS_PERCENT = 0.075;
const SLIDER_RADIUS_PERCENT = 0.15;

export default class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.state = {
      currentIndex: 0
    };
  }

  _onChange(event: Event) {
    const index = event.nativeEvent.index;
    this.setState(
      {
        currentIndex: index
      },
      () => {
        if (!this.props.onValueChange) return;
        this.props.onValueChange(this.props.values[index]);
      }
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        if (!this.props.onGesture) return;
        this.props.onGesture(true);
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!this.props.onGesture) return;
        this.props.onGesture(true);
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (!this.props.onGesture) return;
        this.props.onGesture(false);
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        if (!this.props.onGesture) return;
        this.props.onGesture(false);
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

  render() {
    const rangeSliderProps = {
      rangeCount: this.props.values.length,
      barHeightPercent: this.props.barHeightPercent || BAR_HEIGHT_PERCENT,
      slotRadiusPercent: this.props.slotRadiusPercent || SLOT_RADIUS_PERCENT,
      sliderRadiusPercent: this.sliderRadiusPercent || SLIDER_RADIUS_PERCENT
    };

    return (
      <View {...this._panResponder.panHandlers} style={styles.container}>
        <View style={styles.labels}>
          {this.props.values.map((v, idx) => {
            const activeStyle = idx === this.state.currentIndex
              ? styles.activeLabel
              : null;
            return (
              <Text key={v.value} style={[styles.label, activeStyle]}>
                {v.label}
              </Text>
            );
          })}
        </View>
        <RCTRangeSlider
          onChange={this._onChange}
          style={styles.slider}
          {...rangeSliderProps}
        />
      </View>
    );
  }
}

RangeSlider.propTypes = {
  rangeCount: PropTypes.number,
  barHeightPercent: PropTypes.number,
  slotRadiusPercent: PropTypes.number,
  sliderRadiusPercent: PropTypes.number,
  filledColor: PropTypes.string,
  emptyColor: PropTypes.string,
  onValueChange: PropTypes.func,
  ...View.propTypes // include the default view properties
};

const RCTRangeSlider = requireNativeComponent("RCTRangeSlider", RangeSlider, {
  nativeOnly: { onChange: true }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  activeLabel: {
    fontSize: 17,
    color: colors.primaryOrange
  },
  label: {
    fontWeight: "600",
    color: "#757575"
  },
  labels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: BAR_WIDTH * SLOT_RADIUS_PERCENT,
    paddingRight: BAR_WIDTH * (SLOT_RADIUS_PERCENT - 0.035),
    width: 300
  },
  slider: {
    marginTop: -15,
    width: BAR_WIDTH,
    height: 75
  }
});
