import React, { Component } from "react";
import { View, WebView, Dimensions } from "react-native";
import { createEasyPaySaleURL } from "./telemoney";

const windowDimensions = Dimensions.get("window");

export default class PaymentScreen extends Component {
  render() {
    const easyPayURL = createEasyPaySaleURL(10);
    console.log(easyPayURL);
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
