import policies from "../../data/SG/policies";
import coverages from "../../data/SG/coverage";
import { QUESTION_SETS as questionSets } from "../../data/SG/questions";
import colors from "./colors";

import paClaimQuestions from "../../data/SG/paClaimQuestions";
import travelClaimQuestions from "../../data/SG/travelClaimQuestions";
import mobileClaimQuestions from "../../data/SG/mobileClaimQuestions";

import validations from "./validations";

import termsOfUseHTML from "../../documents/SG/termsOfUse";

const claimQuestionSets = {
  pa: paClaimQuestions,
  pa_mr: paClaimQuestions,
  pa_wi: paClaimQuestions,
  travel: travelClaimQuestions,
  mobile: mobileClaimQuestions
};

export default (appOptions = {
  countryCode: "SG",
  policies,
  coverages,
  questionSets,
  claimQuestionSets,
  colors,
  validations,
  termsOfUseHTML,
  parseAppId: "microumbrella",
  parseServerURL: "https://api-dev.microumbrella.com/parse",
  appseeId: "ef742ddea5f2473d8be211c148216f20"
});