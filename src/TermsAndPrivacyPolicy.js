import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, WebView } from "react-native";
import { StackNavigator } from "react-navigation";
import { Text } from "./defaultComponents";
import { backButtonNavOptions } from "./navigations";
import Page from "./Page";

class FineprintScreen extends Component {}

export class PrivacyPolicyScreen extends Component {
  static navigationOptions = {
    title: "Privacy Policy"
  };

  render() {
    return (
      <Page>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat, urna eget luctus pellentesque, mauris felis porta tellus, sed convallis neque ipsum rutrum nisl. Aenean tincidunt ultricies malesuada. Etiam pellentesque sem libero, sed tempus purus rhoncus congue. Ut facilisis ex sed nibh gravida congue. Sed tempus ultrices tortor, nec varius erat vestibulum quis. Sed porta enim est. Sed semper mauris vel lacinia placerat. Etiam pulvinar orci eget tortor blandit elementum. Aliquam nec tincidunt arcu. Aenean nec enim vel neque luctus dictum.
          {"\n\n"}
          Phasellus sit amet est semper, sollicitudin sapien varius, pellentesque enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ex neque, lacinia vitae imperdiet vitae, commodo sed lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris convallis, ligula nec lobortis scelerisque, nisl leo maximus enim, nec vulputate velit mauris non lorem. Donec sed vehicula diam, in sagittis nulla. Phasellus a libero at nulla posuere viverra ut sed velit.
          {"\n\n"}
          Donec laoreet pharetra luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean id lorem sagittis, lacinia erat vel, luctus dui. Nam velit diam, maximus id eleifend nec, convallis ac enim. Cras tempor lacus non mattis sodales. Mauris odio metus, dictum ac nibh a, auctor rhoncus ipsum. Proin accumsan sit amet velit sed sollicitudin. Etiam dapibus in augue at faucibus. In pulvinar ultricies tortor, eu rutrum turpis dictum quis. Sed nec commodo enim, consequat lobortis odio. Nullam at tortor id leo vehicula rutrum vel nec diam. Sed tempus odio nibh, venenatis pretium leo pellentesque at. Maecenas pretium eros finibus elit hendrerit bibendum. Suspendisse potenti. Sed dictum porta congue. Cras ut molestie sapien.
          {"\n\n"}
          Proin venenatis pharetra est, sit amet fermentum quam. Vivamus sed congue erat. Aliquam nibh tellus, tempor in nibh faucibus, tincidunt suscipit ligula. Nunc sagittis sem vitae lacus dapibus blandit. Praesent consectetur maximus vestibulum. Cras euismod odio vel nibh eleifend maximus. Donec rutrum libero magna, sed placerat augue ullamcorper nec. Integer quis fermentum sapien. Ut ut felis pretium, molestie nulla nec, cursus felis. Sed eget ex sit amet neque efficitur feugiat. Nulla sed leo ut quam lacinia suscipit. Phasellus ac facilisis odio.
        </Text>
      </Page>
    );
  }
}

class TermsOfUseScreen extends Component {
  static navigationOptions = {
    title: "Terms of Use"
  };

  render() {
    return (
      <Page>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat, urna eget luctus pellentesque, mauris felis porta tellus, sed convallis neque ipsum rutrum nisl. Aenean tincidunt ultricies malesuada. Etiam pellentesque sem libero, sed tempus purus rhoncus congue. Ut facilisis ex sed nibh gravida congue. Sed tempus ultrices tortor, nec varius erat vestibulum quis. Sed porta enim est. Sed semper mauris vel lacinia placerat. Etiam pulvinar orci eget tortor blandit elementum. Aliquam nec tincidunt arcu. Aenean nec enim vel neque luctus dictum.
          {"\n\n"}
          Phasellus sit amet est semper, sollicitudin sapien varius, pellentesque enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ex neque, lacinia vitae imperdiet vitae, commodo sed lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris convallis, ligula nec lobortis scelerisque, nisl leo maximus enim, nec vulputate velit mauris non lorem. Donec sed vehicula diam, in sagittis nulla. Phasellus a libero at nulla posuere viverra ut sed velit.
          {"\n\n"}
          Donec laoreet pharetra luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean id lorem sagittis, lacinia erat vel, luctus dui. Nam velit diam, maximus id eleifend nec, convallis ac enim. Cras tempor lacus non mattis sodales. Mauris odio metus, dictum ac nibh a, auctor rhoncus ipsum. Proin accumsan sit amet velit sed sollicitudin. Etiam dapibus in augue at faucibus. In pulvinar ultricies tortor, eu rutrum turpis dictum quis. Sed nec commodo enim, consequat lobortis odio. Nullam at tortor id leo vehicula rutrum vel nec diam. Sed tempus odio nibh, venenatis pretium leo pellentesque at. Maecenas pretium eros finibus elit hendrerit bibendum. Suspendisse potenti. Sed dictum porta congue. Cras ut molestie sapien.
          {"\n\n"}
          Proin venenatis pharetra est, sit amet fermentum quam. Vivamus sed congue erat. Aliquam nibh tellus, tempor in nibh faucibus, tincidunt suscipit ligula. Nunc sagittis sem vitae lacus dapibus blandit. Praesent consectetur maximus vestibulum. Cras euismod odio vel nibh eleifend maximus. Donec rutrum libero magna, sed placerat augue ullamcorper nec. Integer quis fermentum sapien. Ut ut felis pretium, molestie nulla nec, cursus felis. Sed eget ex sit amet neque efficitur feugiat. Nulla sed leo ut quam lacinia suscipit. Phasellus ac facilisis odio.
        </Text>
      </Page>
    );
  }
}

export const TermsOfUseStack = StackNavigator({
  TermsOfUse: {
    screen: TermsOfUseScreen,
    navigationOptions: backButtonNavOptions
  }
});

export const PrivacyPolicyStack = StackNavigator({
  PrivacyPolicy: {
    screen: PrivacyPolicyScreen,
    navigationOptions: backButtonNavOptions
  }
});

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 18
  }
});
