import React, { Component } from "react";
import { Platform, Image } from "react-native";
import AndroidVectorDrawableView from "react-native-vectordrawable-android";

export default class VectorDrawableView extends Component {
  render() {
    const { resourceName, style } = this.props;
    if (Platform.OS === "android") {
      return (
        <AndroidVectorDrawableView
          resourceName={androidResourceName}
          style={style}
        />
      );
    }
    const iosResourceUri = resourceName.slice(3).replace(/_/g, "-") + ".png";
    console.log(iosResourceUri);
    return (
      <Image
        source={{ uri: iosResourceUri }}
        resizeMode="contain"
        style={style}
      />
    );
  }
}
