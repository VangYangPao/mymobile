import { AppRegistry } from "react-native";
import createMicroUmbrellaApp from "../microumbrella-core";
import policies from "../data/policies";
import coverages from "../data/coverage";
import { QUESTION_SETS as questionSets } from "../data/questions";
import colors from "./styles/colors";

import paClaimQuestions from "../data/paClaimQuestions";
import travelClaimQuestions from "../data/travelClaimQuestions";
import mobileClaimQuestions from "../data/mobileClaimQuestions";

import validations from "./validations";

import termsOfUseHTML from "../documents/termsOfUse";

const claimQuestionSets = {
  pa: paClaimQuestions,
  pa_mr: paClaimQuestions,
  pa_wi: paClaimQuestions,
  travel: travelClaimQuestions,
  mobile: mobileClaimQuestions
};

const appOptions = {
  policies,
  coverages,
  questionSets,
  claimQuestionSets,
  colors,
  validations,
  termsOfUseHTML,
  parseAppId: "microumbrella",
  parseServerURL: "https://api-dev.microumbrella.com/parse"
};

AppRegistry.registerComponent("Microsurance", () =>
  createMicroUmbrellaApp(appOptions)
);
