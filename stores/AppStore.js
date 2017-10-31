import React from "react";
import { observable, computed, asStructure } from "mobx";
import defaultOptions from "../defaultOptions";
import IntroScreen from "../src/screens/IntroScreen";
import colors from "../src/styles/colors";
import policies from "../data/policies";
import coverages from "../data/coverage";
import type { Policy, Coverage } from "../src/types/policy";

import paClaimQuestions from "../data/paClaimQuestions";
import travelClaimQuestions from "../data/travelClaimQuestions";
import mobileClaimQuestions from "../data/mobileClaimQuestions";
import { QUESTION_SETS } from "../data/questions";

class AppStore {
  @observable parseAppId: string = "microumbrella";
  @observable
  parseServerURL: string = "https://api-dev.microumbrella.com/parse";
  @observable
  renderIntroScreen = ({ navigation }) => (
    <IntroScreen
      navigation={navigation}
      screenProps={{ rootNavigation: navigation }}
    />
  );
  @observable colors: { [string]: string } = colors;
  @observable policies: Array<Policy> = policies;
  @observable coverages: { [string]: Coverage } = coverages;

  @observable
  questionSets = {
    buy: QUESTION_SETS.buy,
    claim: QUESTION_SETS.claim
  };

  @observable
  claimQuestionSets = {
    pa: paClaimQuestions,
    pa_mr: paClaimQuestions,
    pa_wi: paClaimQuestions,
    travel: travelClaimQuestions,
    mobile: mobileClaimQuestions
  };

  pushClaimQuestionsOfType(policyType: string) {
    const questionSet = this.claimQuestionSets[policyType];
    this.questionSets.claim.push.apply(this.questionSets.claim, questionSet);
  }
}

singleton = new AppStore();
export default singleton;
