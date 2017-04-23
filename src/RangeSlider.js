import React, { PropTypes, Component } from "react";
import { requireNativeComponent, View } from "react-native";

export default class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onChange(event: Event) {
    if (!this.props.onChangeIndex) {
      return;
    }
    this.props.onChangeIndex(event.nativeEvent.index);
  }
  render() {
    return <RCTRangeSlider {...this.props} onChange={this._onChange} />;
  }
}

RangeSlider.propTypes = {
  rangeCount: PropTypes.number,
  barHeightPercent: PropTypes.number,
  slotRadiusPercent: PropTypes.number,
  sliderRadiusPercent: PropTypes.number,
  filledColor: PropTypes.string,
  emptyColor: PropTypes.string,
  onChangeIndex: PropTypes.func,
  ...View.propTypes // include the default view properties
};

const RCTRangeSlider = requireNativeComponent("RCTRangeSlider", RangeSlider, {
  nativeOnly: { onChange: true }
});
