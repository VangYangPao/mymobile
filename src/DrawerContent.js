import React, { Component } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerItems } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Parse from "parse/react-native";

import colors from "./colors";
import { Text } from "./defaultComponents";

export default class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePictureUri: null,
      fullName: null
    };
  }

  componentDidMount() {
    Parse.User.currentAsync().then(user => {
      if (user) {
        const fullName =
          currentUser.get("firstName") + " " + currentUser.get("lastName");
        this.setState({
          profilePictureUri: currentUser.get("profilePicture").url(),
          fullName
        });
      }
    });
  }

  render() {
    let image;
    if (this.profilePictureUri) {
      image = (
        <Image source={{ uri: this.profilePictureUri }} style={styles.image} />
      );
    } else {
      image = (
        <Image source={require("../images/mom.png")} style={styles.image} />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            {image}
            <Text style={styles.name}>
              {this.state.fullName || "Not logged in yet!"}
            </Text>
            {this.state.fullName ? (
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.viewEditProfile}>
                  <Text style={styles.viewEditProfileText}>
                    View / Edit profile
                  </Text>
                  <Icon
                    style={styles.viewEditProfileIcon}
                    name="mode-edit"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <DrawerItems labelStyle={styles.drawerItemLabel} {...this.props} />
        </View>
        {this.state.fullName ? (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Help")}
            >
              <View style={styles.footerBtn}>
                <Icon name="feedback" size={25} style={styles.footerBtnIcon} />
                <Text style={styles.footerBtnText}>HELP</Text>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity
            onPress={() => this.props.navigation.navigate("Legal")}
          >
            <View style={styles.footerBtn}>
              <Text style={styles.footerBtnText}>LEGAL</Text>
            </View>
          </TouchableOpacity>*/}
          </View>
        ) : null}
      </View>
    );
  }
}

const imageDim = 100;
const subtitleColor = "#757575";

const styles = StyleSheet.create({
  viewEditProfileIcon: {
    color: subtitleColor
  },
  viewEditProfileText: {
    marginRight: 7,
    color: subtitleColor
  },
  viewEditProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  drawerItemLabel: {
    marginLeft: -5
  },
  footerBtnIcon: {
    color: "#424242",
    marginRight: 10
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  footerBtnText: {
    color: "#424242",
    fontSize: 16
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  header: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 10
  },
  image: {
    height: imageDim,
    width: imageDim,
    borderRadius: imageDim / 2
  },
  name: {
    marginTop: 5
  },
  container: {
    flex: 1
  }
});
