import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import ViewPager from "react-native-viewpager";
import VectorDrawableView from "react-native-vectordrawable-android";

import colors from "./colors";
import PageIndicator from "./PageIndicator";

export default class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);

    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });

    const pages = [
      {
        title: "What we do",
        imageSource: require("../images/parents.png")
      },
      {
        title: "Micro-Insurance",
        imageSource: require("../images/parents.png")
      },
      {
        title: "On-demand",
        imageSource: require("../images/parents.png")
      },
      {
        title: "All done from an app",
        imageSource: require("../images/grandparents.png"),
        cta: true
      }
    ];

    this.state = {
      dataSource: dataSource.cloneWithPages(pages)
    };
  }

  renderPage(page) {
    const signInButton = (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("Drawer")}
      >
        <Text style={styles.signin}>Sign In</Text>
      </TouchableOpacity>
    );
    return (
      <View style={styles.page}>
        <Text style={styles.title}>{page.title.toUpperCase()}</Text>
        {!page.cta || signInButton}
        <Image
          source={page.imageSource}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    );
  }

  render() {
    const renderPageIndicator = props => <PageIndicator {...props} />;
    return (
      <ViewPager
        dataSource={this.state.dataSource}
        renderPage={this.renderPage}
        renderPageIndicator={renderPageIndicator}
      />
    );
  }
}

const styles = StyleSheet.create({
  signin: {
    alignSelf: 'center',
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryOrange
  },
  title: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: 24,
    color: colors.primaryText
  },
  image: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 300,
    width: Dimensions.get("window").width
  },
  page: {
    flex: 1,
    backgroundColor: "white"
  }
});
