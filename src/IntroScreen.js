import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Button
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

    type Page = {
      title: string,
      subtitle: string,
      imageSource: String,
      type: string
    };

    const pages: Array<Page> = [
      {
        title: "Easy On-Demand\nMicro Insurance",
        subtitle: "Instant coverage at a super-low price for everyone.",
        imageSource: require("../images/parents.png"),
        type: "basics"
      },
      {
        title: "No-hassle Instant Claim",
        subtitle: "We care, so we pay claims fast.",
        imageSource: require("../images/grandparents.png"),
        type: "basic"
      },
      {
        title: "Simple, Easy and Friendly",
        subtitle: "Why we're super different:",
        imageSource: require("../images/parents.png"),
        type: "benefits"
      },
      {
        title: "Join XYZ Members\nWho Are Insured By Us",
        subtitle: "CHECK OUT OUR SUPER-LOW PRICES",
        imageSource: require("../images/parents.png"),
        type: "cta"
      }
    ];

    this.state = {
      dataSource: dataSource.cloneWithPages(pages)
    };
  }

  renderPage(page) {
    const buttonText = "CHECK OUT OUR SUPER-LOW PRICES";
    const signInButton = (
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => this.props.navigation.navigate("Drawer")}
          title={buttonText}
          color={colors.primaryOrange}
          style={styles.signinButton}
        />
      </View>
    );
    const benefits = [
      { title: "No Broker/Agent", resourceName: "ic_no_broker" },
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
        {page.type !== "benefits"
          ? <Image
              source={page.imageSource}
              resizeMode="contain"
              style={styles.image}
            />
          : null}
        <VectorDrawableView
          resourceName="ic_microassure"
          style={styles.appName}
        />
        <Text style={styles.title}>{page.title}</Text>
        {page.type === "cta"
          ? null
          : <Text style={styles.subtitle}>{page.subtitle}</Text>}
        {page.type === "benefits" ? benefitsView : null}
        {page.type === "cta" ? signInButton : null}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2
  },
  signInButton: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 3
  },
  benefitTitle: {
    textAlign: "center"
  },
  benefitIcon: {
    height: 100,
    width: 100
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
    paddingVertical: 20
  },
  benefitsView: {
    flex: 1,
    marginTop: 30
  },
  signin: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "600",
    color: colors.primaryOrange
  },
  appName: {
    height: 40,
    marginTop: 10,
    marginBottom: 25
  },
  title: {
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 28,
    textAlign: "center",
    color: colors.primaryText
  },
  subtitle: {
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center"
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
