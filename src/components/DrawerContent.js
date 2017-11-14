// @flow
import React, { Component } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerItems, NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Parse from "parse/react-native";

import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { Text } from "./defaultComponents";

function resetToProfileAction(currentUser) {
  const columns = [
    {
      label: "First Name",
      id: "firstName",
      value: currentUser.get("firstName")
    },
    {
      label: "Last Name",
      id: "lastName",
      value: currentUser.get("lastName")
    },
    {
      label: "Email",
      id: "email",
      value: currentUser.get("email")
    }
  ];
  const handleSaveTable = (navigation, values) => {
    values.forEach((value, idx) => {
      const column = columns[idx];
      if (column.value && column.value !== value) {
        currentUser.set(column.id, value);
      }
    });
    currentUser
      .save()
      .then(() => {
        navigation.goBack(null);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const profileParams = {
    currentUser,
    columns,
    title: "My Profile",
    onSaveTable: handleSaveTable
  };
  return NavigationActions.reset({
    key: null,
    index: 1,
    actions: [
      NavigationActions.navigate({
        routeName: "Drawer",
        action: NavigationActions.navigate({
          routeName: "DrawerClose",
          params: { currentUser }
        })
      }),
      NavigationActions.navigate({
        routeName: "Profile",
        params: profileParams
      })
    ]
  });
}

export default class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePictureUri: null,
      fullName: null
    };
  }

  render() {
    const chatRoute = this.props.navigation.state.routes[0].routes.find(
      r => r.routeName === "Chat"
    );
    if (!chatRoute) {
      return null;
    }
    let currentUser = null;
    if (chatRoute.params) {
      currentUser = chatRoute.params.currentUser;
    }
    let image, fullName;
    const defaultImage = (
      <Image source={require("../../images/mom.png")} style={styles.image} />
    );
    if (currentUser) {
      const profilePicture = currentUser.get("profilePicture");
      if (profilePicture) {
        image = (
          <Image source={{ uri: profilePicture.url() }} style={styles.image} />
        );
      } else {
        image = defaultImage;
      }
      const firstName = currentUser.get("firstName");
      const lastName = currentUser.get("lastName");
      fullName = `${firstName} ${lastName}`;
    } else {
      image = defaultImage;
    }

    const logout = () => {
      const { rootNavigation } = this.props.screenProps;
      Parse.User.logOut().then(() => {
        rootNavigation.dispatch(
          NavigationActions.reset({
            key: null,
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Intro"
              })
            ]
          })
        );
      });
    };

    const handleViewProfile = () => {
      if (currentUser) {
        const { rootNavigation } = this.props.screenProps;
        rootNavigation.dispatch(resetToProfileAction(currentUser));
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleViewProfile}>
            <View style={styles.header}>
              {image}
              <Text style={styles.name}>
                {fullName || "Not logged in yet!"}
              </Text>
              {fullName ? (
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
              ) : null}
            </View>
          </TouchableOpacity>
          <DrawerItems labelStyle={styles.drawerItemLabel} {...this.props} />
        </View>
        {fullName ? (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Help")}
            >
              <View style={styles.footerBtn}>
                <Icon name="feedback" size={25} style={styles.footerBtnIcon} />
                <Text style={styles.footerBtnText}>HELP</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <View style={styles.footerBtn}>
                <Text style={styles.footerBtnText}>LOG OUT</Text>
              </View>
            </TouchableOpacity>
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
