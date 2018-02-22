// @flow
import React from "react";
import { View } from "react-native";
import { StyleSheet, Image } from "react-native";
import Parse from "parse/react-native";
import { observable, computed, asStructure } from "mobx";
import colors from "../src/styles/colors";
import { baseValidations } from "../src/models/base-validations";
import policies from "../../data/SG/policies";
import coverages from "../../data/SG/coverage";
import type { PolicyType, CoverageType } from "../../types";

import paClaimQuestions from "../../data/SG/paClaimQuestions";
import travelClaimQuestions from "../../data/SG/travelClaimQuestions";
import mobileClaimQuestions from "../../data/SG/mobileClaimQuestions";
import { QUESTION_SETS } from "../../data/SG/questions";
import termsOfUseHTML from "../../documents/SG/termsOfUse";
import type { AppOptionsType } from "../../../types";

const styles = StyleSheet.create({
  authBackgroundImage: {
    // flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    resizeMode: "cover"
  }
});

class AppStore {
  @observable appName: string = "MicroUmbrella";
  parseAppId: string = "microumbrella";
  parseServerURL: string = "https://api-dev.microumbrella.com/parse";
  @observable colors: { [string]: string } = colors;
  @observable policies: Array<PolicyType> = policies;
  @observable coverages: { [string]: CoverageType } = coverages;
  @observable strings: { [string]: string } = {};
  chatAvatar: ?number = null;
  chatAgentName: string = "Eve";

  currency = null;
  @observable stackNavigatorScreens = {};
  @observable
  authBackgroundImage = (
    <Image
      source={require("../images/background.png")}
      style={styles.authBackgroundImage}
    />
  );

  @observable messages = [];

  validations = baseValidations;

  questionSets = {
    buy: QUESTION_SETS.buy,
    claim: QUESTION_SETS.claim
  };

  claimQuestionSets = {
    pa: paClaimQuestions,
    pa_mr: paClaimQuestions,
    pa_wi: paClaimQuestions,
    travel: travelClaimQuestions,
    mobile: mobileClaimQuestions
  };

  fetchPurchases(Parse: Parse, currentUser: Parse.User) {
    const Purchase = Parse.Object.extend("Purchase");
    const query = new Parse.Query(Purchase);
    query.equalTo("user", currentUser);
    query.notEqualTo("cancelled", true);
    query.descending("createdAt");
    return query;
  }

  pushClaimQuestionsOfType(policyType: string) {
    const questionSet = this.claimQuestionSets[policyType];
    this.questionSets.claim = QUESTION_SETS.claim.concat(questionSet);
  }

  termsOfUseHTML = termsOfUseHTML;

  screens: { [string]: Object } = {};
  controllers: { [string]: Function } = {};
  data: {
    travelBenefits?: Object,
    coverageDurations?: Object
  } = {};
  components = {
    chatWidgets: {
      responseTypes: {}
    },
    tableInputs: {}
  };
}

const singleton = new AppStore();
export default singleton;
