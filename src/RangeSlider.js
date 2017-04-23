import React, { PropTypes, Component } from "react";
import { requireNativeComponent, View, StyleSheet, Text } from "react-native";

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

  render() {
    const rangeSliderProps = {
      rangeCount: this.props.values.length,
      barHeightPercent: this.props.barHeightPercent || BAR_HEIGHT_PERCENT,
      slotRadiusPercent: this.props.slotRadiusPercent || SLOT_RADIUS_PERCENT,
      sliderRadiusPercent: this.sliderRadiusPercent || SLIDER_RADIUS_PERCENT
    };

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.labels}>
          {this.props.values.map((v, idx) => {
            const activeStyle = idx === this.state.currentIndex
              ? styles.activeLabel
              : null;
            return <Text key={v} style={[styles.label, activeStyle]}>{v}</Text>;
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
  activeLabel: {
    color: colors.primaryOrange
  },
  label: {
    fontWeight: "600",
    color: "#757575"
  },
  labels: {
    flexDirection: "row",
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
