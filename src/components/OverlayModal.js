import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { Text } from "./defaultComponents";

export default function OverlayModal(props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => {}}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.loadingText}>{props.loadingText}</Text>
        <ActivityIndicator color="white" size="large" />
      </View>
    </Modal>
  );
}

const styles = {
  loadingText: {
    marginBottom: 15,
    color: "white",
    fontSize: 20,
    fontWeight: "700"
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)"
  }
};
