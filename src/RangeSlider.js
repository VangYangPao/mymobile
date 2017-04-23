import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'RangeSlider',
  propTypes: {
    rangeCount: PropTypes.number,
    barHeightPercent: PropTypes.number,
    slotRadiusPercent: PropTypes.number,
    sliderRadiusPercent: PropTypes.number,
    filledColor: PropTypes.string,
    emptyColor: PropTypes.string,
    ...View.propTypes // include the default view properties
  },
};

module.exports = requireNativeComponent('RCTRangeSlider', iface);