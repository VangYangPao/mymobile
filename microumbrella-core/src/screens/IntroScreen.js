// @flow
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableHighlight
} from "react-native";
import ViewPager from "react-native-viewpager";
import VectorDrawableView from "../components/VectorDrawableView";

import { Text } from "../components/defaultComponents";
import Button from "../components/Button";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import PageIndicator from "../components/PageIndicator";

export default class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);

    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });

    const pages = [
      {
        title: "Easy On-Demand\nMicro Insurance",
        subtitle: "Super-Big Coverage\nat Super-Low Prices",
        imageSource: require("../../images/parents.png"),
        type: "basics"
      },
      {
        title: "Buy Instantly and\nClaim Super Fast!",
        subtitle: "We care, that's why we\nwant to pay claims fast",
        imageSource: require("../../images/grandparents.png"),
        type: "basic"
      },
      {
        title: "Simple, Easy and\nSuper User-Friendly",
        subtitle:
          "Here are the reasons why we\nare different from other insurers",
        type: "benefits"
      },
      {
        title: "Join 1,000 Members\nWho Are Protected By Us",
        imageSource: require("../../images/grandparents.png"),
        type: "cta"
      }
    ];

    this.state = {
      dataSource: dataSource.cloneWithPages(pages)
    };
  }

  renderPage(page) {
    const buttonText = "CHECK OUT OUR SUPER-BIG COVERAGE\nAT SUPER-LOW PRICES";
    const signInButton = (
      <Button
        onPress={() =>
          this.props.navigation.navigate("TermsOfUse", { page: "Drawer" })}
        containerStyle={styles.buttonContainer}
        style={styles.signInButton}
      >
        {buttonText}
      </Button>
    );

    const benefits = [
      { title: "Low Price", resourceName: "ic_low_price" },
      {
        title: "Comprehensive Coverage",
        resourceName: "ic_comprehensive_coverage"
      },
      { title: "User Friendly App", resourceName: "ic_user_friendly" },
      { title: "Simple Terms", resourceName: "ic_simple_terms" },
      { title: "Algorithm Powered", resourceName: "ic_algorithm_powered" },
      { title: "Click to Claim", resourceName: "ic_click_to_claim" }
    ];
    const renderBenefit = b => (
      <View style={styles.benefit} key={b.resourceName}>
        <VectorDrawableView
          resourceName={b.resourceName}
          style={styles.benefitIcon}
        />
        <Text style={styles.benefitTitle}>{b.title}</Text>
      </View>
    );
    const benefitsView = (
      <View style={styles.benefitsView}>
        <View style={styles.benefitsContainer}>
          {benefits.slice(0, 3).map(renderBenefit)}
        </View>
        <View style={styles.benefitsContainer}>
          {benefits.slice(3, 6).map(renderBenefit)}
        </View>
      </View>
    );
    return (
      <View style={styles.page}>
        <View accessibilityLabel="intro__logo" style={styles.appNameContainer}>
          <VectorDrawableView
            resourceName="ic_microumbrella_word"
            style={styles.appName}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{page.title}</Text>
          {page.type === "cta" ? null : (
            <Text style={styles.subtitle}>{page.subtitle}</Text>
          )}
          {page.type === "cta" ? signInButton : null}
        </View>
        {page.type === "benefits" ? benefitsView : null}
        {page.type !== "benefits" ? (
          <Image
            source={page.imageSource}
            resizeMode="contain"
            style={styles.image}
          />
        ) : null}
      </View>
    );
  }

  render() {
    console.log(this.props.navigation);
    const renderPageIndicator = props => <PageIndicator {...this.props} />;
    return (
      <ViewPager
        dataSource={this.state.dataSource}
        renderPage={this.renderPage}
        renderPageIndicator={renderPageIndicator}
      />
    );
  }
}

const windowDim = Dimensions.get("window");
const windowWidth = windowDim.width;
const backgroundImagePercent = 0.95;
const backgroundImageWidth = windowWidth * backgroundImagePercent;
const backgroundImageHoriPadding =
  windowWidth * ((1 - backgroundImagePercent) / 2);

const appNamePercentage = 0.15;
const contentPercentage = 0.35;
const bottomContainerPercentage = 0.6;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center"
  },
  signInButton: {
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  benefitTitle: {
    textAlign: "center",
    marginTop: 7
  },
  benefitIcon: {
    height: 80,
    width: 80
  },
  benefit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  benefitsContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  benefitsView: {
    flex: bottomContainerPercentage,
    alignItems: "center",
    justifyContent: "center"
    // position: "absolute",
    // bottom: 0,
    // left: backgroundImageHoriPadding,
    // right: backgroundImageHoriPadding
  },
  contentContainer: {
    flex: contentPercentage,
    alignItems: "center",
    justifyContent: "center"
  },
  signin: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "600",
    color: colors.primaryAccent
  },
  appNameContainer: {
    flex: appNamePercentage
  },
  appName: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: windowWidth * 0.2,
    marginTop: windowDim.height * appNamePercentage * 0.1
  },
  title: {
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 23,
    textAlign: "center",
    color: colors.primaryText
  },
  subtitle: {
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    color: colors.primaryText
  },
  image: {
    // zIndex: 2,
    flex: bottomContainerPercentage,
    width: backgroundImageWidth,
    marginLeft: backgroundImageHoriPadding,
    marginRight: backgroundImageHoriPadding
  },
  page: {
    flex: 1,
    backgroundColor: "white"
  }
});
