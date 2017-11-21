import React from "react";
import { StyleSheet, Image } from "react-native";
import { observable, computed, asStructure } from "mobx";
import colors from "../src/styles/colors";
import policies from "../data/policies";
import coverages from "../data/coverage";
import type { Policy, Coverage } from "../src/types/policy";

import paClaimQuestions from "../data/paClaimQuestions";
import travelClaimQuestions from "../data/travelClaimQuestions";
import mobileClaimQuestions from "../data/mobileClaimQuestions";
import { QUESTION_SETS } from "../data/questions";

import termsOfUseHTML from "../documents/termsOfUse";

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
  parseAppId: string = "microumbrella";
  parseServerURL: string = "https://api-dev.microumbrella.com/parse";
  @observable colors: { [string]: string } = colors;
  policies: Array<Policy> = policies;
  coverages: { [string]: Coverage } = coverages;

  @observable introScreen = () => {};
  @observable
  authBackgroundImage = (
    <Image
      source={require("../../images/background.png")}
      style={styles.authBackgroundImage}
    />
  );

  @observable messages = [];

  validations = {};

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

  fetchPurchases(Parse, currentUser) {
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
}

singleton = new AppStore();
export default singleton;
