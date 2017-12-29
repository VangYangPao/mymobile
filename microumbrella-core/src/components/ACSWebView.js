import React, { Component } from "react";
import { WebView } from "react-native";

export default class ACSWebView extends Component {
  render() {
    return <WebView source={{ html: this.props.html }} />;
  }
}
