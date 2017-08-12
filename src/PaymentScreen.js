import React, { Component } from "react";
import { View, WebView, Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

export default class PaymentScreen extends Component {
  render() {
    const pageWidth = windowDimensions.width * windowDimensions.scale;
    return (
      <WebView
        style={{
          height: windowDimensions.height,
          width: windowDimensions.width
        }}
        scalesPageToFit={false}
        source={{ uri: easyPayURL }}
        startInLoadingState={true}
        injectedJavaScript="document.body.style.backgroundColor='red'"
      />
    );
  }
}
