import React, { Component } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { DrawerItems } from "react-navigation";

export default class DrawerContent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://www.drive.ai/images/team/Tao.png" }}
            style={styles.image}
          />
          <Text style={styles.name}>Denzel Tan</Text>
        </View>
        <DrawerItems {...this.props} />
      </View>
    );
  }
}

const imageDim = 100;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  image: {
    height: imageDim,
    width: imageDim,
    borderRadius: imageDim / 2
  },
  name: {
    marginTop: 5,
  },
  container: {
    flex: 1
  }
});
